import { useMap } from 'react-map-gl/maplibre'
import { useForceUpdate } from "@/lib/spots/hooks";
import type { IPC } from "@/components/MapBrowser";

interface ZoomSuggestionProps {
  ipc: IPC;
}

export default function ZoomSuggestion({ ipc }: ZoomSuggestionProps) {
  const forceUpdate = useForceUpdate()
  const { current: map } = useMap();

  if (ipc.refreshZoom === null)
    ipc.refreshZoom = () => forceUpdate();

  let zoom = ipc.zoomThreshold;
  let label = "Zoom in to find spots";

  if (ipc.loading)
    return null;

  if (ipc.zoomLevel >= ipc.zoomThreshold) {
    if (ipc.autoSearch)
      return null;

    zoom = ipc.zoomLevel;
    label = "Search this area"
  }

  return (
    <div className="absolute flex justify-center w-screen bottom-10 z-10">
      <div
        className="select-none hover:cursor-pointer rounded-full shadow-lg text-white font-semibold bg-blue-500 p-3"
        onClick={() => {
          ipc.searchOnce = true;
          map?.easeTo({ zoom: zoom })
        }}
      >
        {label}
      </div>
    </div>
  )
}
