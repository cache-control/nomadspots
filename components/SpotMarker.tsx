import type { Spot } from "@/lib/spots/types";
import {
  Circle,
  CircleDollarSign,
  Droplet,
  Mountain,
  ShowerHead,
  Toilet,
  TreePine,
} from 'lucide-react';
import { Marker } from "react-map-gl/maplibre";

interface SpotMarkerProps {
  spot: Spot;
  onClick: () => void;
};

export default function SpotMarker({ spot, onClick }: SpotMarkerProps) {
  const iconProps = {
    className: "mb-5 drop-shadow-[0_8px_4px_rgba(0,0,0,0.3)]",
    size: 32,
  };
  let icon = null;
  let markerColor;

  if (spot.src === "MyLocation") {
    markerColor = "black";
  } else if (spot.type === "Water") {
    icon = <Droplet {...iconProps} fill="cyan" />
  } else if (spot.type === "Toilet") {
    icon = <Toilet {...iconProps} fill="white" />
  } else if (spot.type === "Showers") {
    icon = <ShowerHead {...iconProps} fill="blue" />
  } else if (spot.org === "BLM") {
    const color = spot.fee === "Pay" ? "red"
      : (spot.fee === "Free" ? "green" : "brown");
    icon = <Mountain {...iconProps} fill={color} />
  } else if (spot.org === "USFS") {
    const color = spot.fee === "Pay" ? "red"
      : (spot.fee === "Free" ? "green" : "brown");
    icon = <TreePine {...iconProps} fill={color} />
  } else if (spot.fee === "Free") {
    icon = <Circle {...iconProps} fill="green" />
  } else if (spot.fee === "Pay") {
    icon = <CircleDollarSign {...iconProps} fill="red" />
  } else if (spot.src === "spots") {
    markerColor = "gold";
  } else if (spot.src === "iol") {
    markerColor = "purple";
  }

  return (
    <>
      <Marker
        latitude={spot.lat}
        longitude={spot.lon}
        anchor="bottom"
        color={markerColor}
        onClick={(e) => {
          e.originalEvent.stopPropagation();
          onClick();
        }}
      >
        {icon}
      </Marker>
    </>

  )
}
