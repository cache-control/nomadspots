#! /bin/bash

APPNAME=${BASH_SOURCE##*/}
GEOJSON=/dev/shm/$APPNAME.json
URL="https://www.boondockersbible.com/wp-json/mapster-wp-maps/map?id=10463"

[ ! -s $GEOJSON ] && {
    curl --compressed -sLo $GEOJSON "$URL"
}

< $GEOJSON jq \
'
.locations
| map(
    {
        name: .title,
        description: "",
        url:
            (
                .data.popup.button_url // ""
                | gsub("^\\s*"; "")
                | select(contains("/")) // ""
            ),
        lat: .data.location.coordinates[1],
        lon: .data.location.coordinates[0],
        src: "bdb",
        fee: "Unknown",
        org: ((.categories[]|select(.name=="BLM" or .name=="USFS")|.name) // "Unknown"),
        ratings_count: 0,
        ratings_value: 0,
        type: "campsite"
    }
)
'
