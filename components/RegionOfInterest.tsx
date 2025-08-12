import { useState } from "react";
import { useMapEvent, Pane, Rectangle } from 'react-leaflet';
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { haversine, getSquareCorners, fetchSpots } from "@/lib/spots/utils";
import type { Spot } from "@/lib/spots/types";
import SpotMarker from "@/components/SpotMarker";
import { Filter } from "@/components/FilterBar";

interface ROI {
  lastPos: L.LatLngLiteral;
  spots: Spot[];
}

interface RegionOfInterestProps {
  autoSearch: boolean;
  filter: Filter;
  zoomThreshold: number;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function RegionOfInterest({ autoSearch, setLoading, filter, zoomThreshold }: RegionOfInterestProps) {
  const [roi, setROI] = useState<ROI>(
    {
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

    if (autoSearch && zoomLevel >= zoomThreshold && distanceFromLastPos > 100) {
      setLoading(true)
      fetchSpots(center)
        .then(spots => setROI({ lastPos: center, spots: spots }))
        .then(() => setLoading(false))
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
      {filteredSpots.map((spot: Spot) => <SpotMarker key={spot._id} spot={spot} />)}
    </>
  )
}
