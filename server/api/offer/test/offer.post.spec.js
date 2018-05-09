const chai = require('chai')
const expect = require('chai').expect
const chaiHttp = require('chai-http')
const faker = require('faker')
const server = require('../../../../index')
const User = require('../../user/model')
const Company = require('../../company/model')
const Offer = require('../model')
const log = console.log

describe(`/offers`, () => {
  let pro
  let company

  beforeEach(async () => {
    await Offer.remove()
    await User.remove()

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
  })

  describe('POST /offers', () => {
    it('should create an offer with his company and his pro', async () => {
      const result = await chai
        .request(server)
        .post(`/api/offers`)
        .send({
          title: faker.name.findName(),
          description: faker.lorem.sentence(),
          address: faker.address.streetAddress(),
          starts_at: faker.date.future(),
          end_at: faker.date.future(),
          profession: faker.commerce.department(),
          company: company._id,
          pro: pro._id
        })

      expect(result).to.have.status(201)
      expect(result).to.be.json

      Object.keys(result.body).every(key => expect(key).to.exist)

      expect(result.body.number_application).to.be.a('number')
      expect(result.body.is_active).to.be.a('boolean')
      expect(result.body._id).to.be.a('string')
      expect(result.body.title).to.be.a('string')
      expect(result.body.description).to.be.a('string')
      expect(result.body.address).to.be.a('string')
      expect(result.body.starts_at).to.be.a('string')
      expect(result.body.end_at).to.be.a('string')
      expect(result.body.profession).to.be.a('string')
      expect(result.body.company).to.be.a('string')
      expect(result.body.pro).to.be.a('string')
    })
  })
})
