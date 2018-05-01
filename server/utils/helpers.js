const chalk = require('chalk')
const User = require('../api/user/model')
const Class = require('../api/class/model')
const log = console.log

exports.deleteDB = async () => {
  await User.remove({})
  await Class.remove({})
  log(chalk.green('DB deleted !'))
}
