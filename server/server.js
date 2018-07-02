const express = require('express')
const { connect } = require('./db')
const setupAppMiddleware = require('./middlewares/app')
const { errorHandler } = require('./middlewares/core')

const app = express()
setupAppMiddleware(app)
connect()

app.get('/', (_, res) => {
  res.send('Welcome to the  API.')
})

app.use('/auth', require('./auth/routes'))
app.use('/api', require('./api'))

// Error 404 for all verbs (GET, POST, etc.) when page not found.
app.all('*', (_, res) => {
  res.status(404).json({
    status: 404,
    error: 'Not Found'
  })
})

// Error handling middleware
// This middleware is call with next(error) within a route
// must be put at the end
app.use(errorHandler)

module.exports = app
