document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const menuIcon = document.getElementById("menu-icon");
  const closeIcon = document.getElementById("close-icon");
  const mobileLinks = document.querySelectorAll(".mobile-link");

  if (!menuToggle || !mobileMenu || !menuIcon || !closeIcon) {
    return;
  }

  const setMenuState = (isOpen) => {
    mobileMenu.classList.toggle("hidden", !isOpen);
    menuIcon.classList.toggle("hidden", isOpen);
    closeIcon.classList.toggle("hidden", !isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  };

  const toggleMenu = () => {
    const isOpen = mobileMenu.classList.contains("hidden");
    setMenuState(isOpen);
  };

  menuToggle.addEventListener("click", toggleMenu);

  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
      setMenuState(false);
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 960) {
      setMenuState(false);
    }
  });
});
