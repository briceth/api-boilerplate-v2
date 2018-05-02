const chai = require('chai')
const expect = require('chai').expect
const should = require('chai').should()
const chaiHttp = require('chai-http')
const faker = require('faker')
const server = require('../../../../index')
const User = require('../../user/model')
const Company = require('../../company/model')
const Offer = require('../model')
const { deleteDB } = require('../../../utils/helpers')

describe.only(`/offers`, () => {
  let company
  let offer
  let pro

  beforeEach(async () => {
    await deleteDB()

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

    offer = await Offer.create({
      title: faker.name.findName(),
      description: faker.lorem.sentence(),
      address: faker.address.streetAddress(),
      starts_at: faker.date.future(),
      end_at: faker.date.future(),
      profession: faker.commerce.department(),
      number_application: 7,
      company: company._id,
      pro: pro._id
    })
  })

  afterEach(async () => {
    await deleteDB()
  })

  describe(`GET /offers`, () => {
    it(`should get all offers`, async () => {
      const result = await chai.request(server).get(`/api/offers`)
      //.set('Authorization', `Bearer ${jwt}`)

      expect(result).to.have.status(201)
      expect(result).to.be.json
      expect(result.body).to.be.an('array')
    })
  })
})
