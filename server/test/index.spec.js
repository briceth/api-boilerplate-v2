const chai = require('chai')
const expect = require('chai').expect
const should = require('chai').should()
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const server = require('../../index')

describe('Home', function() {
  describe('GET /', function() {
    it('respond with welcome message', function(done) {
      chai
        .request(server)
        .get('/')
        .end(function(err, res) {
          should.not.exist(err)
          res.should.have.status(200)
          res.text.should.equal('Welcome to the Airbnb API.')
          done()
        })
    })
  })
})
