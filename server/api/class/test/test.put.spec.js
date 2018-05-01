const chai = require('chai')
const expect = require('chai').expect
const should = require('chai').should()
const chaiHttp = require('chai-http')
const faker = require('faker')
const server = require('../../../../index')
const User = require('../../user/model')
const Class = require('../model')
const log = console.log

describe.only(`/classes`, () => {
  let newClass
  let student
  let college
  beforeEach(async () => {
    await Class.remove()
    await User.remove()

    student = await User.create({
      email: faker.internet.email(),
      account: {
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        picture: faker.image.imageUrl(),
        address: faker.address.streetAddress(),
        type: 'student'
      }
    })

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

  describe('PUT /classes/:id', () => {
    it('should update a class by adding a student', async () => {
      const result = await chai
        .request(server)
        .put(`/api/classes/${newClass._id}`)
        .send({ name: 'standby', student: student._id })

      expect(result).to.have.status(201)
      expect(result).to.be.json
      expect(result.body.students).to.be.an('array')
      expect(result.body).to.include.all.keys(
        'is_active',
        'students',
        'date',
        '_id',
        'college'
      )
    })
  })

  describe('PUT /:id/isactive', () => {
    it('should update a class by "toggleing" his status is_active', async () => {
      const result = await chai
        .request(server)
        .put(`/api/classes/${newClass._id}/isactive`)
        .send({ boolean: false })

      expect(result).to.have.status(201)
      expect(result).to.be.json
      expect(result.body).to.include.all.keys(
        'is_active',
        'students',
        'date',
        '_id',
        'college'
      )

      Object.keys(result.body).every(key => expect(key).to.exist)

      expect(result.body.students).to.be.an('array')
      expect(result.body._id).to.be.a('string')
      expect(result.body.is_active).to.be.a('boolean')
      expect(result.body.college).to.be.a('string')
    })
  })
})
