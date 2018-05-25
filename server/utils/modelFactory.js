const uid = require('uid2')
const User = require('../api/user/model')
const faker = require('faker')
faker.locale = 'fr'

exports.createUser = async (options = {}, callback) => {
  const promise = new Promise((resolve, reject) => {
    const user = new User({
      email: options.email || faker.internet.email(),
      token: options.token || uid(32),
      emailCheck: {
        valid: options.emailCheckValid === false ? false : true,
        token: options.emailCheckToken || uid(20),
        createdAt: options.emailCheckCreatedAt || new Date()
      },
      passwordChange: {
        valid: options.passwordChangeValid === false ? false : true,
        token: options.passwordChangeToken || uid(20),
        createdAt: options.passwordChangeCreatedAt || new Date()
      },
      account: {
        type: options.type
      }
    })

    switch (options.type) {
      case 'student':
        createStudent(options, user, callback, resolve)
        break
      case 'college':
        createCollege(options, user, callback, resolve)
        break
      case 'referent':
        createReferent(options, user, callback, resolve)
        break
      default:
        break
    }
  })
  return promise
}

const createReferent = async (options, user, callback, resolve) => {
  const password = options.password || 'azerty'
  // paramètres obligatoires
  user.account.class = options.class
  user.account.college = options.college
  user.account.students = options.students

  user.email = options.email || faker.internet.email()
  user.account.first_name = options.name || faker.name.firstName()
  user.account.last_name = options.last_name || faker.name.lastName()

  await User.register(user, password, (err, user) => {
    if (err) {
      if (!callback) {
        reject(new Error(`Could not create user : ${err}`))
      } else {
        console.error(`Could not create user :  ${err}`)
      }
    } else if (!callback) {
      resolve(user)
    } else {
      callback(user)
    }
  })
}

const createStudent = async (options, user, callback, resolve) => {
  const password = options.password || 'azerty'
  // paramètres obligatoires
  user.account.class = options.class
  user.account.college = options.college

  user.email = options.email || faker.internet.email()
  user.account.first_name = options.name || faker.name.firstName()
  user.account.last_name = options.last_name || faker.name.lastName()
  user.account.address = options.address || faker.address.streetAddress()
  user.account.loc = options.loc || [
    faker.address.longitude(),
    faker.address.latitude()
  ]
  user.account.picture = options.picture
    ? options.picture === 'undefined'
      ? undefined
      : options.picture
    : faker.image.imageUrl()
  user.account.diary_picture = options.diary_picture || faker.image.imageUrl()

  await User.register(user, password, (err, user) => {
    if (err) {
      if (!callback) {
        reject(new Error(`Could not create user : ${err}`))
      } else {
        console.error(`Could not create user :  ${err}`)
      }
    } else if (!callback) {
      resolve(user)
    } else {
      callback(user)
    }
  })
}

const createCollege = async (options, user, callback, resolve) => {
  const password = options.password || 'azerty'

  user.account.city = options.city || faker.address.city()
  user.account.loc = options.loc || [
    faker.address.longitude(),
    faker.address.latitude()
  ]
  user.account.college_name =
    options.college_name || `Collège ${faker.name.findName()}`
  user.account.phone = options.phone || faker.phone.phoneNumber()

  await User.register(user, password, (err, user) => {
    if (err) {
      if (!callback) {
        reject(new Error(`Could not create user : ${err}`))
      } else {
        console.error(`Could not create user :  ${err}`)
      }
    } else if (!callback) {
      resolve(user)
    } else {
      callback(user)
    }
  })
}
