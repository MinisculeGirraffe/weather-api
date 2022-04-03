import express from 'express'
import {router as weatherRouter} from './weather/weather.js'
import {router as lookupRouter} from './lookup/lookup.js'
import {router as stationRouter} from './station/station.js'

export const apiRouter = express.Router()


apiRouter.use('/weather',weatherRouter)
apiRouter.use('/lookup',lookupRouter)
apiRouter.use('/station',stationRouter)

apiRouter.get('/', async (req,res) => {
    res.send('')
})

