#! /bin/bash

# https://gbp-blm-egis.hub.arcgis.com/datasets/BLM-EGIS::blm-natl-recreation-site-points/about
#
# ID: 3 Name: OVERNIGHT SITE
# ID: 5 Name: TOILET
# ID: 6 Name: POTABLE WATER
# ID: 10 Name: CAMPGROUND
#

APPNAME=${BASH_SOURCE##*/}
GEOJSON=/dev/shm/$APPNAME.json
URL='https://hub.arcgis.com/api/download/v1/items/7438e9e800914c94bad99f70a4f2092d/geojson?redirect=false&layers=1&spatialRefId=4326'

[ ! -s $GEOJSON ] && {
    resultUrl=$(curl -s "$URL" | jq -r .resultUrl)

    [ -z "$resultUrl" ] && {
        echo "GeoJson link is not available; try again later."
        exit 1
    }

    curl --compressed -sLo $GEOJSON "$resultUrl"
}

< $GEOJSON jq \
'
.features
| map(
    .properties
    | select(.FET_TYPE as $n|[3,5,6,10]|index($n))
    | {
        name: .FET_NAME,
        description: (.FET_SUBTYPE + ". " + .DESCRIPTION),
        url:
            (
                .WEB_LINK // ""
                | gsub("\\s*"; "")
                | select(contains("/")) // ""
            ),
        lat: .LAT,
        lon: .LONG,
        src: "blm",
        fee:
            (
                if (.FET_SUBTYPE|test("No Fee")) then
                    "Free"
                elif (.FET_SUBTYPE|test("Fee")) then
                    "Pay"
                else
                    "Unknown"
                end
            ),
        org: "BLM",
        ratings_count: 0,
        ratings_value: 0,
        type:
            (
                if (.FET_TYPE == 5) then
                    "Toilet"
                elif (.FET_TYPE == 6) then
                    "Water"
                else
                    "campsite"
                end
            ),
    }
)
'
