import { useState } from "react";
import { useMapEvent } from 'react-leaflet';

interface ZoomSuggestionProps {
  zoomThreshold: number;
}

export default function ZoomSuggestion({ zoomThreshold }: ZoomSuggestionProps) {
  const [zoomLevel, setZoomLevel] = useState(0);

  const map = useMapEvent('zoomend', () => {
    setZoomLevel(map.getZoom())
  })

  if (zoomLevel >= zoomThreshold)
    return null;

  return (
    <div className="absolute flex justify-center w-screen bottom-10 z-[500]">
      <div
        className="rounded-full shadow-lg text-white font-semibold bg-blue-500 p-3"
        onClick={() => map.setZoom(zoomThreshold)}
      >
        Zoom in to find spots
      </div>
    </div>
  )
}
