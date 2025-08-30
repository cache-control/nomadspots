import mongoClient from "@/lib/spots/mongodb";
import { NextRequest } from "next/server";
import { getSquareCorners } from "@/lib/spots/utils";

export async function GET(req: NextRequest) {
    try {
        const qs = req.nextUrl.searchParams;
        const src = qs.get("src");
        const lat = Number(qs.get("lat"));
        const lng = Number(qs.get("lng"));
        const radius = Number(qs.get("radius")) || 100;
        const sq = getSquareCorners(lat, lng, radius);
        const userAgent = req.headers.get("user-agent")
            || "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.10 Safari/605.1.1";

        if (radius > 100)
            return Response.json([]);

        if (src === 'fcs') {
            const loc = qs.get("lat") + ", " + qs.get("lng");
            const url = 'https://freecampsites.net'
                + '/wp-content/themes/freecampsites/androidApp.php'
                + `?location=(${loc})&coordinates=(${loc})&advancedSearch={}`;

            const res = await fetch(url, {
                headers: {
                    "User-Agent": userAgent,
                    "Accept": "application/json, text/javascript, */*; q=0.01",
                    "Referer": "https://freecampsites.net/"
                }
            });
            const result = await res.json();

            return Response.json(result)

        } else if (src === "iol") {
            const sq = getSquareCorners(lat, lng, radius);
            const url = 'https://ioverlander.com'
                + '/api/maps/places.json'
                + `?searchboxmin=${Math.floor(sq.bottomLeft.lat)},${Math.floor(sq.bottomLeft.lon)}`
                + `&searchboxmax=${Math.floor(sq.topRight.lat)},${Math.floor(sq.topRight.lon)}`

            const res = await fetch(url, {
                headers: {
                    "User-Agent": userAgent,
                    "Accept": "application/json, text/javascript, */*; q=0.01",
                    "Referer": "https://ioverlander.com/explore"
                }
            });
            const result = await res.json();

            return Response.json(result)
        }

        const client = mongoClient;
        const db = client.db("geo");
        const spots = await db
            .collection("spots")
            .find({
                lat: { $gt: sq.bottomLeft.lat, $lt: sq.topLeft.lat },
                lon: { $gt: sq.bottomLeft.lon, $lt: sq.bottomRight.lon }
            })
            .sort({ fee: 1 })
            .limit(300)
            .toArray();

        return Response.json(spots)

    } catch (e) {
        console.error(e);
    }
}
