import { useMap } from "react-leaflet";
import { useEffect } from "react";
import "leaflet.heat";

export default function HeatMapLayer({ points, radius = 25, max = 3, gradient }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const heat = window.L.heatLayer(points, {
      radius,
      max,
      gradient,
      blur: 15,
    }).addTo(map);

    return () => {
      if (map.hasLayer(heat)) map.removeLayer(heat);
    };
  }, [map, points, radius, max, gradient]);

  return null;
}
