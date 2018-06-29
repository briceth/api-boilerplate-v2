const { deleteDB } = require('../utils/helpers')
const { connect, mongooseDisconnect } = require('../db')

const runScript = async () => {
  await connect()
  await deleteDB()
  await mongooseDisconnect()
}
runScript()
