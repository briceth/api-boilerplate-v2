const chai = require('chai')
const expect = require('chai').expect
const should = require('chai').should()
const chaiHttp = require('chai-http')
const faker = require('faker')
const server = require('../../../../index')
const User = require('../model')
// const factory = require('../../../utils/modelFactory')
// const { deleteDB } = require('../../../utils/helpers')

chai.use(chaiHttp)

describe.only('/users', () => {
  let student
  let college

  beforeEach(async () => {
    await User.remove({})
    //jwt = signToken(user.id)
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
