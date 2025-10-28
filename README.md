# Engenharia Orofacial - Escudo Orofacial

### Landing Page: Apresentação do Sistema de https://engenhariaorofacial.com.br

O projeto **`AnaliseFacial_Front`** serve como a **Landing Page** oficial para o sistema de Análise Orofacial. Seu principal objetivo é **apresentar o produto/serviço**, destacar suas capacidades (incluindo a visualização 3D), e guiar os visitantes a uma chamada para ação (Call to Action - CTA), seja para saber mais ou entrar em contato.

-----

### ✨ Destaques e Conteúdo

Por ser uma Landing Page, o foco está na comunicação e no design.

  * **Design de Alto Impacto:** Estrutura focada em converter visitantes, com um visual limpo e profissional.
  * **Visualização 3D:** Exibição interativa de um modelo facial 3D (`.glb`) para demonstrar o potencial de visualização do sistema.
  * **Seções Informativas:**
      * **Proposta de Valor:** O que o sistema oferece e qual problema ele resolve.
      * **Funcionalidades Chave:** Lista concisa dos principais recursos da Análise Facial.
      * **Chamada para Ação (CTA):** Botões ou formulários para capturar leads ou direcionar o usuário para o sistema principal.
  * **Totalmente Estática:** Construído para ser leve, rápido e fácil de hospedar (ideal para serviços como GitHub Pages, como o `CNAME` sugere).

-----

### 🛠️ Tecnologias Utilizadas

Este é um projeto de frontend estático e leve.

  * **HTML5:** Estrutura semântica da página.
  * **CSS3:** Estilização, layout responsivo e animações visuais.
  * **JavaScript (Vanilla):** Responsável por interações simples (como navegação mobile, carrosséis) e o carregamento/manipulação do modelo 3D.
  * **Visualização 3D:** Utiliza o arquivo `.glb`, o que implica no uso de uma biblioteca JS para renderização 3D (ex: Three.js ou Babylon.js).

-----

### ⚙️ Pré-requisitos

Para rodar este projeto, você precisa apenas de:

  * Um **Navegador Web** moderno (Chrome, Firefox, Edge, Safari).

### 🚀 Instalação e Execução

O projeto é 100% estático e foi feito para ser executado de forma imediata.

1.  **Clone o Repositório:**

    ```bash
    git clone https://github.com/THOTIACORP/AnaliseFacial_Front.git
    cd AnaliseFacial_Front
    ```

2.  **Abra a Landing Page:**

      * Simplesmente abra o arquivo `index.html` no seu navegador.

          * `caminho/para/AnaliseFacial_Front/index.html`

      * **Recomendado (Servidor Local):** Para evitar problemas de CORS ao carregar o modelo `.glb`, use um servidor web simples (ex: Live Server ou `http-server`):

        ```bash
        npx http-server
        ```

3.  **Acesse:**
    A página será carregada no seu navegador (ex: `http://localhost:8080`).

-----

### 🌐 Hospedagem (GitHub Pages)

O projeto está configurado para ser hospedado via GitHub Pages, conforme indicado pelo arquivo `CNAME`.

O arquivo `CNAME` indica que a landing page pode ser acessada em um domínio personalizado (se configurado) ou diretamente através do GitHub Pages, tornando a implantação extremamente simples.

-----

### 🤝 Contribuição

Contribuições para melhorias no design, usabilidade e otimização são muito bem-vindas\!

1.  Faça um **Fork** do projeto.
2.  Crie uma nova branch: `git checkout -b feature/melhoria-design`.
3.  Faça suas alterações e commit: `git commit -m 'feat: Otimiza a seção de destaque'`.
4.  Abra um **Pull Request**.

-----
