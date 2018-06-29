const server = require('../../index')
const { mongooseDisconnect } = require('../db')

describe.only('Closing connections', () => {
  it('Closes all connections', done => {
    server.close()
    mongooseDisconnect() // Needed in order to stop mocha from running
    done()
  })
})
