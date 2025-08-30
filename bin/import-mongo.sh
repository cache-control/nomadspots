#!/bin/bash

seedScript=/dev/shm/seed-spots.js

cat <<__EOF__ > $seedScript
db = db.getSiblingDB('geo')
db.dropDatabase()

db.spots.insert(
$(jq '.[]' spots/spots-*.json | jq --slurp)
)
__EOF__

source .env.local
mongosh "$MONGODB_URI" $seedScript
