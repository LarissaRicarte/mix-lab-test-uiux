# MixLab — Simulador de Misturas Químicas

Protótipo funcional (front-end) de uma ferramenta para simulação de misturas de produtos químicos industriais. O usuário seleciona insumos disponíveis em estoque, define volumes e visualiza em tempo real o resultado da composição: volume total, pH estimado, densidade, temperatura de reação e classificação de risco.

🔗 **Demo:** [mix-lab-phi.vercel.app](https://mix-lab-phi.vercel.app)

## Sobre o projeto

Este projeto foi desenvolvido como desafio técnico para uma vaga de Product/UI-UX Designer, com foco em demonstrar não apenas a fidelidade visual do design, mas também raciocínio de produto: estados de interface (padrão, vazio, erro), validação de estoque insuficiente e cadastro de novos produtos.

## Funcionalidades

- **Simulação em tempo real** — ao adicionar produtos e volumes na composição, os indicadores (volume total, pH, densidade, temperatura, risco) são recalculados automaticamente.
- **Estoque de produtos** — lista de insumos disponíveis, com densidade, pH e volume em estoque.
- **Cadastro de novo produto** — modal para registrar um novo insumo (nome, código, densidade, pH, estoque, nível de risco).
- **Composição por volume** — barra e legenda mostrando a proporção de cada produto na mistura final.
- **Alerta de estoque insuficiente** — validação que impede simulações com volume acima do disponível.
- **Status de compatibilidade** — indicador visual do resultado da mistura (compatível / aguardando dados).
- **Reset rápido** — botão para limpar a simulação e recomeçar.

## Tecnologias

- HTML5 semântico
- CSS3 (sem framework)
- JavaScript vanilla (manipulação de DOM, sem dependências de build)
- [Lucide Icons](https://lucide.dev/) via CDN

## Estrutura do projeto

```
mix-lab-test-uiux/
├── index.html      # Estrutura da página e markup dos componentes
├── styles.css       # Estilos visuais
├── app.js           # Lógica de simulação, estado e interações
└── README.md
```

## Como rodar localmente

Não há build nem dependências para instalar — é um projeto estático.

```bash
git clone https://github.com/LarissaRicarte/mix-lab-test-uiux.git
cd mix-lab-test-uiux
```

Depois, basta abrir o `index.html` diretamente no navegador, ou servir a pasta com qualquer servidor estático, por exemplo:

```bash
npx serve .
```

## Design

O design da interface foi construído no Figma, cobrindo os fluxos de estado padrão e estado vazio em resoluções desktop (1440px) e Full HD (1920px), antes da implementação em código.
[Figma - Mix Lab](https://www.figma.com/design/242ko3kLMowwr8GONY5Rg1/MixLab---Optimatech?node-id=40-405&t=rvLSSae5uXXDR3mE-1)


## Autora

**Larissa Ricarte** — UX/UI & Product Designer
[Portfolio - Ricarte Design](https://ricartedesign.vercel.app/)
