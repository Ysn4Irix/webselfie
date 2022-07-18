require("dotenv").config()
const express = require("express")
const logger = require("morgan")
const helmet = require("helmet")
const cors = require("cors")
const responseTime = require("response-time")

const index = require("./routes/index.route")
const middlewares = require("./helpers/middlewares")

const app = express()

var corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200
}

app.use(logger("dev"))
app.use(helmet())
app.use(cors(corsOptions))
app.use(responseTime())
app.use(express.json())
app.use(
  express.urlencoded({
    extended: false,
  })
)

app.use("/api", index)

app.use(middlewares.notFound)
app.use(middlewares.errorHandler)

const port = process.env.PORT || 4000
const server = app.listen(port, () => {
  console.log(`🚀 server started => listening on PORT: ${port} with processId: ${process.pid}`)
})

process.on("SIGINT", () => {
  console.info("SIGINT signal received.")
  console.log("server is closing.")
  server.close(() => {
    console.log("server closed.")
    process.exit(0)
  })
})

process.on("SIGTERM", () => {
  console.info("SIGTERM signal received.")
  console.log("server is closing.")
  server.close(() => {
    console.log("server closed.")
    process.exit(0)
  })
})

module.exports = app