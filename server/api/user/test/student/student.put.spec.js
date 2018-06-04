const chai = require('chai')
const expect = require('chai').expect
const should = require('chai').should()
const chaiHttp = require('chai-http')
const faker = require('faker')
const server = require('../../../../../index')
const User = require('../../model')
const log = console.log

chai.use(chaiHttp)

describe.only("PUT STUDENT", () => {
  let student

  beforeEach(async () => {
    await User.remove({})

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
  })

  afterEach(async () => {
    await User.remove({})
  })

  it('should update a student with keys: emailCheck, passwordChange, account, _id, email', async () => {
    const result = await chai
      .request(server)
      .put(`/api/users/${student._id}`)
      .set('Authorization', `Bearer ${student.token}`)
      .send({
        email: faker.internet.email(),
        account: {
          first_name: faker.name.firstName(),
          last_name: faker.name.lastName(),
          picture: faker.image.imageUrl(),
          address: faker.address.streetAddress()
        }
      })

    expect(result).to.have.status(201)
    expect(result).to.be.json
    expect(result.body).to.include.all.keys(
      'emailCheck',
      'passwordChange',
      'account',
      '_id',
      'email'
    )

    expect(result.body.account).to.include.all.keys(
      'first_name',
      'last_name',
      'picture',
      'address'
    )
  })
})