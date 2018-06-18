const chai = require('chai')
const expect = require('chai').expect
const chaiHttp = require('chai-http')
const faker = require('faker')
const uid2 = require('uid2')
const server = require('../../../../../index')
const User = require('../../model')
const usersSpec = require('../users.utils')
chai.use(chaiHttp)
const log = console.log

describe('PUT REFERENT', () => {
  let referent
  let admin

  beforeEach(async () => {
    await User.remove({})

    referent = await User.create({
      email: faker.internet.email(),
      token: uid2(32),
      account: {
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        type: 'referent'
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

  describe('PUT /api/users/:id', () => {
    it('should update the referent with no errors', async () => {
      const result = await chai
        .request(server)
        .put(`/api/users/${referent._id}`)
        .send({
          email: faker.internet.email(),
          account: {
            first_name: 'Xavier',
            last_name: 'Colombel'
          }
        })
        .set('Authorization', `Bearer ${referent.token}`)

      expect(result).to.have.status(201)
      expect(result).to.be.json
      expect(result.body).to.be.an('object')
      expect(result.body.account.first_name).to.equal('xavier')
      expect(result.body.account.last_name).to.equal('colombel')
      usersSpec(result.body)
    })
  })
})
