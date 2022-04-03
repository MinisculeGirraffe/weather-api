import express from 'express'
import { client } from '../../lib/mongoClient.js'
import { harvensineDistance } from '../../lib/harvenrsine.js'
export const router = express.Router()


router.get('/', async (req, res) => {
    console.time()
    let response = await getStationByCoords(Number(req.query.lat), Number(req.query.lon))
    res.send(response)
    console.log(response)
    console.log(req.query)
    console.timeEnd()
})

async function isInUS([lon,lat] : number[]) {
    await client.connect()
    const db = client.db('USGeoData')
    const collection = db.collection('stations')
    const query = {
        'geometry': {
            '$geoIntersects': {
                '$geometry': {
                    'type': 'Point',
                    'coordinates': [lon,lat]
                }
            }
        }
    }
    const result = await collection.find(query).toArray()
    return result.length >= 1 ? true : false

}

async function getStationByCoords(lat: number, lon: number) {
    await client.connect()
    const db = client.db('USGeoData')
    const collection = db.collection('stations')
    const query = {
        'loc': {
            '$near': {
                '$geometry': {
                    'type': 'Point',
                    'coordinates': [lon, lat]
                }
            }
        }
    }

    let result = await collection.find(query).limit(5).toArray()
    return result.map(station => {
        // add the distance from the supplied lat/lon to the response
        station.distance = harvensineDistance([lat, lon], station.loc.coordinates.reverse())
        return station
    })
}

