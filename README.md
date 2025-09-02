# Nomad Spots
Find the next rest spot

## Introduction
This is for personal-use only, and demonstrates how to use React Maplibre with
OpenstreeMap. This application helps travelers to find the next rest spot. For
convenience data is collated from various sources and displayed with markers on a
map. The focus is on finding rest spots while traveling in the United States.

## Instruction

* Create an account with MongoDB Atlas.
* Add `MONGODB_URI=<url>` variable to `.env.local`.
* Create db `geo` with collection `spots` in Atlas.
* Import `spots.json` into Atlas.

```
npm install
npm run dev
```

## TODO
* Implement api route rate-limiting
* Explore marker clustering to improve render performance

## Screenshot

![Screenshot](/public/screenshot.png)
