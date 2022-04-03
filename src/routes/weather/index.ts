import express from 'express'
import { client } from '../../lib/mongoClient.js'
export const router = express.Router()

router.get('/:id', async (req, res) => {
    const query = {
        id: req.params.id,
        start: Number(req.query.start),
        end: Number(req.query.end),
    }
    const maxSearchDays = 31
    const searchLength = (query.end - query.start) / 86400
    if(searchLength > maxSearchDays) {
        res.send({
            error: `Invalid Date range specified,requested ${searchLength} of maximum ${maxSearchDays} `
        })
        return
    }

    const response = await getDataBetweenDates(query)

    res.send(response)
    console.log(`${req.method} - Station ${query.id} for ${searchLength} days`)

})

// start and end date in unixtime
interface DataParams {
    id: string,
    start: number,
    end: number
}
async function getDataBetweenDates({ id, start, end }: DataParams) {
    await client.connect()
    const db = client.db('WeatherDatabase')
    const collection = db.collection(id)

    const filter = {
        'timestamp': {
            '$gte': new Date(start * 1000), //convert unix time to date object
            '$lte': new Date (end * 1000)
        }
    }
    return collection.find(filter).toArray()
}
