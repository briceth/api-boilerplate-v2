const chai = require('chai')
const expect = require('chai').expect
const should = require('chai').should()
const chaiHttp = require('chai-http')
const faker = require('faker')
const server = require('../../../../index')
const Message = require('../model')
const User = require('../../user/model')
const Company = require('../../company/model')
const log = console.log

chai.use(chaiHttp)

describe('GET MESSAGES', () => {
  let referent
  let student
  let message
  let pro
  let company

  beforeEach(async () => {
    await User.remove({})
    await Message.remove({})
    await Company.remove({})

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

    referent = await User.create({
      email: faker.internet.email(),
      account: {
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        // college: college._id,
        // class: classe._id,
        students: [student._id],
        type: 'referent'
      }
    })
    company = await Company.create({
      name: faker.company.companyName(),
      industry: faker.commerce.product(),
      logo: "https://picsum.photos/80/120"
    })

    pro = await User.create({
      email: faker.internet.email(),
      account: {
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        phone: faker.phone.phoneNumber(),
        address: faker.address.streetAddress(),
        type: 'pro',
        company: company._id
      }
    })

    message = await Message.create({
      title: faker.name.title(),
      content: faker.lorem.paragraph(),
      recipient: student._id,
      sender: pro._id
    })


  })

  afterEach(async () => {
    await User.remove({})
    await Message.remove({})
    await Company.remove({})
  })

  describe('GET /referent/:id/students/pros', () => {
    it('should get an array of messages from students/pros that belong to a referent', async () => {
      const result =
        await chai.request(server)
        .get(`/api/messages/referent/${referent._id}/students/pros`)
      //.set('Authorization', `Bearer ${jwt}`)

      expect(result).to.have.status(201)
      expect(result).to.be.json
      expect(result.body).to.be.an('array')
      expect(result.body).to.have.lengthOf(1)

      Object.keys(result.body[0]).every(key => expect(key).to.exist)

      expect(result.body[0]).to.include.all.keys(
        'read',
        '_id',
        'date',
        'title',
        'content',
        'sender',
      )

      expect(result.body[0].read).to.be.a('boolean')
      expect(result.body[0].date).to.be.a('string')
      expect(result.body[0]._id).to.be.a('string')
      expect(result.body[0].title).to.be.a('string')
      expect(result.body[0].content).to.be.a('string')
      expect(result.body[0].sender).to.be.an('object')
      expect(result.body[0].sender.account).to.be.an('object')
      expect(result.body[0].sender._id).to.be.a('string')
      expect(result.body[0].sender.account.first_name).to.be.a('string')
      expect(result.body[0].sender.account.last_name).to.be.a('string')
      expect(result.body[0].sender.account.type).to.be.a('string')

      if (result.body[0].sender.account.type === "pro") {
        expect(result.body[0].sender.account.company).to.be.an('object')
        Object.keys(result.body[0].sender.account.company).every(key => expect(key).to.exist)
        expect(result.body[0].sender.account.company.name).to.be.a('string')
        expect(result.body[0].sender.account.company.logo).to.be.a('string')
      }
    })
  })
})