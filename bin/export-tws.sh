#! /bin/bash

APPNAME=${BASH_SOURCE##*/}
GEOJSON=/dev/shm/$APPNAME.json
URL="https://www.google.com/maps/d/kml?mid=11ruM4SlN44FTbl6tGgPUuV42cb9gPbA&resourcekey&forcekml=1"

[ ! -s $GEOJSON ] && {
    KML=/dev/shm/$APPNAME.kml
    curl --compressed -sLo $KML "$URL"
    ogr2ogr -f GeoJSON $GEOJSON $KML
}

< $GEOJSON jq \
'
.features
| map(
    {
        name: .properties.Name,
        description: "",
        url:
            (
                .properties.gx_media_links // ""
                | gsub("^\\s*"; "")
                | select(contains("/")) // ""
                | gsub(" https://.*";"")
            ),
        lat: .geometry.coordinates[1],
        lon: .geometry.coordinates[0],
        src: "tws",
        fee: "Unknown",
        org: "Unknown",
        ratings_count: 0,
        ratings_value: 0,
        type: "campsite"
    }
)
'
