/* ============================================================
   CAROUSEL UNIFICADO COM DOTS (PROJETOS, NOTÍCIAS E BOLSISTAS)
   ============================================================ */

const carrosséis = document.querySelectorAll(".bolsistas-carousel, .projetos-carousel, .noticias-section");

carrosséis.forEach(container => {
    // 1. Localização dos elementos internos
    const track = container.querySelector(".bolsistas-track, #projetosTrack, #noticiasTrack");
    const dotsContainer = container.querySelector(".dots-container");
    const slides = track?.querySelectorAll(".bolsista-slide, .projeto-slide, .noticia-slide");
    
    if (!track || !slides || slides.length === 0) return;

    // 2. Lógica de criação dos DOTS
    if (dotsContainer) {
        dotsContainer.innerHTML = ""; // Limpa dots existentes
        slides.forEach((_, index) => {
            const dot = document.createElement("button");
            dot.classList.add("carousel-dot");
            if (index === 0) dot.classList.add("active"); // Primeiro começa ativo
            
            // Estilo básico caso não esteja no seu CSS (opcional)
            dot.style.cursor = "pointer";
            
            dot.addEventListener("click", () => {
                const scrollPos = slides[index].offsetLeft - track.offsetLeft;
                track.scrollTo({ left: scrollPos, behavior: "smooth" });
            });
            dotsContainer.appendChild(dot);
        });
    }

    // 3. Sincronização dos DOTS com o Scroll
    const updateDots = () => {
        if (!dotsContainer) return;
        const scrollLeft = track.scrollLeft;
        const slideWidth = slides[0].offsetWidth;
        const activeIndex = Math.round(scrollLeft / slideWidth);

        const dots = dotsContainer.querySelectorAll(".carousel-dot");
        dots.forEach((dot, i) => {
            dot.classList.toggle("active", i === activeIndex);
        });
    };

    // Escuta o scroll para mover os dots
    track.addEventListener("scroll", () => {
        clearTimeout(track.scrollTimeout);
        track.scrollTimeout = setTimeout(updateDots, 50);
    });

    // 4. Lógica de Botões e Arrastar (Mantida do seu original)
    const btnNext = container.querySelector(".bolsistas-btn.next, .carousel-btn.right, .noticias-btn.right");
    const btnPrev = container.querySelector(".bolsistas-btn.prev, .carousel-btn.left, .noticias-btn.left");

    let isDown = false;
    let startX;
    let scrollLeftPos;

    const scrollManual = (direction) => {
        const amount = track.clientWidth * 0.8;
        track.scrollBy({ left: amount * direction, behavior: "smooth" });
    };

    btnNext?.addEventListener("click", () => scrollManual(1));
    btnPrev?.addEventListener("click", () => scrollManual(-1));

    /* --- MOUSE (DESKTOP) --- */
    track.addEventListener("mousedown", e => {
        isDown = true;
        startX = e.pageX - track.offsetLeft;
        scrollLeftPos = track.scrollLeft;
        track.classList.add("dragging");
        track.style.scrollBehavior = "auto";
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
        track.scrollLeft = scrollLeftPos - walk;
    });

    /* --- TOUCH (MOBILE) --- */
    track.addEventListener("touchstart", e => {
        startX = e.touches[0].pageX;
        scrollLeftPos = track.scrollLeft;
        track.style.scrollBehavior = "auto";
    });

    track.addEventListener("touchmove", e => {
        const x = e.touches[0].pageX;
        const walk = (x - startX) * 1.5;
        track.scrollLeft = scrollLeftPos - walk;
    });

    track.addEventListener("touchend", () => {
        track.style.scrollBehavior = "smooth";
    });
});

/* Funções Legadas para compatibilidade HTML */
function scrollProjetos(direction) {
    const t = document.getElementById("projetosTrack");
    t?.scrollBy({ left: (t.clientWidth * 0.9) * direction, behavior: "smooth" });
}

function scrollNoticias(direction) {
    const t = document.getElementById("noticiasTrack");
    t?.scrollBy({ left: (t.clientWidth * 0.9) * direction, behavior: "smooth" });
}