import { Popup } from "react-map-gl/maplibre";
import { Star, ThermometerSun, Map } from "lucide-react";
import type { Spot } from "@/lib/spots/types";

interface SpotPopupProps {
  spot: Spot;
  offset?: [number, number];
  onClose: () => void;
};

function handleCopy(text: string) {
  try {
    navigator.clipboard.writeText(text)
  } catch {
    console.error("Failed clipboard copy")
  }
}

export default function SpotPopup({ spot, offset = [1, -50], onClose }: SpotPopupProps) {
  const location = `${spot.lat}, ${spot.lon}`;
  const weatherUrl = "http://forecast.weather.gov/MapClick.php"
    + `?lat=${spot.lat}&lon=${spot.lon}&site=all&smap=1`;
  const mapUrl = "https://www.google.com/maps"
    + `?q=${spot.lat},${spot.lon}&t=k`
  const rating = (spot.ratings_value / spot.ratings_count).toFixed(1);

  return (
    <>
      <Popup
        className="custom-popup z-40"
        latitude={spot.lat}
        longitude={spot.lon}
        anchor="bottom"
        offset={offset}
        maxWidth="300px"
        closeButton={false}
        onClose={onClose}
      >
        <div className="flex items-center justify-between mb-2">
          <button
            className="flex-1 bg-gray-200 rounded-2xl mr-1 px-2 py-1 cursor-pointer"
            onClick={() => handleCopy(`${location}`)}
          >
            {location}
          </button>
          <a target="_blank" href={weatherUrl} >
            <ThermometerSun fill="#4A90E2" />
          </a>
        </div>

        <div className="flex gap-x-1">
          <a target="_blank" href={mapUrl} >
            <Map className="mr-1" fill="#34C759" />
          </a>
          <a target="_blank" href={spot.url || mapUrl} >
            <h3 className="text-xl font-semibold">{spot.name}</h3>
          </a>
        </div>

        <p className="text-gray-700 text-sm mb-4 line-clamp-3">{spot.description}</p>

        <div className="flex items-center justify-between mb-4">
          {spot.ratings_count > 0 &&
            <div className="flex items-center text-yellow-500">
              <Star className="w-5 h-5 mr-1" fill="gold" />
              <span className="font-medium text-gray-800">{rating}</span>
            </div>
          }

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
    </>

  )
}
