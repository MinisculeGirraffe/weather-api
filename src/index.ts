
import express from 'express'
import {apiRouter} from './routes/index.js'

const app = express()
const port = process.env.PORT || 3000

app.use(express.json({ limit: '1mb' }))
app.use('/api',apiRouter)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

