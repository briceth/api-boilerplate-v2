const chai = require('chai')
const expect = require('chai').expect
const should = require('chai').should()
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

    newClass = await Class.create({
      name: faker.name.findName(),
      college: college._id
    })
  })

  afterEach(async () => {
    await Class.remove()
    await User.remove()
  })

  describe('GET /classes', () => {
    it('should get a list of all classes of all colleges', async () => {
      const result = await chai.request(server).get(`/api/classes`)

      expect(result).to.have.status(201)
      expect(result).to.be.json
      expect(result.body).to.be.an('array')
      expect(result.body[0]).to.include.all.keys(
        'is_active',
        'students',
        'date',
        '_id',
        'college'
      )
      Object.keys(result.body[0]).every(key => expect(key).to.exist)
      expect(result.body[0]._id).to.be.a('string')
      expect(result.body[0].name).to.be.a('string')
      expect(result.body[0].college).to.be.a('string')
      expect(result.body[0].date).to.be.a('string')
    })
  })

  describe('GET /classes/college/:id', () => {
    it('should get a list of classes of given college', async () => {
      const result = await chai
        .request(server)
        .get(`/api/classes/college/${college._id}`)

      expect(result).to.have.status(201)
      expect(result).to.be.json
      expect(result.body).to.be.an('array')
      expect(result.body[0]).to.include.all.keys(
        'is_active',
        'students',
        'date',
        '_id',
        'college'
      )
      Object.keys(result.body[0]).every(key => expect(key).to.exist)
      expect(result.body[0]._id).to.be.a('string')
      expect(result.body[0].name).to.be.a('string')
      expect(result.body[0].college).to.be.a('string')
      expect(result.body[0].date).to.be.a('string')
      expect(result.body[0].students).to.be.an('array')
      expect(result.body[0].students).to.be.empty
    })
  })
})
