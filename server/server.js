const express = require('express')
const { connect } = require('./db')
const setupAppMiddleware = require('./middlewares/app')
const agenda = require('./jobs/agenda')
const { errorHandler } = require('./middlewares/core')

const app = express()
setupAppMiddleware(app)
connect()

//agenda treats months as 0-11 where as normally, cron months are parsed as 1-12.
agenda.on('ready', () => {
  agenda.start()
  agenda.every('0 00 15 5 *', 'archive classes') // run le 15 JUIN à minuit
})

app.get('/', (_, res) => {
  res.send('Welcome to the  API.')
})

app.use('/auth', require('./auth/routes'))
app.use('/api', require('./api'))

// Without this header the browser will re-request the file on each subsequent request.
// public resources can be cached not only by the end-user’s browser but also by any intermediate proxies
// private resources are bypassed by intermediate proxies and can only be cached by the end-client.
// max-age sets a timespan for how long to cache the resource (in seconds).
// app.use((req, res, next) => {
//   if (!('JSONResponse' in res)) {
//     console.log('caching')
//     return next()
//   }

//   res.setHeader('Cache-Control', 'public, max-age=31557600')
//   res.json(res.JSONResponse)
// })

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
