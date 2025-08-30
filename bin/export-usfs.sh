#! /bin/bash

# https://data-usfs.hub.arcgis.com/datasets/276a0a31bb68477da4825e78b04d455e_0/explore
#

APPNAME=${BASH_SOURCE##*/}
GEOJSON=/dev/shm/$APPNAME.json
URL='https://hub.arcgis.com/api/download/v1/items/276a0a31bb68477da4825e78b04d455e/geojson?redirect=false&layers=0&spatialRefId=4326'

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
    | select(.RECAREA_ENABLE == "Y")
    | select(.SITE_SUBTYPE|test("CAMP"))
    | {
        name: .RECAREA_NAME,
        description: .RECAREA_DESCRIPTION,
        url:
            (
                .USDA_PORTAL_URL // ""
                | gsub("\\s*"; "")
                | select(contains("/")) // ""
            ),
        lat: .LATITUDE,
        lon: .LONGITUDE,
        src: "usfs",
        fee:
            (
                if (.FEE_CHARGED == "N") then
                    "Free"
                elif (.FEE_CHARGED == "Y") then
                    "Pay"
                else
                    "Unknown"
                end
            ),
        org:
            (
                if (.OPERATED_BY//"Unknown"|test("US Forest Service")) then
                    "USFS"
                else
                    "Unknown"
                end
            ),
        ratings_count: 0,
        ratings_value: 0,
        type: "campsite",
    }
)
'
