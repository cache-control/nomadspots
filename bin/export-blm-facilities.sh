#! /bin/bash
#
# https://gis.blm.gov/arcgis/rest/services/recreation/BLM_Natl_Recreation/MapServer
#
#BLM Natl RIDB Recreation Sites" refers to recreation sites within the
#Bureau of Land Management's Recreation and Interpretation Data Base
#(RIDB), whereas "BLM Natl Recreation Sites" refers to any national
#recreation site managed by the Bureau of Land Management. The inclusion
#of "RIDB" specifies that the sites are listed in the Recreation and
#Interpretation Data Base, a digital catalog of public land recreation
#information. 

APPNAME=${BASH_SOURCE##*/}
GEOJSON=/dev/shm/$APPNAME.json
URL='https://gis.blm.gov/arcgis/rest/services/recreation/BLM_Natl_Recreation/MapServer/2/query?where=1%3D1&text=&objectIds=&time=&timeRelation=esriTimeRelationOverlaps&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&distance=&units=esriSRUnit_Foot&relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&havingClause=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&historicMoment=&returnDistinctValues=false&resultOffset=&resultRecordCount=&returnExtentOnly=false&sqlFormat=none&datumTransformation=&parameterValues=&rangeValues=&quantizationParameters=&featureEncoding=esriDefault&f=geojson'

[ ! -s $GEOJSON ] && {
    curl --compressed -sLo $GEOJSON "$URL"
}

< $GEOJSON jq \
'
.features
| map(
    {
        name: .properties.FacilityName,
        description: .properties.FacilityDescription,
        url:
            (
                .properties.BLMFacURL // ""
                | gsub("\\s*"; "")
                | select(contains("/")) // ""
            ),
        lat: .geometry.coordinates[1],
        lon: .geometry.coordinates[0],
        src: "blm",
        fee:
            (
                if (.FacilityUseFeeDescription // ""|test("No Fee|None|Free"; "i")) then
                    "Free"
                else
                    "Unknown"
                end
            ),
        org: "BLM",
        ratings_count: 0,
        ratings_value: 0,
        type: "campsite",
    }
)
'
