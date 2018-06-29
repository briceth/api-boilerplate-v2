require('dotenv').config()
const chalk = require('chalk')
const { connect, mongooseDisconnect } = require('../db')
const User = require('../api/user/model')
const Class = require('../api/class/model')
const Application = require('../api/application/model')
const Offer = require('../api/offer/model')
const Company = require('../api/company/model')
const Message = require('../api/message/model')
const log = console.log

const deleteDB = async () => {
  await User.remove()
    .then(() => 'Les users ont été suprimés')
    .catch(e => console.log(e))
  await Class.remove()
    .then(() => 'Les classes ont été suprimés')
    .catch(e => console.log(e))
  await Application.remove()
    .then(() => 'Les candidatures ont été suprimées')
    .catch(e => console.log(e))
  await Offer.remove()
    .then(() => 'Les offres ont été suprimés')
    .catch(e => console.log(e))
  await Company.remove()
    .then(() => 'Les entreprises ont été suprimés')
    .catch(e => console.log(e))
  await Message.remove()
    .then(() => 'Les messages ont été suprimés')
    .catch(e => console.log(e))

  log(chalk.green('Database is empty !'))
}

module.exports = { deleteDB }
