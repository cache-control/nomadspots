import type { ViewStateChangeEvent } from "react-map-gl/maplibre"
import { LngLat } from 'maplibre-gl';
import { Map, NavigationControl } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

import type { Spot } from "@/lib/spots/types";
import { fetchSpots } from "@/lib/spots/utils";
import PulsingSpinner from "@/components/PulsingSpinner";
import Controls from "@/components/Controls";
import SplashScreen from "@/components/SplashScreen";
import FilterBar, { Filter } from "@/components/FilterBar";
import MyLocation from "@/components/MyLocation";
import RegionOfInterest from "@/components/RegionOfInterest";
import ZoomSuggestion from "@/components/ZoomSuggestion";

export interface IPC {
  autoSearch: boolean;
  lastCenter: LngLat;
  filter: Filter;
  searchOnce: boolean;
  spots: Spot[];
  zoomLevel: number;
  zoomThreshold: number;
  refreshRoi: (() => void) | null;
  refreshZoom: (() => void) | null;
  setAutoSearch: ((state: boolean) => void) | null;
  setLoading: ((state: boolean) => void) | null;
  setZoomLevel: ((zoom: number) => void) | null;
}

const zoomThreshold = 6;
const centerOfUS = new LngLat(-98.5795, 39.8283);
const ipc: IPC = {
  autoSearch: true,
  lastCenter: new LngLat(0, 0),
  searchOnce: false,
  spots: [],
  zoomLevel: 4,
  zoomThreshold: zoomThreshold,
  refreshRoi: null,
  refreshZoom: null,
  setAutoSearch: null,
  setLoading: null,
  setZoomLevel: null,
  filter: {
    type: ['Sites', 'Unknown'],
    fee: ['Free', 'Pay', 'Unknown'],
    org: ['BLM', 'USFS', 'Unknown']
  }
}
const initialViewState = {
  latitude: centerOfUS.lat,
  longitude: centerOfUS.lng,
  zoom: ipc.zoomLevel,
};

function handleMoveEnd(e: ViewStateChangeEvent) {
  const center = new LngLat(e.viewState.longitude, e.viewState.latitude);
  const zoomLevel = e.viewState.zoom;
  const milesFromLastPos = ipc.lastCenter.distanceTo(center) / 1609;

  if (ipc.searchOnce || (ipc.autoSearch && zoomLevel >= zoomThreshold && milesFromLastPos > 100)) {
    ipc.lastCenter = center;
    ipc.searchOnce = false;

    ipc.setLoading?.(true)
    fetchSpots(center)
      .then(spots => ipc.spots = spots)
      .then(() => ipc.setLoading?.(false))
      .then(() => ipc.refreshRoi?.())
  }
}

function handleZoomEnd(e: ViewStateChangeEvent) {
  ipc.setZoomLevel?.(e.viewState.zoom);
}

export default function MapBrowser() {

  return (
    <>
      <PulsingSpinner ipc={ipc} />
      <FilterBar ipc={ipc} />
      <Controls ipc={ipc} />
      <SplashScreen />
      <Map
        initialViewState={initialViewState}
        mapStyle="https://tiles.openfreemap.org/styles/liberty"
        doubleClickZoom={false}
        onZoomEnd={handleZoomEnd}
        onMoveEnd={handleMoveEnd}
      >
        <RegionOfInterest ipc={ipc} />
        <NavigationControl position="top-left" showCompass={false} />
        <MyLocation />
        <ZoomSuggestion ipc={ipc} />
      </Map>
    </>
  );
}
