import { useMap } from 'react-leaflet';
import { useEffect } from 'react';
import L from 'leaflet';

const MapEffect = ({ lat, lng }) => {
  const map = useMap();

  useEffect(() => {
    if (!lat || !lng) return;

    map.flyTo([lat, lng],6); // Zoom to location

    // Highlight pulse
    const pulseIcon = new L.DivIcon({
      className: 'pulse-marker',
      iconSize: [20, 20],
    });

    const marker = L.marker([lat, lng], { icon: pulseIcon }).addTo(map);

    setTimeout(() => map.removeLayer(marker), 5000); // remove after 5 sec
  }, [lat, lng]);

  return null;
};

export default MapEffect;