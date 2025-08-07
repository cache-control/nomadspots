import { useState } from "react";
import { MapContainer, TileLayer } from 'react-leaflet';
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import MyLocation from "@/components/MyLocation";
import RegionOfInterest from "@/components/RegionOfInterest";
import ZoomSuggestion from "@/components/ZoomSuggestion";
import SplashScreen from "@/components/SplashScreen";
import FilterBar, { Filter } from "@/components/FilterBar";

const centerOfUS: L.LatLngTuple = [39.8283, -98.5795];
const zoomThreshold = 6;

export default function MapBrowser() {
  const [filter, setFilter] = useState<Filter>({
    type: ['Sites', 'Unknown'],
    fee: ['Free', 'Pay', 'Unknown'],
    org: ['BLM', 'USFS', 'Unknown']
  });

  return (
    <>
      <FilterBar filter={filter} setFilter={setFilter} />
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
          filter={filter}
          zoomThreshold={zoomThreshold}
        />
        <MyLocation />
        <ZoomSuggestion zoomThreshold={zoomThreshold} />
      </MapContainer>
    </>
  );
}
