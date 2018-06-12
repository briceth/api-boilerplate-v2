const express = require('express')
const cors = require('cors') // to authorize request to the API from another domaine
const config = require('../config')
const {
  connect
} = require('./db')
const {
  errorHandler
} = require('./middlewares/core')
const setupAppMiddleware = require('./middlewares/app')
const app = express()
setupAppMiddleware(app)
connect()

app.get('/', (req, res) => {
  res.send('Welcome to the  API.')
})

app.use('/api', require('./api'))
app.use('/auth', require('./auth/routes'))

// Error 404 for all verbs (GET, POST, etc.) when page not found.
app.all('*', (req, res) => {
  res.status(404).json({
    status: 404,
    error: 'Not Found'
  })
})

// Error handling middleware
// This middleware is call with next(err_msg) within a route
// to be put at the end
app.use(errorHandler)

module.exports = app