#! /bin/bash
#
# reads from stdio and outputs to stdout entries with unique coordinates
# only
#

mlr --json filter \
'
begin {
    @seen = {};
}

key=$type . "," . $lon . "," . $lat;
@seen[key]+=1;
@seen[key]==1;
' | jq
