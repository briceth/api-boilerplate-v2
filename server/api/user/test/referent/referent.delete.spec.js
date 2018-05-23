const chai = require('chai')
const expect = require('chai').expect
const should = require('chai').should()
const chaiHttp = require('chai-http')
const faker = require('faker')
const server = require('../../../../../index')
const User = require('../../model')
const Class = require('../../../class/model')
const log = console.log

chai.use(chaiHttp)

describe('DELETE REFERENT', () => {
  let referent
  let classe
  let college

  beforeEach(async () => {
    await User.remove({})
    await Class.remove({})

    college = await User.create({
      email: faker.internet.email(),
      account: {
        college_name: faker.name.firstName(),
        phone: faker.phone.phoneNumber(),
        type: 'college'
      }
    })

    classe = await Class.create({
      name: faker.name.findName(),
      college: college._id
    })

    referent = await User.create({
      email: faker.internet.email(),
      account: {
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        college: college._id,
        class: classe._id,
        type: 'referent'
      }
    })
  })

  afterEach(async () => {
    await User.remove({})
    await Class.remove({})
  })


  it('should remove the referent and remove it if from the class', async () => {
    const result = await chai
      .request(server)
      .delete(`/api/users/referent/${referent._id}`)

    expect(result).to.have.status(201)
    expect(result).to.be.json

    expect(result.body).to.include.all.keys(
      'message',
      'referent',
      'doc',
    )

    expect(result.body.referent).to.include.all.keys(
      'first_name',
      'last_name'
    )

    Object.keys(result.body.referent).every(key =>
      expect(key).to.be.a('string')
    )

    expect(result.body.doc).to.include.all.keys(
      'is_active',
      'students',
      '_id',
      'name',
      'college',
      '__v'
    )
  })
})