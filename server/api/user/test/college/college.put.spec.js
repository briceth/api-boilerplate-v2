const chai = require('chai')
const expect = require('chai').expect
const should = require('chai').should()
const chaiHttp = require('chai-http')
const faker = require('faker')
const server = require('../../../../../index')
const User = require('../../model')
const log = console.log

chai.use(chaiHttp)

describe("PUT COLLEGE", () => {
  let college

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
  })

  afterEach(async () => {
    await User.remove({})
  })

  it('should update a college', async () => {
    const result = await chai
      .request(server)
      .put(`/api/users/${college._id}`)
      //.set('Authorization', `Bearer ${jwt}`)
      .send({
        email: faker.internet.email(),
        account: {
          address: faker.address.streetAddress(),
          city: faker.address.city(),
          college_name: faker.name.findName(),
          phone: faker.phone.phoneNumber()
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
      'address',
      'city',
      'phone',
      'college_name'
    )
  })
})