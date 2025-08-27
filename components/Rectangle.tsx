import { Source, Layer } from "react-map-gl/maplibre";
import type { LayerSpecification } from 'maplibre-gl';
import type { SquareCorners } from "@/lib/spots/types";

interface RectangleProps {
  bounds: SquareCorners;
};

export default function Rectangle({ bounds }: RectangleProps) {
  const geojson: GeoJSON.FeatureCollection = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [bounds.topLeft.lon, bounds.topLeft.lat],
              [bounds.topRight.lon, bounds.topRight.lat],
              [bounds.bottomRight.lon, bounds.bottomRight.lat],
              [bounds.bottomLeft.lon, bounds.bottomLeft.lat],
              [bounds.topLeft.lon, bounds.topLeft.lat],

              // Northwest Corner
              // Northeast Corner
              // Southeast Corner
              // Southwest Corner
              // The closing coordinate, identical to the first
            ],
          ],
        },
        properties: {},
      },
    ],
  };

  const layerStyle: LayerSpecification = {
    source: 'my-data',
    id: 'my-rectangle-outline',
    type: 'line',
    paint: {
      'line-color': '#0080ff',
      'line-width': 3,
      'line-dasharray': [2, 2],
    },
  };

  return (
    <>
      <Source id="my-data" type="geojson" data={geojson}>
        <Layer {...layerStyle} />
      </Source>
    </>
  )
}
