#! /bin/bash
#
# https://gis.blm.gov/arcgis/rest/services/recreation/BLM_Natl_Recreation/MapServer
#
APPNAME=${BASH_SOURCE##*/}
GEOJSON=/dev/shm/$APPNAME.json
declare -A SERVICES=(
    [recs]=BLM_Natl_Recreation
    [facilities]=BLM_Natl_Recreation_Sites_Facilities
)
declare -A opts=(
    [where]=
    [text]=
    [objectIds]=
    [time]=
    [timeRelation]=esriTimeRelationOverlaps
    [geometry]=
    [geometryType]=esriGeometryEnvelope
    [inSR]=
    [spatialRel]=esriSpatialRelIntersects
    [distance]=
    [units]=esriSRUnit_Foot
    [relationParam]=
    [outFields]=*
    [returnGeometry]=true
    [returnTrueCurves]=false
    [maxAllowableOffset]=
    [geometryPrecision]=
    [outSR]=
    [havingClause]=
    [returnIdsOnly]=false
    [returnCountOnly]=false
    [orderByFields]=
    [groupByFieldsForStatistics]=
    [outStatistics]=
    [returnZ]=false
    [returnM]=false
    [gdbVersion]=
    [historicMoment]=
    [returnDistinctValues]=false
    [resultOffset]=
    [resultRecordCount]=
    [returnExtentOnly]=false
    [sqlFormat]=none
    [datumTransformation]=
    [parameterValues]=
    [rangeValues]=
    [quantizationParameters]=
    [featureEncoding]=esriDefault
    [f]=geojson
)

usage() {
cat <<__EOF__
usage: $APPNAME [OPTION]* <service> <layer> [where]

    OPTION:

    -h              this help
    -o offset       start return from offset

    service := "recs" | "facilities"
    layer := number
    where := SQL WHERE clause

    ex:

    $APPNAME recs 12

__EOF__

    exit 0
}

while getopts ho: c
do
    case $c in
        o)  offset=$OPTARG;;
        *)  usage;;
    esac
done
shift $((OPTIND - 1))

[ $# -lt 2 ] && usage

service=$1
layer=$2

shift 2
where="$*"

opts[where]=${where:-1=1}
opts[resultOffset]=$offset
url="https://gis.blm.gov/arcgis/rest/services/recreation/${SERVICES[$service]}/MapServer/$layer/query"

for key in "${!opts[@]}"; do
    args+=( --data-urlencode $key="${opts[$key]}" )
done

exec curl --compressed --silent "${args[@]}" "$url"
