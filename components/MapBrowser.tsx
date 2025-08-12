import { useState } from "react";
import { MapContainer, TileLayer } from 'react-leaflet';
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Controls from "@/components/Controls";
import MyLocation from "@/components/MyLocation";
import RegionOfInterest from "@/components/RegionOfInterest";
import ZoomSuggestion from "@/components/ZoomSuggestion";
import SplashScreen from "@/components/SplashScreen";
import FilterBar, { Filter } from "@/components/FilterBar";

const centerOfUS: L.LatLngTuple = [39.8283, -98.5795];
const zoomThreshold = 6;

function PulsingSpinner() {
  return (
    <div className="absolute flex items-center justify-center inset-0 z-[5000]">
      <div className="w-16 h-16 flex justify-center items-center space-x-2">
        <div className="w-4 h-4 bg-blue-400 rounded-full animate-pulse"></div>
        <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse delay-200"></div>
        <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse delay-400"></div>
      </div>

    </div>
  )
}

export default function MapBrowser() {
  const [loading, setLoading] = useState(false);
  const [autoSearch, setAutoSearch] = useState(true);
  const [filter, setFilter] = useState<Filter>({
    type: ['Sites', 'Unknown'],
    fee: ['Free', 'Pay', 'Unknown'],
    org: ['BLM', 'USFS', 'Unknown']
  });

  return (
    <>
      <FilterBar filter={filter} setFilter={setFilter} />
      <Controls
        enable={autoSearch}
        setAutoSearch={setAutoSearch}
      />
      {loading && <PulsingSpinner />}

      <MapContainer
        className="h-full"
        center={centerOfUS}
        zoom={5}
        scrollWheelZoom={true}
      >

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <SplashScreen />
        <RegionOfInterest
          autoSearch={autoSearch}
          setLoading={setLoading}
          filter={filter}
          zoomThreshold={zoomThreshold}
        />
        <MyLocation />
        <ZoomSuggestion zoomThreshold={zoomThreshold} />
      </MapContainer>
    </>
  );
}
