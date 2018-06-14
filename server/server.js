const express = require('express')
const cors = require('cors') // to authorize request to the API from another domaine
const config = require('../config')
const { connect } = require('./db')
const { errorHandler, canUser } = require('./middlewares/core')

const setupAppMiddleware = require('./middlewares/app')
const app = express()
setupAppMiddleware(app)
connect()

app.get('/', (req, res) => {
  res.send('Welcome to the  API.')
})

app.use('/auth', require('./auth/routes'))
app.use('/api', require('./api'))

// Without this header the browser will re-request the file on each subsequent request.
// public resources can be cached not only by the end-user’s browser but also by any intermediate proxies
// private resources are bypassed by intermediate proxies and can only be cached by the end-client.
// max-age sets a timespan for how long to cache the resource (in seconds).
app.use((req, res, next) => {
  if (!('JSONResponse' in res)) {
    console.log('caching')
    return next()
  }
  console.log('caching')

  res.setHeader('Cache-Control', 'public, max-age=31557600')
  res.json(res.JSONResponse)
})
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
