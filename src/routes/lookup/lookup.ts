import express from 'express'
import { client } from '../../lib/mongoClient.js'
import { harvensineDistance } from '../../lib/harvenrsine.js'
import console from 'console'
export const router = express.Router()

router.get('/', async (req, res) => {
    console.log(req.query)
    if (!req.query.lat || !req.query.lon) {
        res.send({ error: "Missing Latitude or Longitude" })
        return
    }
    const query = {
        lat: Number(req.query.lat),
        lon: Number(req.query.lon),
        ...(req.query.includeYears && {
            includeYears: String(req.query.includeYears).split(',')
        })
    }
    let response = await getStationByCoords(query)
    res.send(response)

})

async function isInUS([lon, lat]: number[]) {
    await client.connect()
    const db = client.db('USGeoData')
    const collection = db.collection('stations')
    const query = {
        'geometry': {
            '$geoIntersects': {
                '$geometry': {
                    'type': 'Point',
                    'coordinates': [lon, lat]
                }
            }
        }
    }
    const result = await collection.find(query).toArray()
    return result.length >= 1 ? true : false
}

interface stationLookupParams {
    lat: number,
    lon: number,
    includeYears?: string[]
}

async function getStationByCoords(params: stationLookupParams) {
    await client.connect()
    const db = client.db('USGeoData')
    const collection = db.collection('stations')
    const query = {
        'loc': {
            '$near': {
                '$geometry': {
                    'type': 'Point',
                    'coordinates': [params.lon, params.lat]
                }
            }
        },
        ...(params.includeYears && {
            "files.year": {
                "$in": params.includeYears
            }
        })

    }

    let result = await collection.find(query).limit(5).toArray()
    return result.map(station => {
        // add the distance from the supplied lat/lon to the response
        station.distance = harvensineDistance([params.lon, params.lat], station.loc.coordinates.reverse())
        return station
    })
}

