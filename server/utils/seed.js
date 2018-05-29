const mongoose = require('mongoose')
const chalk = require('chalk')
const faker = require('faker')
faker.locale = 'fr'

const { createUser } = require('./modelFactory')
const User = require('../api/user/model')
const Class = require('../api/class/model')
const Application = require('../api/application/model')
const Offer = require('../api/offer/model')
const Company = require('../api/company/model')
const Message = require('../api/message/model')
const config = require('../../config')
const { deleteDB } = require('./helpers')
const log = console.log

// seed data
const seedDataColleges = require('./seedData/seedColleges.json')
const seedDataCompagnies = require('./seedData/seedCompanies.json')
const seedDataAdministrators = require('./seedData/seedAdministrators.json')

mongoose.connect(config.MONGODB_URI)

log('db url:', config.MONGODB_URI)

let collegeId
const collegeIds = []
const classesIds = []
const studentIds = []
const offerIds = []
const companyIds = []
const proIds = []

// ADMINISTRATOR
const seedAdministrators = async (number = 5) => {
  log('creating administrators...')
  const promises = []

  // génére des utilisateurs "college" grâce au fichier json seedDataColleges
  for (let i = 0; i < seedDataAdministrators.length; i++) {
    const administrator = await createUser({
      ...seedDataAdministrators[i],
      type: 'administrator'
    })
    promises.push(administrator)
    log(chalk.magenta(`>> Administrator ${i + 1}: ${promises[i].email}`))
  }
}

// COLLEGES
const seedColleges = async (number = 5) => {
  log('creating colleges...')
  const promises = []
  const numSeedColleges = seedDataColleges.length

  // génére des utilisateurs "college" grâce au fichier json seedDataColleges
  for (let i = 0; i < numSeedColleges; i++) {
    const college = await createUser({
      ...seedDataColleges[i],
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

  // génère des utilisateurs "college" sans passer par Passport
  for (let i = 0; i < number - numSeedColleges; i++) {
    const college = User.create({
      email: faker.internet.email(),
      account: {
        college_name: `Collège ${faker.name.findName()}`,
        phone: faker.phone.phoneNumber(),
        city: faker.address.city(),
        loc: [faker.address.longitude(), faker.address.latitude()],
        type: 'college'
      }
    })
    promises.push(college)
  }
  log(`${number - numSeedColleges} other colleges added`)

  return Promise.all(promises).then(colleges => {
    collegeId = colleges[0]._id
    for (let i = 0; i < colleges.length; i++) {
      collegeIds.push(colleges[i]._id)
    }
    log(chalk.green(`${colleges.length} colleges added !! 👨🏻 💻 `))
  })
}

// CLASSES
const seedClasses = async (number = 5) => {
  log('creating classes for 1st college...')
  const promises = []

  for (let i = 0; i < collegeIds.length; i++) {
    // créer cinq classes (3ème 1, 3ème 2, ...) pour tous les collèges
    for (let j = 0; j < number; j++) {
      const newClass = await Class.create({
        name: `3ème ${i + 1}`,
        college: collegeIds[i]
      })

      // classesIds contient uniquement les classes du 1er collège
      if (i === 0) promises.push(newClass)
    }
  }

  return Promise.all(promises).then(classes => {
    log(chalk.green(`${classes.length} classes added !! 😁 ❤️`))

    for (let i = 0; i < classes.length; i++) {
      classesIds.push(classes[i]._id)
    }
  })
}

//STUDENTS
const seedStudents = async (number = 20) => {
  log('creating students for 1st college...')
  const promises = []

  for (let i = 0; i < classesIds.length; i++) {
    for (let j = 0; j < number; j++) {
      // un élève sur deux n'a pas de photo de profil
      const picture =
        j % 2 === 0
          ? `https://randomuser.me/api/portraits/med/men/${i * 10 + j}.jpg`
          : 'undefined'

      const student = User.create({
        email: faker.internet.email(),
        account: {
          first_name: faker.name.firstName(),
          last_name: faker.name.lastName(),
          picture,
          address: faker.address.streetAddress(),
          diary_picture:
            'https://res.cloudinary.com/djexqgocu/image/upload/v1527068284/container-big_rdwvdp.pdf',
          type: 'student',
          class: classesIds[i],
          college: collegeId //un seul collège pour tous les élèves
        }
      })

      promises.push(student)
    }
  }

  return Promise.all(promises).then(students => {
    log(chalk.green(`${students.length} students added !! 😁 ❤️`))

    for (let i = 0; i < students.length; i++) {
      studentIds.push(students[i]._id)
    }
  })
}

// REFERENTS
const seedReferents = async () => {
  log('creating referents...')
  const promises = []
  const studentsPerClass = studentIds.length / classesIds.length

  // créer un référent par classe
  for (let i = 0; i < classesIds.length; i++) {
    const referent = await createUser({
      type: 'referent',
      email: `referent${i + 1}@mail.com`,
      class: classesIds[i],
      college: collegeId,
      students: studentIds.slice(
        i * studentsPerClass,
        (i + 1) * studentsPerClass
      )
    })
    log(
      chalk.magenta(
        `>> Référent ${i + 1}: ${referent.email} ${
          referent.account.first_name
        } ${referent.account.last_name}`
      )
    )

    promises.push(referent)
  }

  return Promise.all(promises).then(referents => {
    log(chalk.green(`${referents.length} referents added !! 😁 ❤️`))
  })
}

// COMPANIES
const seedCompanies = async () => {
  log('creating companies...')
  const promises = []

  for (let i = 0; i < seedDataCompagnies.length; i++) {
    const company = await Company.create({
      name: seedDataCompagnies[i].name,
      industry: seedDataCompagnies[i].industry,
      logo: seedDataCompagnies[i].logo
    })

    promises.push(company)
  }

  return Promise.all(promises).then(companies => {
    log(chalk.green(`${companies.length} companies added !! 😁 ❤️`))

    for (let i = 0; i < companies.length; i++) {
      companyIds.push(companies[i]._id)
    }
  })
}

// PROS
const seedPros = (number = 5) => {
  log('creating pros...')
  const promises = []

  for (let i = 0; i < number; i++) {
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

  return Promise.all(promises).then(pros => {
    log(chalk.green(`${pros.length} pros added !! 😁 ❤️`))

    for (let i = 0; i < pros.length; i++) {
      proIds.push(pros[i]._id)
    }
  })
}

// OFFERS
const seedOffers = (number = 5) => {
  log('creating offers...')
  const promises = []

  for (let i = 0; i < number; i++) {
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

  return Promise.all(promises).then(offers => {
    log(chalk.green(`${offers.length} offers added !! 😁 ❤️`))

    for (let i = 0; i < offers.length; i++) {
      offerIds.push(offers[i]._id)
    }
  })
}

// APPLICATIONS
const seedApplications = async () => {
  log('creating applications...')
  const promises = []
  const status = ['hiring', 'declined', 'pending']
  const statusSchema = [
    ['declined', 'declined', 'hiring', 'declined', 'declined', 'declined'],
    ['pending', 'pending', 'pending', 'pending'],
    ['hiring', 'declined', 'declined', 'declined', 'declined']
  ]

  for (let i = 0; i < studentIds.length; i++) {
    const schema = statusSchema[Math.floor(Math.random() * status.length)]

    for (let j = 0; j < schema.length; j++) {
      const application = await Application.create({
        status: schema[j],
        starts_at: schema[j] === 'hiring' ? faker.date.recent() : undefined,
        student: studentIds[i], // une candidature a un étudiant
        offer: offerIds[Math.floor(Math.random() * offerIds.length)] // lie une candidature a une offre au hazard
      })

      promises.push(application)
    }
  }

  return Promise.all(promises).then(applications => {
    log(chalk.green(`${applications.length} applications added !! 😁 ❤️`))
  })
}

// MESSAGES
const seedMessages = () => {
  log('creating messages...')
  const promises = []

  for (let i = 0; i < studentIds.length; i++) {
    // chaque élève va échanger entre 0 à 5 messages avec un pro et inversement
    // attention : tous les pros n'ont donc pas de messages ...
    const numMessages = Math.floor(Math.random() * 6)
    const proId = proIds[Math.floor(Math.random() * proIds.length)]

    // messages venant du pro
    for (let j = 0; j < numMessages; j++) {
      const message = Message.create({
        title: `Stage d'assistant ${faker.name.jobTitle()}`,
        content: faker.lorem.paragraph(),
        date: faker.date.past(),
        sender: proId,
        recipient: studentIds[i]
      })

      promises.push(message)
    }

    // messages venant du student
    for (let k = 0; k < numMessages; k++) {
      const message = Message.create({
        title: `Stage d'assistant ${faker.name.jobTitle()}`,
        content: faker.lorem.paragraph(),
        date: faker.date.past(),
        sender: studentIds[i],
        recipient: proId
      })

      promises.push(message)
    }
  }

  return Promise.all(promises).then(messages => {
    log(chalk.green(`${messages.length} messages added !! 😁 ❤️`))
  })
}

const closeConnection = () => {
  mongoose.connection.close(() => {
    log(chalk.magenta('Password for all accounts: azerty 🤫'))
    log('\n \n close connection')
  })
}

deleteDB()
  .then(() => seedAdministrators())
  .then(() => seedColleges(200))
  .then(() => seedClasses())
  .then(() => seedStudents())
  .then(() => seedReferents())
  .then(() => seedCompanies())
  .then(() => seedPros())
  .then(() => seedOffers())
  .then(() => seedApplications())
  .then(() => seedMessages())
  .then(() => closeConnection())
  .catch(error => log(chalk.red(error, '‼️ 👮🏽')))
