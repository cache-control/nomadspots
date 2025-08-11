import { useState } from "react";
import { useMapEvent, Pane, Rectangle } from 'react-leaflet';
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { haversine, getSquareCorners, fetchSpots } from "@/lib/spots/utils";
import type { Spot } from "@/lib/spots/types";
import SpotMarker from "@/components/SpotMarker";
import { Filter } from "@/components/FilterBar";

interface ROI {
  loading: boolean;
  lastPos: L.LatLngLiteral;
  spots: Spot[];
}

interface RegionOfInterestProps {
  filter: Filter;
  zoomThreshold: number;
}

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

export default function RegionOfInterest({ filter, zoomThreshold }: RegionOfInterestProps) {
  const [roi, setROI] = useState<ROI>(
    {
      loading: false,
      lastPos: {
        lat: 0,
        lng: 0
      },
      spots: []
    }
  )

  const map = useMapEvent('moveend', () => {
    const center = map.getCenter();
    const zoomLevel = map.getZoom();
    const distanceFromLastPos = haversine(roi.lastPos.lat, roi.lastPos.lng, center.lat, center.lng);

    if (zoomLevel >= zoomThreshold && distanceFromLastPos > 100) {
      setROI({ ...roi, loading: true })
      fetchSpots(center).then(
        spots => setROI({ loading: false, lastPos: center, spots: spots })
      )
    }

  })

  const center = map.getCenter();
  const sq = getSquareCorners(center.lat, center.lng, 100);
  const bounds: L.LatLngTuple[] = [
    [sq.topLeft.lat, sq.topLeft.lon],
    [sq.bottomRight.lat, sq.bottomRight.lon],
  ];

  const typeMatches: string[] = [...filter.type];

  if (filter.type.includes("Sites"))
    typeMatches.push(
      "Established Campground",
      "campsite"
    )

  const filteredSpots = roi.spots.filter((spot: Spot) => {
    return (
      typeMatches.includes(spot.type)
      && filter.fee.includes(spot.fee)
      && filter.org.includes(spot.org)
    )
  })

  return (
    <>
      <Pane name="regionOfInterest" className="z-[500]" >
        <Rectangle bounds={bounds} pathOptions={{ fill: false, dashArray: '5 5' }} />
      </Pane>
      {roi.loading && <PulsingSpinner />}
      {filteredSpots.map((spot: Spot) => <SpotMarker key={spot._id} spot={spot} />)}
    </>
  )
}
