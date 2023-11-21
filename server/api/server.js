const express = require('express')
const cors = require('cors')
const routes = require('./routes')
const cookieParser = require('cookie-parser')
require ('dotenv').config()

const app = express()
app.use(cookieParser())
app.use(express.json())
app.use(cors({
    credentials: true,
    origin: ['http://localhost:2823', 'http://localhost:3000', 'http://localhost:8080']
}))

const port = process.env.PORT

routes(app)

app.listen(port, () => console.log(`O servidor está ON port ${port}`))

module.exports = app