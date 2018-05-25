const chalk = require('chalk')
const User = require('../api/user/model')
const Class = require('../api/class/model')
const Application = require('../api/application/model')
const Offer = require('../api/offer/model')
const Company = require('../api/company/model')
const Message = require('../api/message/model')
const log = console.log

exports.deleteDB = async () => {
  await User.remove({})
  await Class.remove({})
  await Application.remove({})
  await Offer.remove({})
  await Company.remove({})
  await Message.remove({})
  log(chalk.green('DB deleted !'))
}
