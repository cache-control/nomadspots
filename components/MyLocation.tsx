import { useState } from "react";
import { Spot } from "@/lib/spots/types";
import { GeolocateControl } from 'react-map-gl/maplibre';
import SpotPopup from "@/components/SpotPopup";

export default function MyLocation() {
  const [spotInfo, setSpotInfo] = useState<Spot | null>(null);

  return (
    <>
      <GeolocateControl
        position="bottom-right"
        showAccuracyCircle={false}
        onGeolocate={(position) => {
          const { coords } = position;
          setSpotInfo(
            {
              _id: "MyLocation",
              name: "My Location",
              description: "",
              type: "",
              lat: coords.latitude,
              lon: coords.longitude,
              org: "",
              fee: "",
              url: "",
              src: "",
              ratings_count: 0,
              ratings_value: 0,
            }
          )
        }
        }
      />

      {spotInfo &&
        <SpotPopup
          spot={spotInfo}
          offset={[0, 0]}
          onClose={() => setSpotInfo(null)}
        />}
    </>
  )
}
