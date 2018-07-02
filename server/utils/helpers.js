require('dotenv').config()
const chalk = require('chalk')
const User = require('../api/user/model')

const log = console.log

const deleteDB = async () => {
  await User.remove()
    .then(() => 'Les users ont été suprimés')
    .catch(e => console.log(e))

  log(chalk.green('Database is empty !'))
}

module.exports = { deleteDB }
