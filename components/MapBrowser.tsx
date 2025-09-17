import type { ViewStateChangeEvent } from "react-map-gl/maplibre"
import { LngLat } from 'maplibre-gl';
import { Map, NavigationControl } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

import type { Spot } from "@/lib/spots/types";
import type { FetchSource } from "@/lib/spots/utils";
import { fetchSpots } from "@/lib/spots/utils";
import PulsingSpinner from "@/components/PulsingSpinner";
import Controls from "@/components/Controls";
import SplashScreen from "@/components/SplashScreen";
import FilterSheet, { Filter } from "@/components/FilterSheet";
import MyLocation from "@/components/MyLocation";
import RegionOfInterest from "@/components/RegionOfInterest";
import ZoomSuggestion from "@/components/ZoomSuggestion";

export interface IPC {
  autoSearch: boolean;
  lastCenter: LngLat;
  loading: boolean;
  filter: Filter;
  searchOnce: boolean;
  spots: Spot[];
  zoomLevel: number;
  zoomThreshold: number;
  refreshControls: (() => void);
  refreshLoading: (() => void);
  refreshRoi: (() => void);
  refreshZoom: (() => void);
  setAutoSearch: ((state: boolean) => void);
  setLoading: ((state: boolean) => void);
}

const zoomThreshold = 6;
const centerOfUS = new LngLat(-98.5795, 39.8283);
const ipc: IPC = {
  autoSearch: true,
  lastCenter: new LngLat(0, 0),
  loading: false,
  searchOnce: false,
  spots: [],
  zoomLevel: 4,
  zoomThreshold: zoomThreshold,
  refreshControls: () => { },
  refreshLoading: () => { },
  refreshRoi: () => { },
  refreshZoom: () => { },
  setAutoSearch: (state: boolean) => {
    ipc.autoSearch = state;
    ipc.refreshControls();
    ipc.refreshZoom();
  },
  setLoading: (state: boolean) => {
    ipc.loading = state;
    ipc.refreshLoading();
  },
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

  if (
    ipc.searchOnce ||
    (
      ipc.loading == false && ipc.autoSearch &&
      zoomLevel >= zoomThreshold && milesFromLastPos > 100
    )
  ) {
    ipc.lastCenter = center;
    ipc.searchOnce = false;

    const fetchSources: FetchSource[] = ["fcs", "iol", "recgov", "cpd", "dyrt", "osm", "spots"];
    let fetchCount = 0;

    ipc.spots = [];
    ipc.setLoading(true);
    ipc.refreshZoom();

    for (const src of fetchSources) {
      fetchSpots(center, src)
        .then(spots => ipc.spots = ipc.spots.concat(spots))
        .then(() => fetchCount++)
        .then(() => {
          if (fetchCount === fetchSources.length) {
            ipc.setLoading(false);
          }
          ipc.refreshRoi();
          ipc.refreshZoom();
        })
    }
  }
}

function handleZoomEnd(e: ViewStateChangeEvent) {
  ipc.zoomLevel = e.viewState.zoom;
  ipc.refreshZoom();
}

export default function MapBrowser() {

  return (
    <>
      <FilterSheet ipc={ipc} />
      <PulsingSpinner ipc={ipc} />
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
