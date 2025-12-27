/* ============================================================
   CAROUSEL UNIFICADO (PROJETOS, NOTÍCIAS E BOLSISTAS)
   ============================================================ */

// Seletor que pega os containers de Bolsistas E os IDs de Projetos/Notícias
const carrosséis = document.querySelectorAll(".bolsistas-carousel, #projetosTrack, #noticiasTrack");

carrosséis.forEach(container => {
    // Identifica se o container é o próprio track (ID) ou se tem um track dentro (.bolsistas-track)
    const track = container.classList.contains("bolsistas-carousel") 
                  ? container.querySelector(".bolsistas-track") 
                  : container;

    // Localiza os botões (para Projetos/Notícias, busca pelo onclick ou ID se existirem)
    const btnNext = container.parentElement.querySelector(".bolsistas-btn.next, #btnNextProj, #btnNextNot");
    const btnPrev = container.parentElement.querySelector(".bolsistas-btn.prev, #btnPrevProj, #btnPrevNot");

    let isDown = false;
    let startX;
    let scrollLeft;

    /* --- BOTÕES --- */
    const scrollManual = (direction) => {
        const amount = track.clientWidth * 0.8;
        track.scrollBy({ left: amount * direction, behavior: "smooth" });
    };

    // Aplica a lógica aos botões se eles existirem
    btnNext?.addEventListener("click", () => scrollManual(1));
    btnPrev?.addEventListener("click", () => scrollManual(-1));

    /* --- MOUSE (DESKTOP) --- */
    track.addEventListener("mousedown", e => {
        isDown = true;
        startX = e.pageX - track.offsetLeft;
        scrollLeft = track.scrollLeft;
        track.classList.add("dragging");
        track.style.scrollBehavior = "auto"; // Melhora a resposta ao arrastar
    });

    track.addEventListener("mouseleave", () => {
        isDown = false;
        track.classList.remove("dragging");
    });

    track.addEventListener("mouseup", () => {
        isDown = false;
        track.classList.remove("dragging");
        track.style.scrollBehavior = "smooth";
    });

    track.addEventListener("mousemove", e => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - track.offsetLeft;
        const walk = (x - startX) * 1.5;
        track.scrollLeft = scrollLeft - walk;
    });

    /* --- TOUCH (MOBILE) --- */
    track.addEventListener("touchstart", e => {
        startX = e.touches[0].pageX;
        scrollLeft = track.scrollLeft;
        track.style.scrollBehavior = "auto";
    });

    track.addEventListener("touchmove", e => {
        const x = e.touches[0].pageX;
        const walk = (x - startX) * 1.5;
        track.scrollLeft = scrollLeft - walk;
    });

    track.addEventListener("touchend", () => {
        track.style.scrollBehavior = "smooth";
    });
});

// Mantemos as funções originais apenas para compatibilidade com os 'onclick' do HTML
function scrollProjetos(direction) {
    document.getElementById("projetosTrack")?.scrollBy({ 
        left: (document.getElementById("projetosTrack").clientWidth * 0.9) * direction, 
        behavior: "smooth" 
    });
}

function scrollNoticias(direction) {
    document.getElementById("noticiasTrack")?.scrollBy({ 
        left: (document.getElementById("noticiasTrack").clientWidth * 0.9) * direction, 
        behavior: "smooth" 
    });
}