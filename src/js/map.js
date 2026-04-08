const mapContainer = document.getElementById("mapa-visitantes");

if (mapContainer && typeof am5 !== "undefined" && typeof am5map !== "undefined" && typeof am5geodata_worldLow !== "undefined") {
  am5.ready(() => {
    const root = am5.Root.new("mapa-visitantes");
    root.setThemes([am5themes_Animated.new(root)]);

    const chart = root.container.children.push(
      am5map.MapChart.new(root, {
        projection: am5map.geoMercator(),
        panX: "translateX",
        panY: "translateY",
        wheelX: "none",
        wheelY: "zoomX",
        maxZoomLevel: 10,
        homeZoomLevel: 1,
        homeGeoPoint: { latitude: 0, longitude: 0 }
      })
    );

    const polygonSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_worldLow,
        exclude: ["AQ"]
      })
    );

    polygonSeries.mapPolygons.template.setAll({
      tooltipText: "{name}: {value} visitas",
      interactive: true,
      fill: am5.color(0x173b8f),
      stroke: am5.color(0xffffff),
      strokeWidth: 0.8
    });

    const visitsData = {
      BR: 1200,
      US: 950,
      FR: 700,
      DE: 620,
      IN: 500,
      JP: 420,
      AU: 310,
      ZA: 200
    };

    polygonSeries.mapPolygons.template.adapters.add("fill", (_, target) => {
      const id = target.dataItem?.get("id");
      const visits = visitsData[id];

      if (!visits) {
        return am5.color(0x11306f);
      }

      const ratio = visits / 1200;
      const red = 20 + Math.round(45 * ratio);
      const green = 70 + Math.round(120 * ratio);
      const blue = 140 + Math.round(90 * ratio);

      return am5.color(`rgb(${red}, ${green}, ${blue})`);
    });

    polygonSeries.data.setAll(
      Object.entries(visitsData).map(([id, value]) => ({ id, value }))
    );

    const interactionOverlay = am5.Container.new(root, {
      width: am5.percent(100),
      height: am5.percent(100)
    });

    chart.children.push(interactionOverlay);
    chart.appear(1000, 100);

    const mapNotice = document.getElementById("map-interaction-notice");
    let hasInteracted = false;

    const hideNotice = () => {
      if (hasInteracted || !mapNotice) {
        return;
      }

      mapNotice.classList.add("opacity-0");

      setTimeout(() => {
        mapNotice.style.display = "none";
      }, 400);

      hasInteracted = true;
    };

    interactionOverlay.events.on("click", hideNotice);
    interactionOverlay.events.on("pointerdown", hideNotice);
  });
}
