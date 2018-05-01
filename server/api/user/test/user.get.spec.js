const chai = require('chai')
const expect = require('chai').expect
const should = require('chai').should()
const chaiHttp = require('chai-http')
const faker = require('faker')
const server = require('../../../../index')
const User = require('../model')
const log = console.log
// const factory = require('../../../utils/modelFactory')
// const { deleteDB } = require('../../../utils/helpers')

chai.use(chaiHttp)

describe('/users', () => {
  let student
  let college

  beforeEach(async () => {
    await User.remove({})
    //jwt = signToken(user.id)
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

    student = await User.create({
      email: faker.internet.email(),
      account: {
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        picture: faker.image.imageUrl(),
        address: faker.address.streetAddress(),
        type: 'student',
        college: college._id
      }
    })
  })

  afterEach(async () => {
    await User.remove({})
  })

  describe('GET /users', () => {
    it('should get an array with one user and one college', async () => {
      const result = await chai.request(server).get(`/api/users`)
      //.set('Authorization', `Bearer ${jwt}`)

      expect(result).to.have.status(201)
      expect(result).to.be.json
      expect(result.body).to.be.an('array')
      expect(result.body).to.have.lengthOf(2)
    })
  })

  describe('GET /users/:id', () => {
    it('should get a list of users by his type (student, college, rh etc ...)', async () => {
      const result = await chai.request(server).get(`/api/users/type/student`)
      //.set('Authorization', `Bearer ${jwt}`)

      expect(result).to.have.status(201)
      expect(result).to.be.json
      expect(result.body).to.be.an('array')
      expect(result.body).to.have.lengthOf(1)
    })
  })

  describe('GET /users/college/:college/students', () => {
    it('should get a list of students by their college name', async () => {
      console.log('college.account.username', college.account.college_name)
      console.log(`/api/college/${college.account.college_name}/students`)

      const result = await chai
        .request(server)
        .get(`/api/users/college/${college.account.college_name}/students`)

      expect(result).to.have.status(201)
      expect(result).to.be.json
      expect(result.body).to.be.an('array')
      expect(result.body).to.have.lengthOf(1)

      expect(result.body[0]).to.include.all.keys(
        'emailCheck',
        'passwordChange',
        'account',
        '_id',
        'email'
      )

      Object.keys(result.body[0]).every(key => expect(key).to.exist) //not empty and not false

      expect(result.body[0]._id).to.be.a('string')
      expect(result.body[0].email).to.be.a('string')
      expect(result.body[0].account).to.be.an('object')
      expect(result.body[0].emailCheck).to.be.an('object')
      expect(result.body[0].passwordChange).to.be.an('object')

      Object.keys(result.body[0].account).every(key => expect(key).to.exist)
      Object.keys(result.body[0].account).every(key =>
        expect(key).to.be.a('string')
      )
    })
  })
})

// describe('GET testing secured route users/:id', () => {
//   beforeEach(async () => {
//     await User.remove({})
//   })

//   it('Check autentification before giving access', done => {
//     factory.user({}, user => {
//       chai
//         .request(server)
//         .get(`/api/users/${user._id}`)
//         .set('Authorization', `Bearer ${user.token}`)
//         .set('Content-Type', 'application/json')
//         .end((err, res) => {
//           // console.log(err)
//           should.not.exist(err)
//           res.should.have.status(200)
//           res.should.be.a('object')
//           res.body.should.have.property('account')
//           res.body.account.should.have.property('description')
//           done()
//         })
//     })
//   })
// })
