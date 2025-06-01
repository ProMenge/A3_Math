# OCULAR

Um editor de imagens interativo e acessível, desenvolvido com **React** e **Tailwind CSS**, que permite aplicar filtros personalizáveis usando **matrizes de convolução** e manipulação de **canais RGB**.

Este projeto foi criado com fins educacionais e práticos, visando demonstrar o funcionamento de filtros aplicados em imagens com base em **kernels** (máscaras) definidos pelo usuário ou pré-configurados.

---

## Funcionalidades

A aplicação permite o carregamento de uma imagem, e após carregada, o tratamento é feito através de **três abas principais**:

### 1. Filtros Pré-definidos

- Conjunto de filtros clássicos e variações dos mesmos, tendo:
  - Desfoque
  - Nitidez
  - Relevo
  - Detecção de Bordas
- Cada filtro pode ter sua **intensidade ajustada** por sliders abaixo da seleção.
- A aplicação pode ser feita após selecionar um dos filtros, e instantâneamente é aplicada na imagem escolhida.
- A remoção dos filtros pode ser feita a qualquer momento, para retornar a imagem ao seu estado inicial.

### 2. Controle de Canais RGB

- Três sliders independentes permitem ajustar a intensidade dos canais:
  - 🔴 Vermelho
  - 🟢 Verde
  - 🔵 Azul
- Perfeito para efeitos estilizados e manipulação básica de cor.
- Os sliders podem ser ajustados juntamente com a aplicação de filtros.

### 3. Editor de Kernel Customizado

- Interface com um **grid 3x3** onde o usuário pode digitar livremente os valores do kernel (máscara de convolução).
- Permite aplicar **filtros personalizados** com base em qualquer matriz definida.
- Ideal para fins educativos ou testes de novos efeitos visuais.

---

## Tecnologias Utilizadas

- **React.js** – Biblioteca para construção de interfaces reativas.
- **Tailwind CSS** – Framework utilitário para estilização moderna.
- **Framer Motion** – Biblioteca de animações usada para interações visuais suaves.
- **TypeScript** – Linguagem capaz de garantir a funcionalidade eficiente do site.
- **Vite** – Ferramenta de organização ágil.
- **Eslint** – Ferramenta para fatoração total do projeto.

---

## Instalação e Execução

### Pré-requisitos

- Node.js (v18 ou superior)
- npm

### Link para acessar o site funcional

🔗 *[Link para a o github pages]*

### Passos para rodar localmente:

```bash
# Extraia o .zip em uma pasta local

# Abra a pasta em seu VSCODE

# Com o terminal aberto, instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev

# Acesse no navegador
http://localhost:5173
