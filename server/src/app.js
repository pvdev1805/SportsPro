import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, '../../client/views'))

app.use(express.static(path.join(__dirname, '../../client/public')))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.render('index', {
    title: 'SportsPro Technical Support'
  })
})

export default app
