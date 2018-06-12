const chai = require('chai')
const expect = require('chai').expect
const chaiHttp = require('chai-http')
const faker = require('faker')
const uid2 = require('uid2')
const server = require('../../../../../index')
const User = require('../../model')
const Class = require('../../../class/model')
const Application = require('../../../application/model')
const Offer = require('../../../offer/model')
const Company = require('../../../company/model')
const log = console.log

describe.only('GET REFERENT', () => {
  let referent
  let admin
  let student
  let college
  let newClass

  beforeEach(async () => {
    await User.remove({})

    college = await User.create({
      email: faker.internet.email(),
      account: {
        address: faker.address.streetAddress(),
        city: faker.address.city(),
        college_name: faker.name.findName(),
        phone: faker.phone.phoneNumber(),
        type: 'college'
      }
    })

    student = await User.create({
      email: faker.internet.email(),
      token: uid2(32),
      account: {
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        type: 'student'
      }
    })


    newClass = await Class.create({
      name: faker.name.findName(),
      college: college._id,
      students: [student._id]
    })

    referent = await User.create({
      email: faker.internet.email(),
      token: uid2(32),
      account: {
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        students: [student._id],
        type: 'referent'
      }
    })

    admin = await User.create({
      email: faker.internet.email(),
      token: uid2(32),
      account: {
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        type: 'admin',
      }
    })
  })

  afterEach(async () => {
    await User.remove({})
  })

  // describe('GET /referent/:id/students', () => {
  //   it('should get the students from referent with no errors', async () => {
  //     const result = await chai.request(server)
  //       .get(`/api/users/referent/${referent._id}/students`)
  //       .set('Authorization', `Bearer ${referent.token}`)

  //     console.log("result", result.body);

  //     expect(result).to.have.status(201)
  //     expect(result).to.be.json
  //     expect(result.body).to.be.an('array')
  //   })
  // })
})