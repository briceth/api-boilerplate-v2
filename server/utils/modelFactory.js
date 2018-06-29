const uid = require('uid2')
const User = require('../api/user/model')
const faker = require('faker')
faker.locale = 'fr'

exports.createUser = async (options = {}, callback) => {
  const promise = new Promise((resolve, reject) => {
    const user = new User({
      email: options.email || faker.internet.email(),
      token: options.token || uid(32),
      passwordChange: {
        token: options.passwordChangeToken || uid(24)
      },
      account: {
        type: options.type
      }
    })

    switch (options.type) {
      case 'administrator':
        createAdministrator(options, user, callback, resolve, reject)
        break
      case 'student':
        createStudent(options, user, callback, resolve, reject)
        break
      case 'college':
        createCollege(options, user, callback, resolve, reject)
        break
      case 'referent':
        createReferent(options, user, callback, resolve, reject)
        break
      default:
        break
    }
  })
  return promise
}

const createAdministrator = (options, user, callback, resolve, reject) => {
  const password = options.password || 'azerty'
  user.account.first_name = options.first_name || faker.name.firstName()
  user.account.is_active = options.is_active || true

  userRegister(user, password, callback, resolve, reject)
}

const createReferent = (options, user, callback, resolve, reject) => {
  const password = options.password || 'azerty'
  // paramètres obligatoires
  user.account.class = options.class
  user.account.college = options.college
  user.account.students = options.students

  user.account.first_name = options.name || faker.name.firstName()
  user.account.last_name = options.last_name || faker.name.lastName()
  user.account.is_active = options.is_active || true

  userRegister(user, password, callback, resolve, reject)
}

const createStudent = (options, user, callback, resolve, reject) => {
  const password = options.password || 'azerty'
  // paramètres obligatoires
  user.account.class = options.class
  user.account.college = options.college

  user.account.first_name = options.first_name || faker.name.firstName()
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
  user.account.is_active = options.is_active || true

  userRegister(user, password, callback, resolve, reject)
}

const createCollege = (options, user, callback, resolve, reject) => {
  const password = options.password || 'azerty'

  user.is_created = options.is_created
  user.account.city = options.city || faker.address.city()
  user.account.loc = options.loc || [
    faker.address.longitude(),
    faker.address.latitude()
  ]
  user.account.college_name =
    options.college_name || `Collège ${faker.name.findName()}`
  user.account.phone = options.phone || faker.phone.phoneNumber()
  user.account.is_active = options.is_active || true

  userRegister(user, password, callback, resolve, reject)
}

userRegister = async (user, password, callback, resolve, reject) => {
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
