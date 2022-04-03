import express from 'express'
import { client } from '../../lib/mongoClient.js'
export const router = express.Router()

router.get('/:id', async (req, res) => {
    const query = {
        id: req.params.id,
        start: Number(req.query.start),
        end: Number(req.query.end),
        ...(req.query.maxTemp && { maxTemp: Number(req.query.maxTemp) }),
        ...(req.query.minTemp && { maxTemp: Number(req.query.minTemp) })
    }
    const maxSearchDays = 31
    const searchLength = (query.end - query.start) / 86400
    if (searchLength > maxSearchDays) {
        res.send({
            error: `Invalid Date range specified,requested ${searchLength.toFixed(2)} of maximum ${maxSearchDays} `
        })
        return
    }
    if (searchLength <= 0) {
        res.send({
            error: `Invalid Date range of ${searchLength.toFixed(2)} days supplied. Possibly mixed up start and end dates?`
        })
        return
    }

    const response = await getDataBetweenDates(query)

    res.send(response)
    console.log(`${req.method} - Station ${query.id} for ${searchLength} days`)

})

// start and end date in unix time
interface DataParams {
    id: string,
    start: number,
    end: number,
    minTemp?: number,
    maxTemp?: number
}
async function getDataBetweenDates(param: DataParams) {
    await client.connect()
    const db = client.db('WeatherDatabase')
    const collection = db.collection(param.id)
    console.log(param)
    const filter = {
        ...((param.minTemp != undefined || param.maxTemp != undefined) && {
            'temp.temp': {
                ...(param.maxTemp != undefined && { '$lt': param.maxTemp }),
                ...(param.minTemp != undefined && { '$gt': param.minTemp })
            }
        }),
        'timestamp': {
            '$gte': new Date(param.start * 1000), //convert unix time to date object
            '$lte': new Date(param.end * 1000)
        }
    }
    console.log(filter)
    return collection.find(filter).toArray()
}
