  // --- CÓDIGO AMCHARTS 5 PARA O MAPA GLOBAL ---
    am5.ready(function () {
      var root = am5.Root.new("mapa-visitantes");
      root.setThemes([am5themes_Animated.new(root)]);
      var chart = root.container.children.push(
        am5map.MapChart.new(root, {
          projection: am5map.geoMercator(),
          // Adicionamos a linha abaixo para que o mapa possa ser arrastado/movido
          panX: "translateX",
          panY: "translateY",
          wheelX: "none",
          wheelY: "zoomX",
          homeZoomLevel: 1, // Nível de zoom inicial
          homeGeoPoint: { latitude: 0, longitude: 0 } // Ponto inicial
        })
      );
      var polygonSeries = chart.series.push(
        am5map.MapPolygonSeries.new(root, {
          geoJSON: am5geodata_worldLow,
          exclude: ["AQ"],
          fill: am5.color(0x3b82f6),
          stroke: am5.color(0xffffff),
          // Ativa o cursor de "mão" para indicar interatividade
          interactive: true
        })
      );
      // Adicionamos um contêiner invisível sobre o mapa para capturar o primeiro clique/interação
      // CORREÇÃO: Removida a falha de sintaxe `is/>`
      var interactionOverlay = am5.Container.new(root, {
        width: am5.percent(100),
        height: am5.percent(100)
      });
      chart.children.push(interactionOverlay);
      // Dados simulados de visitas (simulando um campo para o tooltip)
      const visitsData = {
        BR: 1200, US: 950, FR: 700, DE: 620, IN: 500, JP: 420, AU: 310, ZA: 200
      };
      // Preenchimento dinâmico baseado na quantidade
      polygonSeries.mapPolygons.template.adapters.add("fill", (fill, target) => {
        const id = target.dataItem.get("id");
        if (visitsData[id]) {
          const ratio = visitsData[id] / 1200;
          // Tons de azul (ajustado para ser mais visível sobre o bg indigo-700)
          const r = 255 - Math.round(150 * ratio);
          const g = 255 - Math.round(150 * ratio);
          const b = 255 - Math.round(50 * ratio);
          return am5.color(`rgb(${r},${g},${b})`);
        }
        return am5.color(0x3730A3); // Cor de preenchimento padrão (indigo-800)
      });
      // Tooltip
      polygonSeries.mapPolygons.template.setAll({
        tooltipText: "{name}: {value} visitas",
        // Adiciona um hover state para melhorar a interatividade
        interactive: true
      });
      // CORREÇÃO: Passa os dados no formato correto (array de objetos {id, value})
      polygonSeries.data.setAll(
        Object.entries(visitsData).map(([id, value]) => ({ id, value }))
      );
      chart.appear(1000, 100);
      // LÓGICA PARA ESCONDER O AVISO
      const mapNotice = document.getElementById('map-interaction-notice');
      let hasInteracted = false;
      const hideNotice = () => {
        if (!hasInteracted) {
          mapNotice.classList.add('opacity-0');
          setTimeout(() => {
            mapNotice.style.display = 'none'; // Remove do layout após a transição
          }, 500);
          hasInteracted = true;
        }
      }
      // Ocultar aviso ao primeiro clique/toque no elemento que está sobre o mapa
      interactionOverlay.events.on("click", hideNotice);
      interactionOverlay.events.on("pointerdown", hideNotice);

    });