import express from 'express'
import bodyParser from 'body-parser'
import compression from 'compression'

import db from './services/db.js'
import { routes } from './routes/routes.js'

const setDbServices = (req, res, next) => {
    req.service = db
    next()
}

const app = express()

const PORT = process.env.PORT || 3001
// parse application/json
app.use(bodyParser.json())
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// use compression
app.use(compression())

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next()
})

app.listen(PORT, () => console.log(`App listening on :${PORT}`))

app.get('/', async (req, res, next) => {
    res.status(200).send(new Date())
})

app.use('/api', setDbServices, routes)

export default app