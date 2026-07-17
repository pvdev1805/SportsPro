import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import routes from './routes/index.routes.js'

const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, '../../client/views'))

app.use(express.static(path.join(__dirname, '../../client/public')))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/', routes)

export default app
