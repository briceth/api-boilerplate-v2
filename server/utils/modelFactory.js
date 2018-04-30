const uid = require('uid2')
const User = require('../api/user/model')
const faker = require('faker')

exports.createUser = (type, options = {}) => {
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
    }
  })

  switch (type) {
    case 'student':
      return createStudent(options, user)
      break
    case 'college':
      break
      return createCollege(options, user)
    default:
      break
  }
}

async function createStudent(options, user) {
  const password = options.password || 'password'

  user.account.first_name = options.name || faker.name.firstName()
  user.account.last_name = options.last_name || faker.name.lastName()
  user.account.picture = options.picture || faker.image.imageUrl()
  user.account.address = options.address || faker.address.streetAddress()
  user.account.type = 'student'

  const newUser = await User.register(user, password)
  return newUser
}

async function createCollege(user) {
  const password = options.password || 'password'

  user.account.address = options.name || faker.address.streetAddress()
  user.account.city = options.last_name || faker.address.city()
  user.account.college_name = options.picture || faker.name.findName()
  user.account.phone = options.address || faker.phone.phoneNumber()
  user.account.type = 'college'

  const newUser = await User.register(newUser, password)
  return newUser
}

// options: email, token, password, emailCheckValid, emailCheckToken,
//          emailCheckCreatedAt, name, description
// exports.user = (options, callback) => {
//   return new Promise((resolve, reject) => {
//     const password = options.password || 'password'
//     const newUser = new User({
//       email: options.email || faker.internet.email(),
//       token: options.token || uid(32),
//       emailCheck: {
//         valid: options.emailCheckValid === false ? false : true,
//         token: options.emailCheckToken || uid(20),
//         createdAt: options.emailCheckCreatedAt || new Date()
//       },
//       passwordChange: {
//         valid: options.passwordChangeValid === false ? false : true,
//         token: options.passwordChangeToken || uid(20),
//         createdAt: options.passwordChangeCreatedAt || new Date()
//       },
//       account: {
//         first_name: options.name || faker.name.firstName(),
//         last_name: options.last_name || faker.name.lastName(),
//         picture: options.picture || faker.image.imageUrl(),
//         address: options.address || faker.address.streetAddress(),
//         type: options.type
//       }
//     })

//     User.register(newUser, password, function(err, user) {
//       if (err) {
//         if (!callback) {
//           reject('Could not create user : ' + err)
//         } else {
//           console.error('Could not create user : ' + err)
//         }
//       } else {
//         if (!callback) {
//           resolve(user)
//         } else {
//           callback(user)
//         }
//       }
//     })
//   })
// }
