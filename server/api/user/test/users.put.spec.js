const chai = require('chai')
const expect = require('chai').expect
const chaiHttp = require('chai-http')
const faker = require('faker')
const uid2 = require('uid2')
const server = require('../../../../index')
const User = require('../model')
const usersSpec = require('./users.utils')
chai.use(chaiHttp)
const log = console.log

describe('/users', () => {
  let student
  let college
  let admin

  beforeEach(async () => {
    await User.remove({})

    college = await User.create({
      email: faker.internet.email(),
      token: uid2(32),
      account: {
        address: faker.address.streetAddress(),
        city: faker.address.city(),
        college_name: faker.name.findName(),
        phone: faker.phone.phoneNumber(),
        type: 'college'
      }
    })

    admin = await User.create({
      email: faker.internet.email(),
      token: uid2(32),
      account: {
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        type: 'admin'
      }
    })
  })

  afterEach(async () => {
    await User.remove({})
  })

  // describe('PUT /api/users/:id', () => {
  //   it('should update the user (college, referent etc...) with no errors', async () => {
  //     const result = await chai.request(server)
  //       .put(`/api/users/${college._id}`)
  //       .send({
  //         account: {
  //           college_name: "college lereacteur"
  //         }
  //       })
  //       .set('Authorization', `Bearer ${college.token}`)

  //     expect(result).to.have.status(201)
  //     expect(result).to.be.json
  //     expect(result.body).to.be.an('object')
  //     usersSpec(result.body)
  //     expect(result.body.account.college_name).to.equal("college lereacteur")
  //   })
  // })

  describe('PUT /api/users/first-connection/:id', () => {
    it('users should update his first_connection from TRUE to FALSE', async () => {
      const result = await chai
        .request(server)
        .put(`/api/users/first-connection/${college._id}`)
        .send({
          first_connection: false
        })
        .set('Authorization', `Bearer ${college.token}`)

      expect(result).to.have.status(201)
      expect(result).to.be.json
      expect(result.body).to.be.an('object')
      expect(result.body.message).to.be.an('string')
      expect(result.body.user.account.first_connection).to.equal(false)
      usersSpec(result.body.user)
    })
  })
})
