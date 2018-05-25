const mongoose = require('mongoose')
const chalk = require('chalk')
const faker = require('faker')
const User = require('../api/user/model')
const Class = require('../api/class/model')
const Application = require('../api/application/model')
const Offer = require('../api/offer/model')
const Company = require('../api/company/model')
const Message = require('../api/message/model')
const config = require('../../config')
const {
  deleteDB
} = require('./helpers')
const log = console.log

mongoose.connect(config.MONGODB_URI)

log('db url:', config.MONGODB_URI)

let collegeId
const classesIds = []
const studentIds = []
const offerIds = []
const companyIds = []
const proIds = []

const printAllUsers = type => {
  return User.find({
      'account.type': type
    })
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
        //picture: `https://randomuser.me/api/portraits/med/men/${i}.jpg`, //tous les étudiants ont une picture sauf le premier
        address: faker.address.streetAddress(),
        curriculum: 'https://res.cloudinary.com/djexqgocu/image/upload/v1527068284/container-big_rdwvdp.pdf',
        type: 'student',
        class: classesIds[i], //une classe pour chaque élève (moyen)
        college: collegeId //un seul collège pour tous les élèves
      }
    })

    promises.push(student)
  }

  return Promise.all(promises).then((students) => {
    log(chalk.green('students added !! 😁 ❤️'))

    for (let i = 0; i < students.length; i++) {
      studentIds.push(students[i]._id)
    }
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
        class: classesIds[i], //un référent par classe
        students: i === 0 ? [...studentIds] : undefined // le premier référent est le référent des 5 élèves
      }
    })

    promises.push(referent)
  }

  return Promise.all(promises).then(() => {
    log(chalk.green('referent added !! 😁 ❤️'))
  })
}

// COMPANIES
const seedCompanies = () => {
  log('creating companies...')
  const promises = []

  for (let i = 0; i < 5; i++) {
    const company = Company.create({
      name: faker.company.companyName(),
      industry: faker.commerce.product(),
      logo: "https://picsum.photos/80/120"
    })

    promises.push(company)
  }

  return Promise.all(promises).then((companies) => {
    log(chalk.green('companies added !! 😁 ❤️'))

    for (let i = 0; i < companies.length; i++) {
      companyIds.push(companies[i]._id)
    }
  })
}

// PROS
const seedPros = () => {
  log('creating pros...')
  const promises = []

  for (let i = 0; i < 5; i++) {
    const application = User.create({
      email: faker.internet.email(),
      password: '123456',
      account: {
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        address: faker.address.streetAddress(),
        phone: faker.phone.phoneNumber(),
        type: 'pro',
        company: companyIds[i] //chaque pro a une company
      }
    })

    promises.push(application)
  }

  return Promise.all(promises).then((pros) => {
    log(chalk.green('students added !! 😁 ❤️'))

    for (let i = 0; i < pros.length; i++) {
      proIds.push(pros[i]._id)
    }
  })
}

// APPLICATIONS
const seedApplications = () => {
  log('creating applications...')
  const promises = []
  const status = ['hiring', 'declined', 'pending']

  for (let i = 0; i < 5; i++) {
    const application = Application.create({
      status: status[Math.floor(Math.random() * status.length)], //chope un status au hasard
      starts_at: faker.date.recent(),
      student: studentIds[i], // une candidature a un étudiant
      offer: offerIds[i] // une candidature a une offre
    })

    promises.push(application)
  }

  return Promise.all(promises).then(() => {
    log(chalk.green('students added !! 😁 ❤️'))
  })
}

// OFFERS
const seedOffers = () => {
  log('creating offers...')
  const promises = []

  for (let i = 0; i < 5; i++) {
    const offer = Offer.create({
      title: faker.name.title(),
      description: faker.name.jobDescriptor(),
      address: faker.address.streetAddress(),
      starts_at: faker.date.recent(),
      end_at: faker.date.future(),
      profession: faker.name.jobTitle(),
      number_application: i,
      company: companyIds[i],
      pro: proIds[i]
    })

    promises.push(offer)
  }

  return Promise.all(promises).then((offers) => {
    log(chalk.green('students added !! 😁 ❤️'))

    for (let i = 0; i < offers.length; i++) {
      offerIds.push(offers[i]._id)
    }
  })
}

const seedMessages = () => {
  log('creating messages...')
  const promises = []


  // 5 messages venant du pro
  for (let i = 0; i < 5; i++) {
    const message = Message.create({
      title: faker.name.title(),
      content: faker.lorem.paragraph(),
      date: faker.date.past(),
      sender: proIds[0], // tous les messages ont le même pro
      recipient: studentIds[0] //  tous les messages ont le même élève
    }) // sachant que tous les élèves ont le même référent, il faudra requêter le premier référent pour avoir les messages

    promises.push(message)
  }

  // 5 messages venant du student
  for (let i = 0; i < 5; i++) {
    const message = Message.create({
      title: faker.name.title(),
      content: faker.lorem.paragraph(),
      date: faker.date.past(),
      sender: studentIds[0], // tous les messages ont le même élève
      recipient: proIds[0] //  tous les messages ont le même pro
    }) // (sachant que tous les élèves ont le même référent, il faudra requêter le premier référent pour avoir les messages)

    promises.push(message)
  }

  return Promise.all(promises).then(() => {
    log(chalk.green('messages added !! 😁 ❤️'))
  })
}

deleteDB()
  .then(() => seedColleges())
  .then(() => seedClasses())
  .then(() => seedStudents())
  .then(() => seedReferents())
  .then(() => seedCompanies())
  .then(() => seedPros())
  .then(() => seedMessages())
  .then(() => seedOffers())
  .then(() => seedApplications())
  .then(() => printAllUsers('student'))
  .then(() => printAllUsers('college'))
  .then(() => printAllUsers('referent'))
  .then(() => printAllClasses())
  .catch(error => log(chalk.red(error, '‼️ 👮🏽')))