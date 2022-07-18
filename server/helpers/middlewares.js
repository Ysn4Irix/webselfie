const createError = require("http-errors")

const notFound = (req, res, next) => {
  next(createError.NotFound())
}

const errorHandler = (error, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode
  res.status(statusCode).json({
    error: {
      message: process.env.NODE_ENV === "production" ? createError.InternalServerError() : error.message,
      stack: process.env.NODE_ENV === "production" ? "🙄🙄" : error.stack,
    },
  })
}

module.exports = {
  notFound,
  errorHandler,
}