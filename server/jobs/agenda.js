const Agenda = require('agenda')
const config = require('../../config')

const agenda = new Agenda({ db: { address: config.MONGODB_URI } })

let jobTypes = process.env.JOB_TYPES ? process.env.JOB_TYPES.split(',') : []

jobTypes.forEach(type => {
  require('./jobs/' + type)(agenda)
})

function graceful() {
  agenda.stop(() => {
    process.exit(0)
  })
}

process.on('SIGTERM', graceful)
process.on('SIGINT', graceful)

module.exports = agenda
