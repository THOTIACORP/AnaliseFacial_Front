document.addEventListener("DOMContentLoaded", () => {
  const saibaMaisBtn = document.getElementById("saibaMaisBtn");
  const extraText = document.getElementById("extraText");
  const scrollProgress = document.getElementById("scroll-progress");
  const currentYear = document.getElementById("currentYear");

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  if (saibaMaisBtn && extraText) {
    saibaMaisBtn.addEventListener("click", () => {
      const isHidden = extraText.classList.toggle("hidden");
      saibaMaisBtn.textContent = isHidden ? "Entender a proposta" : "Ocultar detalhes";
      saibaMaisBtn.setAttribute("aria-expanded", String(!isHidden));
    });
  }

  const updateProgress = () => {
    if (!scrollProgress) {
      return;
    }

    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = documentHeight > 0 ? (window.scrollY / documentHeight) * 100 : 0;

    scrollProgress.style.width = `${progress}%`;
    document.body.classList.toggle("is-scrolled", window.scrollY > 16);
  };

  updateProgress();
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);

  const revealElements = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window) || revealElements.length === 0) {
    revealElements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -10% 0px"
    }
  );

  revealElements.forEach((element) => observer.observe(element));
});
