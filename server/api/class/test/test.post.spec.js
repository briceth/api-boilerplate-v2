const chai = require('chai')
const expect = require('chai').expect
const chaiHttp = require('chai-http')
const faker = require('faker')
const server = require('../../../../index')
const User = require('../../user/model')
const Class = require('../model')
const log = console.log

describe(`/classes`, () => {
  let newClass
  let college

  beforeEach(async () => {
    await Class.remove()
    await User.remove()

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
  })

  afterEach(async () => {
    await Class.remove()
    await User.remove()
  })

  describe('POST /classes', () => {
    it('should create a class with his college id', async () => {
      const result = await chai
        .request(server)
        .post(`/api/classes`)
        .send({
          name: faker.name.findName(),
          college: college._id
        })


      expect(result).to.have.status(201)
      expect(result).to.be.json
      expect(result.body.students).to.be.an('array')
      expect(result.body.students).to.be.empty
      expect(result.body).to.include.all.keys(
        'is_active',
        'students',
        'date',
        '_id',
        'college'
      )
      Object.keys(result.body).every(key => expect(key).to.exist)
      expect(result.body._id).to.be.a('string')
      expect(result.body.name).to.be.a('string')
      expect(result.body.college).to.be.a('string')
      expect(result.body.date).to.be.a('string')
    })
  })
})