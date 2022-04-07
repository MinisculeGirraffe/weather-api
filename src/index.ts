import 'dotenv/config'
import express from 'express'
import helmet from "helmet";
import rateLimit from 'express-rate-limit'
import mongoSanitize from "express-mongo-sanitize"


import {apiRouter} from './routes/api.js'

const app = express()
const port = process.env.PORT || 3000

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})
app.use(limiter)
app.use(mongoSanitize)

app.use(express.json({ limit: '1mb' }))
app.use(helmet())
app.use('/api',apiRouter)

app.get('/', (req,res) => {
    res.send('')
})

app.use((req,res) => {
    res.status(404)
})
app.listen(port, () => {
    console.log(`listening on port ${port}`)
})

