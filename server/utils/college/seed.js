const mongoose = require('mongoose')
const chalk = require('chalk')
const uid2 = require('uid2')

const { createUser } = require('../modelFactory')

const config = require('../../../config')
const log = console.log

// seed data
const seedDataColleges = require('./seedColleges.json')

mongoose.connect(config.MONGODB_URI)

log('db url:', config.MONGODB_URI)

// COLLEGES
const seedColleges = async () => {
  log('creating colleges...')
  const promises = []

  // génére des utilisateurs "college" grâce au fichier json seedDataColleges
  for (let i = 0; i < seedDataColleges.length; i++) {
    const college = await createUser({
      ...seedDataColleges[i],
      password: uid2(8),
      type: 'college'
    })
    promises.push(college)
    log(
      chalk.magenta(
        `>> College ${i + 1}: ${promises[i].email} ${
          promises[i].account.college_name
        }`
      )
    )
  }

  return Promise.all(promises).then(colleges => {
    log(chalk.green(`${colleges.length} colleges added !! 👨🏻 💻 `))
  })
}

const closeConnection = () => {
  mongoose.connection.close(() => {
    log('\n \n close connection')
  })
}

seedColleges()
  .then(() => closeConnection())
  .catch(error => log(chalk.red(error, '‼️ 👮🏽')))
