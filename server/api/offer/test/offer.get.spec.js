const chai = require('chai')
const expect = require('chai').expect
const chaiHttp = require('chai-http')
const uid2 = require('uid2')
const faker = require('faker')
const server = require('../../../../index')
const Offer = require('../model')
const User = require('../../user/model')
const Company = require('../../company/model')
chai.use(chaiHttp)

let company
let offer
let pro
let student
describe.only(`/offers`, () => {
  beforeEach(async () => {
    await Offer.remove()
    await User.remove()
    await Company.remove()

    college = await User.create({
      email: faker.internet.email(),
      token: uid2(32),
      account: {
        address: faker.address.streetAddress(),
        city: faker.address.city(),
        college_name: faker.name.findName(),
        phone: faker.phone.phoneNumber(),
        type: 'college'
      }
    })

    student = await User.create({
      email: faker.internet.email(),
      token: uid2(32),
      account: {
        loc: [faker.address.longitude(), faker.address.latitude()],
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        picture: faker.image.imageUrl(),
        address: faker.address.streetAddress(),
        type: 'student',
        college: college._id
      }
    })

    company = await Company.create({
      name: faker.company.companyName(),
      industry: faker.commerce.department()
    })

    pro = await User.create({
      email: faker.internet.email(),
      account: {
        loc: [faker.address.longitude(), faker.address.latitude()],
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        address: faker.address.streetAddress(),
        city: faker.address.city(),
        phone: faker.phone.phoneNumber(),
        company: company._id,
        type: 'pro'
      }
    })

    offer = await Offer.create({
      loc: [faker.address.longitude(), faker.address.latitude()],
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
    await Offer.remove()
    await User.remove()
    await Company.remove()
  })

  // describe(`GET /offers`, () => {
  //   it(`should get all offers`, async () => {
  //     let result
  //     try {
  //       result = await chai
  //         .request(server)
  //         .get(`/api/offers`)
  //         .set('Authorization', `Bearer ${student.token}`)
  //     } catch (error) {
  //       log(error)
  //     }

  //     expect(result).to.have.status(201)
  //     expect(result).to.be.json
  //     expect(result.body).to.be.an('array')
  //   })
  // })

  describe(`GET /offers/student/studentId`, () => {
    it(`should get all offers sort by favorites then by geoloc`, async () => {
      const result = await chai
        .request(server)
        .get(`/api/offers/student/${student._id}`)
        .set('Authorization', `Bearer ${student.token}`)

      expect(result).to.have.status(201)
      expect(result).to.be.json
      expect(result.body).to.be.an('array')

      Object.keys(result.body[0]).every(key => expect(key).to.exist)
      expect(result.body[0].number_application).to.be.an('number')
      expect(result.body[0].is_active).to.be.a('boolean')
      expect(result.body[0]._id).to.be.a('string')
      expect(result.body[0].loc).to.be.an('array')
      expect(result.body[0].title).to.be.a('string')
      expect(result.body[0].description).to.be.a('string')
      expect(result.body[0].address).to.be.a('string')
      expect(result.body[0].starts_at).to.be.a('string')
      expect(result.body[0].end_at).to.be.a('string')
      expect(result.body[0].profession).to.be.a('string')
      Object.keys(result.body[0].company).every(key => expect(key).to.exist)
      expect(result.body[0].company._id).to.be.a('string')
      expect(result.body[0].company.name).to.be.a('string')
      expect(result.body[0].company.industry).to.be.a('string')
      expect(result.body[0].pro).to.be.a('string')
    })
  })
})
