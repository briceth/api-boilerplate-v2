const chai = require('chai')
const expect = require('chai').expect
const chaiHttp = require('chai-http')
const faker = require('faker')
const uid2 = require('uid2')
const server = require('../../../../index')
const User = require('../../user/model')
const Class = require('../model')
const log = console.log

describe('/classes', () => {
  let college

  beforeEach(async () => {
    await Class.remove()
    await User.remove()

    college = await User.create({
      email: faker.internet.email(),
      account: {
        token: uid2(32),
        address: faker.address.streetAddress(),
        city: faker.address.city(),
        college_name: `Collège ${faker.name.findName()}`,
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
        .post('/api/classes')
        .send({
          name: faker.name.findName(),
          college: college._id
        })
        .set('Authorization', `Bearer ${college.token}`)

      expect(result).to.have.status(201)
      expect(result).to.be.json
      expect(result.body.doc.students).to.be.an('array')
      expect(result.body.doc.students).to.be.empty
      expect(result.body.doc).to.include.all.keys(
        'is_active',
        'students',
        'date',
        '_id',
        'college'
      )
      Object.keys(result.body).every(key => expect(key).to.exist)
      expect(result.body.doc._id).to.be.a('string')
      expect(result.body.doc.name).to.be.a('string')
      expect(result.body.doc.college).to.be.a('string')
      expect(result.body.doc.date).to.be.a('string')
    })
  })
})
