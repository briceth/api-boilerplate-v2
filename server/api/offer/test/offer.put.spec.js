const chai = require('chai')
const expect = require('chai').expect
const should = require('chai').should()
const chaiHttp = require('chai-http')
const faker = require('faker')
const server = require('../../../../index')
const User = require('../../user/model')
const Company = require('../../company/model')
const Offer = require('../model')
const log = console.log

describe('PUT /offers/:id', () => {
  beforeEach(async () => {
    await Offer.remove()
    await User.remove()
    await Company.remove()

    pro = await User.create({
      email: faker.internet.email(),
      account: {
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        address: faker.address.streetAddress(),
        city: faker.address.city(),
        phone: faker.phone.phoneNumber(),
        type: 'pro'
      }
    })

    company = await Company.create({
      name: faker.company.companyName(),
      industry: faker.commerce.department()
    })
  })

  afterEach(async () => {
    await Offer.remove()
    await User.remove()
    await Company.remove()
  })

  it('should update an offer from "active" to "standby"', async () => {
    const result = await chai
      .request(server)
      .put(`/api/offers/${offer._id}`)
      .send({ status: 'standby' })

    expect(result).to.have.status(201)
    expect(result).to.be.json
  })
})
