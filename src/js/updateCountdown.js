    function updateCountdown() {
      const targetDate = new Date("February 1, 2026 00:00:00").getTime();
      const now = new Date().getTime();
      const gap = targetDate - now;

      // Cálculos de tempo
      const second = 1000;
      const minute = second * 60;
      const hour = minute * 60;
      const day = hour * 24;

      if (gap > 0) {
        document.getElementById("days").innerText = Math.floor(gap / day);
        document.getElementById("hours").innerText = Math.floor((gap % day) / hour);
        document.getElementById("minutes").innerText = Math.floor((gap % hour) / minute);
        document.getElementById("seconds").innerText = Math.floor((gap % minute) / second);
      } else {
        document.getElementById("countdown-timer").innerHTML = "<p class='text-indigo-700 font-bold'>Vendas Liberadas!</p>";
      }
    }

    // Atualiza a cada segundo
    setInterval(updateCountdown, 1000);
    updateCountdown(); // Chamada inicial
 