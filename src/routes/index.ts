import express from 'express'
import {router as weatherRouter} from './weather/index.js'
import {router as lookupRouter} from './lookup/index.js'

export const apiRouter = express.Router()


apiRouter.use('/weather',weatherRouter)
apiRouter.use('/lookup',lookupRouter)

apiRouter.get('/', async (req,res) => {
    res.send('')
})

