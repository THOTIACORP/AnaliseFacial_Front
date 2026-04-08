/* ============================================================
   CAROUSEL UNIFICADO COM DOTS (PROJETOS, NOTICIAS E BOLSISTAS)
   ============================================================ */

const carrosseis = document.querySelectorAll(".bolsistas-carousel, .projetos-carousel, .noticias-section");

function getCarouselConfig(container) {
  if (container.classList.contains("bolsistas-carousel")) {
    return {
      track: container.querySelector(":scope > .bolsistas-track"),
      dotsContainer: container.querySelector(":scope > .dots-container"),
      slidesSelector: ".bolsista-slide",
      btnNext: container.querySelector(":scope > .bolsistas-controls .bolsistas-btn.next"),
      btnPrev: container.querySelector(":scope > .bolsistas-controls .bolsistas-btn.prev")
    };
  }

  if (container.classList.contains("projetos-carousel")) {
    return {
      track: container.querySelector(":scope > #projetosTrack"),
      dotsContainer: container.querySelector(":scope > .dots-container"),
      slidesSelector: ".projeto-slide",
      btnNext: container.querySelector(":scope > .carousel-btn.right"),
      btnPrev: container.querySelector(":scope > .carousel-btn.left")
    };
  }

  return {
    track: container.querySelector("#noticiasTrack"),
    dotsContainer: container.querySelector(".dots-container"),
    slidesSelector: ".noticia-slide",
    btnNext: container.querySelector(".noticias-btn.right"),
    btnPrev: container.querySelector(".noticias-btn.left")
  };
}

function getClosestSlideIndex(track, slides) {
  const currentScroll = track.scrollLeft;
  let closestIndex = 0;
  let smallestDistance = Number.POSITIVE_INFINITY;

  slides.forEach((slide, index) => {
    const distance = Math.abs(slide.offsetLeft - currentScroll);

    if (distance < smallestDistance) {
      smallestDistance = distance;
      closestIndex = index;
    }
  });

  return closestIndex;
}

carrosseis.forEach((container) => {
  const { track, dotsContainer, slidesSelector, btnNext, btnPrev } = getCarouselConfig(container);
  const slides = track ? Array.from(track.querySelectorAll(slidesSelector)) : [];

  if (!track || slides.length === 0) {
    return;
  }

  if (dotsContainer) {
    dotsContainer.innerHTML = "";

    slides.forEach((slide, index) => {
      const dot = document.createElement("button");
      dot.classList.add("carousel-dot");

      if (index === 0) {
        dot.classList.add("active");
      }

      dot.type = "button";
      dot.setAttribute("aria-label", `Ir para o slide ${index + 1}`);
      dot.addEventListener("click", () => {
        track.scrollTo({
          left: slide.offsetLeft,
          behavior: "smooth"
        });
      });

      dotsContainer.appendChild(dot);
    });
  }

  const updateDots = () => {
    if (!dotsContainer) {
      return;
    }

    const activeIndex = getClosestSlideIndex(track, slides);
    const dots = dotsContainer.querySelectorAll(".carousel-dot");

    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === activeIndex);
    });
  };

  const scrollManual = (direction) => {
    const visibleSlides = window.innerWidth >= 1220 && container.classList.contains("noticias-section")
      ? 3
      : window.innerWidth >= 960
        ? 2
        : 1;

    const slideWidth = slides[0].offsetWidth;
    const gap = parseFloat(window.getComputedStyle(track).gap || "0");
    const amount = (slideWidth + gap) * Math.max(1, visibleSlides - 0.15);

    track.scrollBy({
      left: amount * direction,
      behavior: "smooth"
    });
  };

  btnNext?.addEventListener("click", () => scrollManual(1));
  btnPrev?.addEventListener("click", () => scrollManual(-1));

  let isPointerDown = false;
  let startX = 0;
  let startScroll = 0;

  track.addEventListener("mousedown", (event) => {
    isPointerDown = true;
    startX = event.pageX - track.offsetLeft;
    startScroll = track.scrollLeft;
    track.classList.add("dragging");
    track.style.scrollBehavior = "auto";
  });

  track.addEventListener("mouseleave", () => {
    isPointerDown = false;
    track.classList.remove("dragging");
    track.style.scrollBehavior = "smooth";
  });

  track.addEventListener("mouseup", () => {
    isPointerDown = false;
    track.classList.remove("dragging");
    track.style.scrollBehavior = "smooth";
  });

  track.addEventListener("mousemove", (event) => {
    if (!isPointerDown) {
      return;
    }

    event.preventDefault();
    const currentX = event.pageX - track.offsetLeft;
    const walk = (currentX - startX) * 1.4;
    track.scrollLeft = startScroll - walk;
  });

  track.addEventListener("touchstart", (event) => {
    startX = event.touches[0].pageX;
    startScroll = track.scrollLeft;
    track.style.scrollBehavior = "auto";
  }, { passive: true });

  track.addEventListener("touchmove", (event) => {
    const currentX = event.touches[0].pageX;
    const walk = (currentX - startX) * 1.2;
    track.scrollLeft = startScroll - walk;
  }, { passive: true });

  track.addEventListener("touchend", () => {
    track.style.scrollBehavior = "smooth";
  });

  track.addEventListener("scroll", () => {
    clearTimeout(track.scrollTimeout);
    track.scrollTimeout = setTimeout(updateDots, 40);
  }, { passive: true });

  updateDots();
});

function scrollProjetos(direction) {
  const track = document.getElementById("projetosTrack");

  if (!track) {
    return;
  }

  const firstSlide = track.querySelector(".projeto-slide");
  const gap = parseFloat(window.getComputedStyle(track).gap || "0");
  const slideWidth = firstSlide ? firstSlide.offsetWidth + gap : track.clientWidth * 0.9;

  track.scrollBy({
    left: slideWidth * direction,
    behavior: "smooth"
  });
}

function scrollNoticias(direction) {
  const track = document.getElementById("noticiasTrack");

  if (!track) {
    return;
  }

  const firstSlide = track.querySelector(".noticia-slide");
  const gap = parseFloat(window.getComputedStyle(track).gap || "0");
  const slideWidth = firstSlide ? firstSlide.offsetWidth + gap : track.clientWidth * 0.9;

  track.scrollBy({
    left: slideWidth * direction,
    behavior: "smooth"
  });
}
