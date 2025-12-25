import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

const MobileDragControl = () => {
  const map = useMap();

  useEffect(() => {
    // Disable dragging initially
    map.dragging.disable();

    const onTouchStart = (e) => {
      if (e.touches && e.touches.length > 1) {
        map.dragging.enable();   // two fingers → allow
      } else {
        map.dragging.disable();  // one finger → block
      }
    };

    const onTouchEnd = () => {
      map.dragging.disable();
    };

    map.getContainer().addEventListener("touchstart", onTouchStart);
    map.getContainer().addEventListener("touchend", onTouchEnd);

    return () => {
      map.getContainer().removeEventListener("touchstart", onTouchStart);
      map.getContainer().removeEventListener("touchend", onTouchEnd);
    };
  }, [map]);

  return null;
};

export default MobileDragControl;
