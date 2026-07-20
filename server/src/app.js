import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import routes from './routes/index.routes.js'
import notFoundMiddleware from './middlewares/not-found.middleware.js'
import errorMiddleware from './middlewares/error.middleware.js'

const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, '../../client/views'))

app.use(express.static(path.join(__dirname, '../../client/public')))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use((req, res, next) => {
  res.setHeader('X-App-Instance', process.env.INSTANCE_NAME || 'local')

  next()
})

app.use('/', routes)

app.use(notFoundMiddleware)
app.use(errorMiddleware)

export default app
