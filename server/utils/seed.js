const mongoose = require('mongoose')
const chalk = require('chalk')
const faker = require('faker')
const User = require('../api/user/model')
const Class = require('../api/class/model')
const config = require('../../config')
const { deleteDB } = require('./helpers')
const log = console.log

mongoose.connect(config.MONGODB_URI)

log('db url:', config.MONGODB_URI)

let collegeId
const classesIds = []

const printAllUsers = type => {
  return User.find({ 'account.type': type })
    .then(students => log(chalk.green(`print all ${type}:`), students))
    .catch(error => log(chalk.red(error)))
}

const printAllClasses = () => {
  return Class.find({})
    .then(classes => log(chalk.green('print all classes:'), classes))
    .catch(error => log(chalk.red(error)))
}

// COLLEGES
const seedColleges = () => {
  log('creating colleges...')
  const promises = []

  for (let i = 0; i < 5; i++) {
    const college = User.create({
      email: faker.internet.email(),
      account: {
        address: faker.address.streetAddress(),
        city: faker.address.city(),
        college_name: faker.name.findName(),
        phone: faker.phone.phoneNumber(),
        type: 'college'
      }
    })

    promises.push(college)
  }

  return Promise.all(promises).then(colleges => {
    log(chalk.green('colleges added !! 👨🏻 💻 '))
    collegeId = colleges[0]._id
  })
}

// CLASSES
const seedClasses = () => {
  log('creating classes...')
  const promises = []

  for (let i = 0; i < 5; i++) {
    const newClass = Class.create({
      name: faker.name.findName(),
      college: collegeId //le même collège pour toutes les classes
    })

    promises.push(newClass)
  }

  return Promise.all(promises).then(classes => {
    log(chalk.green('classes added !! 😁 ❤️'))

    for (let i = 0; i < classes.length; i++) {
      const newClass = classes[i]
      classesIds.push(newClass._id)
    }
  })
}

// STUDENTS
const seedStudents = () => {
  log('creating students...')
  const promises = []

  for (let i = 0; i < 5; i++) {
    const student = User.create({
      email: faker.internet.email(),
      account: {
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        picture: faker.image.imageUrl(),
        address: faker.address.streetAddress(),
        type: 'student',
        class: classesIds[i], //une classe pour chaque élève (moyen)
        college: collegeId //un seul collège pour tous les élèves
      }
    })

    promises.push(student)
  }

  return Promise.all(promises).then(() => {
    log(chalk.green('students added !! 😁 ❤️'))
  })
}

// REFERENTS
const seedReferents = () => {
  log('creating referents...')
  const promises = []

  for (let i = 0; i < 5; i++) {
    const referent = User.create({
      email: faker.internet.email(),
      password: '123456',
      account: {
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        type: 'referent',
        college: collegeId, //un seul collège pour tous les référents
        class: classesIds[i] //un référent par classe
      }
    })

    promises.push(referent)
  }

  return Promise.all(promises).then(() => {
    log(chalk.green('students added !! 😁 ❤️'))
  })
}

deleteDB()
  .then(() => seedColleges())
  .then(() => seedClasses())
  .then(() => seedStudents())
  .then(() => seedReferents())
  .then(() => printAllUsers('student'))
  .then(() => printAllUsers('college'))
  .then(() => printAllUsers('referent'))
  .then(() => printAllClasses())
  .catch(error => log(chalk.red(error, '‼️ 👮🏽')))
