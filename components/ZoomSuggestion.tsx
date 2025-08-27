import { useState } from "react";
import { useMap } from 'react-map-gl/maplibre'
import type { IPC } from "@/components/MapBrowser";

interface ZoomSuggestionProps {
  ipc: IPC;
}

export default function ZoomSuggestion({ ipc }: ZoomSuggestionProps) {
  const [zoomLevel, setZoomLevel] = useState(ipc.zoomLevel)
  const { current: map } = useMap();

  ipc.zoomLevel = zoomLevel;

  if (ipc.setZoomLevel === null)
    ipc.setZoomLevel = setZoomLevel;

  if (zoomLevel >= ipc.zoomThreshold)
    return null;

  return (
    <div className="absolute flex justify-center w-screen bottom-10">
      <div
        className="select-none hover:cursor-pointer rounded-full shadow-lg text-white font-semibold bg-blue-500 p-3"
        onClick={() => {
          ipc.searchOnce = true;
          map?.easeTo({ zoom: ipc.zoomThreshold })
        }}
      >
        Zoom in to find spots
      </div>
    </div>
  )
}
