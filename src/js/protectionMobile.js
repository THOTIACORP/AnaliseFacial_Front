 document.addEventListener("DOMContentLoaded", () => {
      const mapProtection = document.getElementById("model-protection");
      if (mapProtection) {
        mapProtection.addEventListener("click", () => {
          mapProtection.classList.add("hidden"); // Esconde a proteção
        });
      }
    });
     document.addEventListener("DOMContentLoaded", () => {
      const mapProtection = document.getElementById("map-protection");
      if (mapProtection) {
        mapProtection.addEventListener("click", () => {
          mapProtection.classList.add("hidden"); // Esconde a proteção
        });
      }
    });