#! /bin/bash

# https://data-usfs.hub.arcgis.com/datasets/276a0a31bb68477da4825e78b04d455e_0/explore
#

APPNAME=${BASH_SOURCE##*/}
GEOJSON=/dev/shm/$APPNAME.json
URLS=(
    # Recreation Sites (Feature Layer)
    'https://hub.arcgis.com/api/download/v1/items/276a0a31bb68477da4825e78b04d455e/geojson?redirect=false&layers=0&spatialRefId=4326'

    # Recreation Area Activities (Feature Layer)
    'https://hub.arcgis.com/api/download/v1/items/bca3358e80384a2794a672ed48b0be8e/geojson?redirect=false&layers=0&spatialRefId=4326'

    # Recreation Opportunities (Feature Layer)
    'https://hub.arcgis.com/api/download/v1/items/3e16a3fae435443d9899b10d4ff26124/geojson?redirect=false&layers=0&spatialRefId=4326'
)

[ ! -s $GEOJSON ] && {
    for url in "${URLS[@]}"; do
        resultUrl=$(curl -s "$url" | jq -r .resultUrl)

        [ -z "$resultUrl" ] && {
            echo "GeoJson link is not available; try again later."
            exit 1
        }

        curl --compressed -sL "$resultUrl"
    done | jq '.features[]' | jq --slurp > $GEOJSON
}

< $GEOJSON jq \
'
map(
    .geometry.coordinates as $gps
    | .properties
    | select(.RECAREA_ENABLE // .OPENSTATUS // "Unknown"|test("^Y$|open"))
    | select(.SITE_SUBTYPE // .ACTIVITYNAME // .MARKERACTIVITY // "Unknown"|test("CAMP|Camping"))
    | {
        name: (.RECAREA_NAME // .RECAREANAME),
        description:
            (
                .RECAREA_DESCRIPTION // .RECAREADESCRIPTION
                | gsub("<[^>]*>"; "")
                | gsub("&nbsp;"; " ")
                | gsub("&amp;"; "&")
                | gsub("&lt;"; "<")
                | gsub("&gt;"; ">")
            ),
        url:
            (
                .USDA_PORTAL_URL // .RECAREAURL // ""
                | gsub("\\s*"; "")
                | select(contains("/")) // ""
            ),
        lat: $gps[1],
        lon: $gps[0],
        src: "usfs",
        fee:
            (
                if (has("FEE_CHARGED")) then
                    if (.FEE_CHARGED == "N") then
                        "Free"
                    elif (.FEE_CHARGED == "Y") then
                        "Pay"
                    else
                        "Unknown"
                    end
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
