// ---------- Estado ----------
let products = [
  { id: "p1", name: "Ácido Sulfúrico 98%", code: "H2SO4-98", density: 1.84, ph: 1.0, stock: 220, hazard: "alto" },
  { id: "p2", name: "Hidróxido de Sódio 50%", code: "NAOH-50", density: 1.52, ph: 13.5, stock: 180, hazard: "alto" },
  { id: "p3", name: "Água Desmineralizada", code: "H2O-DM", density: 1.00, ph: 7.0, stock: 5000, hazard: "baixo" },
  { id: "p4", name: "Etanol Anidro", code: "ETOH-99", density: 0.79, ph: 7.0, stock: 640, hazard: "moderado" },
];

let mix = [{ productId: "p1", volume: 0 }];

const palette = [
  "oklch(0.45 0.15 240)",
  "oklch(0.65 0.14 200)",
  "oklch(0.62 0.17 155)",
  "oklch(0.78 0.16 75)",
  "oklch(0.58 0.22 27)",
  "oklch(0.55 0.15 300)",
];
function barColor(i) { return palette[i % palette.length]; }

// ---------- Toast ----------
function toast(title, { desc = "", type = "success" } = {}) {
  const container = document.getElementById("toast-container");
  const el = document.createElement("div");
  el.className = `toast ${type === "error" ? "error" : ""}`;
  el.innerHTML = `<div class="toast-title">${title}</div>${desc ? `<div class="toast-desc">${desc}</div>` : ""}`;
  container.appendChild(el);
  setTimeout(() => el.remove(), 3500);
}

// ---------- Cálculo da mistura ----------
function computeResult() {
  const rows = mix
    .map((r) => ({ ...r, product: products.find((p) => p.id === r.productId) }))
    .filter((r) => r.product && r.volume > 0);

  const totalVolume = rows.reduce((s, r) => s + r.volume, 0);
  const totalMass = rows.reduce((s, r) => s + r.volume * (r.product.density * 1000), 0);
  const density = totalVolume > 0 ? totalMass / (totalVolume * 1000) : 0;

  const hSum = rows.reduce((s, r) => s + r.volume * Math.pow(10, -r.product.ph), 0);
  const ph = totalVolume > 0 ? -Math.log10(hSum / totalVolume) : 0;

  const composition = rows.map((r) => ({
    id: r.product.id,
    name: r.product.name,
    hazard: r.product.hazard,
    percent: totalVolume > 0 ? (r.volume / totalVolume) * 100 : 0,
    volume: r.volume,
  }));

  const stockIssues = rows.filter((r) => r.volume > r.product.stock).map((r) => r.product.name);

  const hazardLevel = rows.some((r) => r.product.hazard === "alto")
    ? "alto"
    : rows.some((r) => r.product.hazard === "moderado")
      ? "moderado"
      : "baixo";

  const riskLabel =
    hazardLevel === "alto" ? "Corrosivo · Classe 8" :
    hazardLevel === "moderado" ? "Inflamável · Classe 3" : "Não perigoso";

  const compatible = stockIssues.length === 0 && composition.length > 0;
  const temp = totalVolume > 0 ? 25 + rows.length * 2 + density * 3 : 0;

  return { totalVolume, totalMass, density, ph, composition, stockIssues, hazardLevel, riskLabel, compatible, temp };
}

// ---------- Render: Estoque ----------
function renderStock() {
  const list = document.getElementById("stock-list");
  document.getElementById("stock-count").textContent = `${products.length} produtos disponíveis`;
  list.innerHTML = products.map((p) => `
    <div class="stock-item">
      <div class="stock-item-name">${escapeHtml(p.name)}</div>
      <div class="stock-item-code">${escapeHtml(p.code)}</div>
      <div class="stock-item-meta">
        <span>ρ ${p.density} g/mL</span>
        <span>pH ${p.ph}</span>
        <span class="stock-vol">${p.stock} L</span>
      </div>
    </div>
  `).join("");
}

// ---------- Render: Linhas de mistura ----------
function renderMixRows() {
  const container = document.getElementById("mix-rows");
  container.innerHTML = mix.map((row, i) => {
    const p = products.find((x) => x.id === row.productId);
    const overStock = p && row.volume > p.stock;
    const options = products.map((prod) =>
      `<option value="${prod.id}" ${prod.id === row.productId ? "selected" : ""}>${escapeHtml(prod.name)}</option>`
    ).join("");
    return `
      <div class="mix-row" data-index="${i}">
        <select class="row-product" data-index="${i}">${options}</select>
        <div class="vol-wrap ${overStock ? "over" : ""}">
          <input type="number" class="row-volume" data-index="${i}" min="0" step="0.1" value="${row.volume}" />
          <span class="vol-suffix">L</span>
        </div>
        <button class="btn-remove" data-index="${i}" ${mix.length === 1 ? "disabled" : ""} aria-label="Remover">🗑</button>
      </div>
    `;
  }).join("");

  container.querySelectorAll(".row-product").forEach((el) => {
    el.addEventListener("change", (e) => {
      const i = Number(e.target.dataset.index);
      mix[i].productId = e.target.value;
      renderAll();
    });
  });
  container.querySelectorAll(".row-volume").forEach((el) => {
    el.addEventListener("input", (e) => {
      const i = Number(e.target.dataset.index);
      mix[i].volume = parseFloat(e.target.value) || 0;
      renderAll();
    });
  });
  container.querySelectorAll(".btn-remove").forEach((el) => {
    el.addEventListener("click", (e) => {
      const i = Number(e.currentTarget.dataset.index);
      mix.splice(i, 1);
      renderAll();
    });
  });
}

// ---------- Render: Resultado ----------
function renderResult() {
  const result = computeResult();

  document.getElementById("m-volume").textContent = `${result.totalVolume.toFixed(0)} L`;
  document.getElementById("m-ph").textContent = result.ph > 0 ? result.ph.toFixed(1) : "—";
  document.getElementById("m-density").textContent = result.density > 0 ? `${result.density.toFixed(2)} g/cm³` : "—";
  document.getElementById("m-temp").textContent = result.temp > 0 ? `${result.temp.toFixed(0)} °C` : "—";
  document.getElementById("m-risk").textContent = result.composition.length > 0 ? result.riskLabel : "—";

  // Barra de composição
  const bar = document.getElementById("composition-bar");
  bar.innerHTML = result.composition.map((c, idx) =>
    `<div style="width:${c.percent}%; background-color:${barColor(idx)}" title="${escapeHtml(c.name)} · ${c.percent.toFixed(1)}%"></div>`
  ).join("");

  // Lista de composição
  const list = document.getElementById("composition-list");
  if (result.composition.length === 0) {
    list.innerHTML = `<li class="empty">Adicione componentes para visualizar</li>`;
  } else {
    list.innerHTML = result.composition.map((c, idx) => `
      <li>
        <span class="comp-name">
          <span class="comp-dot" style="background-color:${barColor(idx)}"></span>
          <span>${escapeHtml(c.name)}</span>
        </span>
        <span class="comp-pct">${c.percent.toFixed(0)}%</span>
      </li>
    `).join("");
  }

  // Alerta de estoque
  const alertBox = document.getElementById("stock-alert");
  if (result.stockIssues.length > 0) {
    alertBox.classList.remove("hidden");
    document.getElementById("stock-alert-desc").textContent = result.stockIssues.join(", ");
  } else {
    alertBox.classList.add("hidden");
  }

  // Status pill
  const statusPill = document.getElementById("status-pill");
  const statusText = document.getElementById("status-text");
  if (result.compatible) {
    statusPill.classList.add("compatible");
    statusText.textContent = "Mistura Compatível";
  } else {
    statusPill.classList.remove("compatible");
    statusText.textContent = "Aguardando dados";
  }

  // Botão salvar
  const saveBtn = document.getElementById("btn-save");
  saveBtn.disabled = !result.compatible;
  saveBtn.onclick = () => {
    toast("Simulação salva", { desc: `Batelada de ${result.totalVolume.toFixed(2)} L registrada.` });
  };
}

function renderAll() {
  renderStock();
  renderMixRows();
  renderResult();
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// ---------- Ações globais ----------
document.getElementById("btn-reset").addEventListener("click", () => {
  mix = [{ productId: products[0]?.id ?? "", volume: 0 }];
  renderAll();
});

document.getElementById("btn-add-row").addEventListener("click", () => {
  if (mix.length >= 8) return;
  mix.push({ productId: products[0]?.id ?? "", volume: 0 });
  renderAll();
});

// ---------- Modal: Novo Produto ----------
const modalOverlay = document.getElementById("modal-overlay");
document.getElementById("btn-new-product").addEventListener("click", () => {
  modalOverlay.classList.remove("hidden");
});
document.getElementById("btn-cancel-product").addEventListener("click", closeModal);
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) closeModal();
});
function closeModal() {
  modalOverlay.classList.add("hidden");
  document.getElementById("f-name").value = "";
  document.getElementById("f-code").value = "";
  document.getElementById("f-density").value = "1";
  document.getElementById("f-ph").value = "7";
  document.getElementById("f-stock").value = "0";
  document.getElementById("f-hazard").value = "baixo";
}

document.getElementById("f-code").addEventListener("input", (e) => {
  e.target.value = e.target.value.toUpperCase();
});

document.getElementById("btn-submit-product").addEventListener("click", () => {
  const name = document.getElementById("f-name").value.trim();
  const code = document.getElementById("f-code").value.trim();
  if (!name || !code) {
    toast("Preencha nome e código", { type: "error" });
    return;
  }
  const newProduct = {
    id: "p" + Date.now(),
    name,
    code,
    density: parseFloat(document.getElementById("f-density").value) || 0,
    ph: parseFloat(document.getElementById("f-ph").value) || 0,
    stock: parseFloat(document.getElementById("f-stock").value) || 0,
    hazard: document.getElementById("f-hazard").value,
  };
  products.push(newProduct);
  toast("Produto cadastrado", { desc: newProduct.name });
  closeModal();
  renderAll();
});

// ---------- Inicialização ----------
renderAll();
