import { Marker, Popup } from 'react-leaflet';
import { Star, ThermometerSun, Map } from "lucide-react";
import L from "leaflet";
import { Spot, IconColor } from "@/lib/spots/types";

interface SpotMarkerProps {
  spot: Spot;
};

const iconStore = {
  blue: getIcon("blue"),
  gold: getIcon("gold"),
  red: getIcon("red"),
  green: getIcon("green"),
  orange: getIcon("orange"),
  yellow: getIcon("yellow"),
  violet: getIcon("violet"),
  grey: getIcon("grey"),
  black: getIcon("black"),
};

// https://github.com/pointhi/leaflet-color-markers
function getIcon(color: IconColor = "blue") {
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  })
}

function handleCopy(text: string) {
  try {
    navigator.clipboard.writeText(text)
  } catch {
    console.error("Failed clipboard copy")
  }
}

export default function SpotMarker({ spot }: SpotMarkerProps) {
  let icon = iconStore.grey;
  const location = `${spot.lat}, ${spot.lon}`;
  const weatherUrl = "http://forecast.weather.gov/MapClick.php"
    + `?lat=${spot.lat}&lon=${spot.lon}&site=all&smap=1`;
  const mapUrl = "https://www.google.com/maps"
    + `?q=${spot.lat},${spot.lon}&t=k`
  const rating = (spot.ratings_value / spot.ratings_count).toFixed(1);

  if (spot.src === "MyLocation") {
    icon = iconStore.black;
  } else if (spot.type === "Water") {
    icon = iconStore.blue;
  } else if (spot.type === "Showers") {
    icon = iconStore.blue;
  } else if (spot.org === "BLM") {
    icon = iconStore.orange;
  } else if (spot.org === "USFS") {
    icon = iconStore.yellow;
  } else if (spot.fee === "Free") {
    icon = iconStore.green;
  } else if (spot.fee === "Pay") {
    icon = iconStore.red;
  } else if (spot.src === "spots") {
    icon = iconStore.gold;
  } else if (spot.src === "iol") {
    icon = iconStore.violet;
  }

  return (
    <Marker
      icon={icon}
      position={[spot.lat, spot.lon]}>
      <Popup closeButton={false}>
        <div className="flex items-center justify-between mb-2">
          <button
            className="flex-1 bg-gray-200 rounded-2xl mr-1 px-2 py-1 cursor-pointer"
            onClick={() => handleCopy(`${location}`)}
          >
            {location}
          </button>
          <a target="_blank" href={weatherUrl} >
            <ThermometerSun />
          </a>
        </div>

        <div className="flex gap-x-1">
          <a target="_blank" href={mapUrl} >
            <Map className="mr-1" color="black" />
          </a>
          <a target="_blank" href={spot.url || mapUrl} >
            <h3 className="text-xl font-semibold">{spot.name}</h3>
          </a>
        </div>

        <p className="text-gray-700 text-sm mb-4 line-clamp-3">{spot.desc}</p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-yellow-500">
            <Star className="w-5 h-5 mr-1" fill="gold" />
            <span className="font-medium text-gray-800">{rating}</span>
          </div>

          {/* TODO
          <div className="flex space-x-0">
            <span className="bg-[#D52B1E] text-white rounded px-1">VZ</span>
            <span className="bg-[#067AB4] text-white rounded px-1">AT&amp;T</span>
            <span className="bg-[#E20074] text-white rounded px-1">TM</span>
            <span className="bg-black text-white rounded px-1">No cell</span>
          </div>
          */}

        </div>

      </Popup>
    </Marker>
  )
}
