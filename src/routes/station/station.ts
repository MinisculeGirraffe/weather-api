import express from 'express'
import { client } from '../../lib/mongoClient.js'

export const router = express.Router()

router.get('/:id', async (req, res) => {
    const data = await lookupStationByID(req.params.id)
    res.send(data)
})

async function lookupStationByID(station: string) {
    await client.connect()
    const db = client.db('USGeoData')
    const collection = db.collection('stations')
    const filter = {"station": station}
   return collection.findOne(filter)
}