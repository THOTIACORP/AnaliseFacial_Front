
// Detecta se é WebView do Instagram/Facebook/Messenger
const isMetaWebView = () => {
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    return /Instagram|FBAV|FBAN|Messenger/i.test(ua);
};

document.addEventListener("DOMContentLoaded", () => {
    const demoButton = document.querySelector('a[href*="analiseOrofacial"]'); // Botão "Fazer Demonstração"

    if (demoButton && isMetaWebView()) {
        // Intercepta o clique
        demoButton.addEventListener("click", (event) => {
            event.preventDefault(); // bloqueia a tentativa de abrir o link

            // 1. SOLUÇÃO CONTRA LOOP DE RECARGA:
            // Cria um novo estado de histórico antes de mostrar o overlay.
            // Isso faz com que o botão "Voltar" do app ignore o overlay e retorne ao estado limpo.
            history.replaceState(null, '', window.location.href);

            // Cria o overlay de bloqueio
            const overlay = document.createElement("div");
            overlay.id = "meta-block-overlay"; // ID para fácil remoção
            overlay.style.position = "fixed";
            overlay.style.top = "0";
            overlay.style.left = "0";
            overlay.style.width = "100%";
            overlay.style.height = "100vh";
            overlay.style.backgroundColor = "#0d1117";
            overlay.style.display = "flex";
            overlay.style.flexDirection = "column";
            overlay.style.alignItems = "center";
            overlay.style.justifyContent = "center";
            overlay.style.zIndex = "999999";
            overlay.style.textAlign = "center";
            overlay.style.color = "#fff";
            overlay.style.padding = "20px";
            overlay.style.transition = "opacity 0.3s";

            // Conteúdo do overlay
            const content = document.createElement("div");
            content.innerHTML = `
                    <h2 style="font-size: 24px; font-weight: bold; margin-bottom: 20px;">
                        Atenção! Restrição de Navegação 🚨
                    </h2>
                    <button id="openExternalBtn"
                        class="px-8 py-3 font-bold text-white bg-red-600 rounded-xl shadow-lg shadow-red-200 hover:bg-red-700 transform hover:scale-105 transition duration-300">
                        Abrir no Navegador Externo 🔗
                    </button>
                    <p style="max-width: 320px; margin-top: 16px; font-size: 15px; line-height: 1.6;">
                        🚫 O navegador do Instagram/Facebook bloqueia o acesso ao prontuário e ao laudo.
                        <br><br>
                        Toque no botão acima para **continuar no seu navegador padrão** (Chrome/Safari) e acessar a demonstração completa.
                    </p>
                `;
            overlay.appendChild(content);

            // 2. INSERIR O OVERLAY POR CIMA E ESCONDER CONTEÚDO
            document.body.appendChild(overlay);
            document.body.style.overflow = "hidden"; // bloqueia rolagem

            const openExternalBtn = document.getElementById("openExternalBtn");
            const targetUrl = demoButton.href;

            // 3. Lógica de abertura externa ao clicar
            openExternalBtn.addEventListener("click", () => {
                // Remove o overlay antes de tentar a navegação
                overlay.style.opacity = '0';
                setTimeout(() => overlay.remove(), 300);
                document.body.style.overflow = "auto";

                try {
                    // Tenta abrir no Chrome (Android)
                    const chromeUrl = targetUrl.replace(/https?:\/\//, "googlechrome://");
                    window.location.href = chromeUrl;

                    // Tenta Safari (iOS)
                    setTimeout(() => {
                        const safariUrl = targetUrl.replace(/https?:\/\//, "x-callback-url://");
                        window.location.href = safariUrl;
                    }, 150);

                    // Tenta método padrão (_system)
                    setTimeout(() => {
                        window.open(targetUrl, "_system");
                    }, 300);

                    // Se ainda falhar (bloqueio)
                    setTimeout(() => {
                        alert(
                            "Se a demonstração não abriu automaticamente:\n\n" +
                            "1️⃣ Toque nos três pontos no canto superior.\n" +
                            "2️⃣ Selecione 'Abrir no navegador' ou 'Copiar link'.\n" +
                            "3️⃣ Abra o Chrome/Safari e cole o link."
                        );
                    }, 600);
                } catch (error) {
                    alert(
                        "O aplicativo bloqueou a abertura externa. Toque nos três pontos e escolha 'Abrir no navegador'."
                    );
                }
            });
        });
    }
});
