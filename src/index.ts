import 'dotenv/config'
import express from 'express'
import {apiRouter} from './routes/api.js'

const app = express()
const port = process.env.PORT || 3000

app.use(express.json({ limit: '1mb' }))
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

