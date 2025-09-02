#! /bin/bash
#
# https://gis.blm.gov/arcgis/rest/services/recreation/BLM_Natl_Recreation/MapServer
#
APPNAME=${BASH_SOURCE##*/}
DIRNAME=${BASH_SOURCE%%$APPNAME}
API=${DIRNAME}api-blm.sh

usage() {
cat <<__EOF__
usage: $APPNAME [OPTION]*

    OPTION:

    -h              this help

__EOF__

    exit 0
}

while getopts h c
do
    case $c in
        *)  usage;;
    esac
done
shift $((OPTIND - 1))

query() {
    service=$1
    layer=$2
    offset=0
    cache=/dev/shm/$APPNAME.$service.$layer.json
    shift 2

    [ ! -s $cache ] && {
        while true; do
            json=$cache.$offset
            $API -o $offset $service $layer "$*" | tee $json
            if [ $(jq -r .exceededTransferLimit $json) != true ]; then
                break
            fi
            records=$(jq '.features|length' $json)
            offset=$(( offset + records))
        done | jq '.features[]' | jq --slurp > $cache
    }

    cat $cache
}

{
    # BLM Natl RIDB Recreation Sites (Clusters) (0)
    query recs 0 "ParentActName='CAMPING'"

    # BLM Natl RIDB Recreation Sites (1)
    query recs 1 "ActivityNames like '%CAMP%'"

    # BLM Natl Facilities Camping and Cabins (2)
    query recs 2 "FacilityTypeDescription='Campground'"

    # BLM Natl Recreation Sites (3)
    query recs 3 "FET_TYPE in (3,5,6,10)"

    # BLM Recreation Facilities (0)
    query facilities 0 "FacilityTypeDescription='Campground'"

    # BLM Recreation Sites (1)
    query facilities 1 "ActivityNames like '%CAMP%'"

    # BLM Natl RIDB Recreation Camping (2)
    query facilities 2 "ActivityNames like '%CAMP%'"

    # BLM Natl RIDB Facilities Camping (8)
    query facilities 8 "FacilityTypeDescription='Campground'"

} | jq \
'
map(
    .geometry.coordinates as $gps
    | .properties
    | {
        name: (.FET_NAME // .RecAreaName // .FacilityName),
        description:
            (
                if (has("FET_SUBTYPE")) then
                    .FET_SUBTYPE + ". " + .DESCRIPTION
                else
                    .RecAreaDescription // .FacilityDescription // ""
                end
            )
            | gsub("<[^>]*>"; "")
            | gsub("&nbsp;"; " ")
            | gsub("&amp;"; "&")
            | gsub("&lt;"; "<")
            | gsub("&gt;"; ">")
            ,
        url:
            (
                .WEB_LINK // .BLMRecURL // .BLMFacURL // ""
                | gsub("\\s*"; "")
                | select(contains("/")) // ""
            ),
        lat: $gps[1],
        lon: $gps[0],
        src: "blm",
        fee:
            (.FET_SUBTYPE // .RecAreaFeeDescription // .FacilityUseFeeDescription // "Unknown")
            | (
                if (test("No Fee|None|Free"; "i")) then
                    "Free"
                elif (test("Fee"; "i")) then
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
                if (has("FET_TYPE")) then
                    if (.FET_TYPE == 5) then
                        "Toilet"
                    elif (.FET_TYPE == 6) then
                        "Water"
                    else
                        "campsite"
                    end
                else
                    if (.ParentActName // .ActivityNames // .FacilityTypeDescription // "Unknown" | test("CAMPING|Campground")) then
                        "campsite"
                    else
                        "Unknown"
                    end
                end
            ),
    }
)
' | jq '.[]' | jq --slurp
