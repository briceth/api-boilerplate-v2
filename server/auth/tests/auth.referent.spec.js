const chai = require('chai')
const expect = require('chai').expect
const chaiHttp = require('chai-http')
const server = require('../../../index')
const User = require('../../api/user/model')
const factory = require('../../utils/modelFactory')
const log = console.log

chai.use(chaiHttp)

describe('/auth', () => {
  beforeEach(async () => {
    await User.remove()
  })

  afterEach(async () => {
    await User.remove()
  })

  describe('POST /auth/sign_up', () => {
    it('should create a referent', async () => {
      const result = await chai
        .request(server)
        .post('/auth/sign_up')
        .send({
          email: 'tessierhuort@gmail.com',
          password: '123456',
          account: {
            first_name: 'brice',
            last_name: 'tessier',
            type: 'referent'
          }
        })

      expect(result).to.have.status(201)
      expect(result).to.be.json
      expect(result.body).to.include.all.keys('email', 'message', 'user')
      Object.keys(result.body).every(key => expect(key).to.exist)
      expect(result.body.email).to.be.a('string')
      expect(result.body.message).to.be.a('string')
      expect(result.body.user).to.be.a('object')
      expect(result.body.user.account).to.be.a('object')
      Object.keys(result.body.user.account).every(key =>
        expect(key).to.be.a('string')
      )
      expect(result.body.user.token).to.be.a('string')
      expect(result.body.user.id).to.be.a('string')
    })
  })

  describe('POST /auth/sign_up', () => {
    it('should not create a referent because no password', async () => {
      try {
        const result = await chai
          .request(server)
          .post('/auth/sign_up')
          .send({
            email: 'tessierhuort@gmail.com',
            account: {
              first_name: 'brice',
              last_name: 'tessier',
              type: 'referent'
            }
          })
      } catch (error) {
        expect(error).to.have.status(400)
      }
    })
  })

  describe('POST /auth/sign_up', () => {
    it('should not create a referent because no email', async () => {
      try {
        const result = await chai
          .request(server)
          .post('/auth/sign_up')
          .send({
            password: '123456',
            account: {
              first_name: 'brice',
              last_name: 'tessier',
              type: 'referent'
            }
          })
      } catch (error) {
        expect(error).to.have.status(400)
      }
    })
  })
})
