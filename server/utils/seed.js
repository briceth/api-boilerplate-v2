const chalk = require('chalk')
const faker = require('faker')
const { createUser } = require('./modelFactory')
const User = require('../api/user/model')
const config = require('../../config')
const { deleteDB } = require('./helpers')
const { connect, mongooseDisconnect } = require('../db')
const log = console.log
faker.locale = 'fr'

// seed data
const seedDataColleges = require('./seedData/seedColleges.json')
const seedDataStudents = require('./seedData/seedStudents.json')
const seedDataAdministrators = require('./seedData/seedAdministrators.json')

connect()

log('db url:', config.MONGODB_URI)

let collegeId
const collegeIds = []
const referentIds = []
const studentIds = []
const proIds = []

// ADMINISTRATOR
const seedAdministrators = async () => {
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

// REFERENTS
const seedReferents = async (number = 5) => {
  log('creating referents...')
  const promises = []

  // créer un référent par classe
  for (let i = 0; i < number; i++) {
    const referent = await createUser({
      type: 'referent',
      email: `referent${i + 1}@mail.com`,
      college: collegeId
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
    for (let i = 0; i < referents.length; i++) {
      referentIds.push(referents[i]._id)
    }

    log(chalk.green(`${referents.length} referents added !! 😁 ❤️`))
  })
}

const createAStudent = async () => {
  const me = await createUser({
    email: 'tessierhuort@gmail.com',
    name: 'brice',
    last_name: 'tessier',
    color: '#ef4c31',
    picture: `https://randomuser.me/api/portraits/med/men/${9}.jpg`,
    address: faker.address.streetAddress(),
    loc: [48.86, 2.21],
    diary_picture:
      'https://res.cloudinary.com/djexqgocu/image/upload/v1527068284/container-big_rdwvdp.pdf',
    type: 'student',
    college: collegeId //un seul collège pour tous les élèves
  })
  log(`student ${me.email} was created`)
}

//STUDENTS
const seedStudents = async (number = 20) => {
  log('creating students for 1st college...')

  const promises = []
  const numSeedStudents = seedDataStudents.length

  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < number; j++) {
      // un élève sur deux n'a pas de photo de profil
      const picture =
        j % 2 === 0
          ? `https://randomuser.me/api/portraits/med/men/${i * 10 + j}.jpg`
          : undefined

      // créer des élèves à partir de seedDataStudents
      if (i === 0 && j < numSeedStudents) {
        const student = await createUser({
          ...seedDataStudents[i],
          picture,
          college: collegeId, //un seul collège pour tous les élèves
          type: 'student'
        })
        promises.push(student)
        continue
      }

      const student = User.create({
        email: faker.internet.email(),
        account: {
          first_name: faker.name.firstName(),
          last_name: faker.name.lastName(),
          picture,
          address: faker.address.streetAddress(),
          loc: [faker.address.longitude(), faker.address.latitude()],
          diary_picture:
            'https://res.cloudinary.com/djexqgocu/image/upload/v1527068284/container-big_rdwvdp.pdf',
          type: 'student',
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

      if (i < numSeedStudents) {
        log(
          chalk.magenta(
            `>> Élève ${i + 1}: ${students[i].email} ${
              students[i].account.first_name
            } ${students[i].account.last_name}`
          )
        )
      }
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
        loc: [faker.address.longitude(), faker.address.latitude()],
        phone: faker.phone.phoneNumber(),
        type: 'pro'
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

const printPassword = () => {
  log(chalk.magenta('Password for all accounts: azerty 🤫'))
}

deleteDB()
  .then(() => seedAdministrators())
  .then(() => seedColleges(200))
  .then(() => seedReferents())
  .then(() => seedPros())
  .then(() => createAStudent())
  .then(() => seedStudents())
  .then(() => printPassword())
  .then(() => mongooseDisconnect())
  .then(() => process.exit(0))
  .catch(error => log(chalk.red(error, '‼️ 👮🏽')))
