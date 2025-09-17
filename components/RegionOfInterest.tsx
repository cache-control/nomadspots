import { useState } from "react";
import type { Spot } from "@/lib/spots/types";
import type { IPC } from "@/components/MapBrowser";
import { useForceUpdate } from "@/lib/spots/hooks";
import { getSquareCorners } from "@/lib/spots/utils";
import SpotMarker from "@/components/SpotMarker";
import SpotPopup from "@/components/SpotPopup";
import Rectangle from "@/components/Rectangle";

interface RegionOfInterestProps {
  ipc: IPC;
}

export default function RegionOfInterest({ ipc }: RegionOfInterestProps) {
  const [spotInfo, setSpotInfo] = useState<Spot | null>(null);
  ipc.refreshRoi = useForceUpdate()

  const sq = getSquareCorners(ipc.lastCenter.lat, ipc.lastCenter.lng, 100);

  const typeMatches: string[] = [...ipc.filter.type];

  if (ipc.filter.type.includes("Sites"))
    typeMatches.push(
      "Established Campground",
      "campsite"
    )

  const filteredSpots = ipc.spots.filter((spot: Spot) => {
    return (
      typeMatches.includes(spot.type)
      && ipc.filter.fee.includes(spot.fee)
      && ipc.filter.org.includes(spot.org)
    )
  })

  return (
    <>
      <Rectangle bounds={sq} />
      {filteredSpots.map((spot: Spot) =>
        <SpotMarker
          key={spot._id}
          onClick={() => setSpotInfo(spot)}
          spot={spot}
        />
      )}
      {spotInfo &&
        <SpotPopup
          spot={spotInfo}
          onClose={() => setSpotInfo(null)}
        />
      }
    </>
  )
}
