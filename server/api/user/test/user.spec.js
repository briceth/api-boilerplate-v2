const chai = require('chai')
const expect = require('chai').expect
const should = require('chai').should()
const chaiHttp = require('chai-http')
const server = require('../../../../index')
const User = require('../model')
const factory = require('../../../utils/modelFactory')

chai.use(chaiHttp)

describe('GET testing secured route users/:id', function() {
  beforeEach(done => {
    User.remove({}, err => {
      done()
    })
  })
  it('Check autentification before giving access', function(done) {
    factory.user({}, function(user) {
      chai
        .request(server)
        .get(`/api/users/${user._id}`)
        .set('Authorization', `Bearer ${user.token}`)
        .set('Content-Type', 'application/json')
        .end(function(err, res) {
          // console.log(err)
          should.not.exist(err)
          res.should.have.status(200)
          res.should.be.a('object')
          res.body.should.have.property('account')
          res.body.account.should.have.property('description')
          done()
        })
    })
  })
})
