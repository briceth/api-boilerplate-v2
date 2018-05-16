// const chai = require('chai')
// const expect = require('chai').expect
// const should = require('chai').should()
// const chaiHttp = require('chai-http')
// const faker = require('faker')
// const server = require('../../../../../index')
// const User = require('../../model')
// const Application = require('../../../application/model')
// const Offer = require('../../../offer/model')
// const Company = require('../../../company/model')
// const log = console.log

// chai.use(chaiHttp)

// describe('GET STUDENT', () => {
//   let student
//   let college
//   let application
//   let pro
//   let offer

//   beforeEach(async () => {
//     await User.remove({})
//     await Company.remove({})
//     await Offer.remove({})
//     await Application.remove({})
//     //jwt = signToken(user.id)
//     college = await User.create({
//       email: faker.internet.email(),
//       account: {
//         address: faker.address.streetAddress(),
//         city: faker.address.city(),
//         college_name: faker.name.findName(),
//         phone: faker.phone.phoneNumber(),
//         type: 'college'
//       }
//     })

//     student = await User.create({
//       email: faker.internet.email(),
//       account: {
//         first_name: faker.name.firstName(),
//         last_name: faker.name.lastName(),
//         picture: faker.image.imageUrl(),
//         address: faker.address.streetAddress(),
//         type: 'student',
//         college: college._id
//       }
//     })

//     pro = await User.create({
//       email: faker.internet.email(),
//       account: {
//         first_name: faker.name.firstName(),
//         last_name: faker.name.lastName(),
//         address: faker.address.streetAddress(),
//         city: faker.address.city(),
//         phone: faker.phone.phoneNumber(),
//         type: 'pro'
//       }
//     })

//     company = await Company.create({
//       name: faker.company.companyName(),
//       industry: faker.commerce.department()
//     })

//     offer = await Offer.create({
//       title: faker.name.findName(),
//       description: faker.lorem.sentence(),
//       address: faker.address.streetAddress(),
//       starts_at: faker.date.future(),
//       end_at: faker.date.future(),
//       profession: faker.commerce.department(),
//       number_application: 7,
//       company: company._id,
//       pro: pro._id
//     })

//     application = await Application.create({
//       status: 'hiring',
//       starts_at: faker.date.future(),
//       student: student._id,
//       offer: offer._id
//     })
//   })

//   afterEach(async () => {
//     await User.remove({})
//     await Company.remove({})
//     await Offer.remove({})
//     await Application.remove({})
//   })


//   describe('GET /users/college/:college/students => controlleur: getStudentsFromCollege', () => {
//     it('should get a list of students by their college id and with number of applications and statut', async () => {
//       const result = await chai
//         .request(server)
//         .get(`/api/users/college/${college._id}/students`)

//       //result
//       expect(result).to.have.status(201)
//       expect(result).to.be.json
//       expect(result.body).to.be.an('array')
//       expect(result.body).to.have.lengthOf(1)

//       expect(result.body[0]).to.include.all.keys(
//         'account',
//         '_id',
//         'application'
//       )
//       Object.keys(result.body[0]).every(key => expect(key).to.exist) //not empty and not false

//       expect(result.body[0]._id).to.be.a('string')
//       //account
//       expect(result.body[0].account).to.be.an('object')
//       Object.keys(result.body[0].account).every(key => expect(key).to.exist)
//       Object.keys(result.body[0].account).every(key =>
//         expect(key).to.be.a('string')
//       )
//       //application
//       expect(result.body[0].application).to.be.an('object')
//       Object.keys(result.body[0].application).every(key => expect(key).to.exist)
//       expect(result.body[0].application.statut).to.be.a('string')
//       expect(result.body[0].application.number).to.be.a('number')
//     })
//   })
// })