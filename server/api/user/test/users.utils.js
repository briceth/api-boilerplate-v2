const chai = require('chai')
const expect = require('chai').expect
const chaiHttp = require('chai-http')

module.exports = (result) => {
  expect(result).to.be.an('object')
  Object.keys(result).every(key => expect(key).to.exist)
  Object.keys(result.emailCheck).every(key => expect(key).to.exist)
  expect(result.emailCheck.valid).to.be.an('boolean')
  expect(result.emailCheck.valid).to.equal(true)
  expect(result.emailCheck.token).to.be.a('string')
  expect(result.emailCheck.createdAt).to.be.a('string')
  expect(result.passwordChange).to.be.an('object')
  expect(result.passwordChange.valid).to.be.a('boolean')
  expect(result.passwordChange.valid).to.equal(true)
  Object.keys(result.account).every(key => expect(key).to.exist)
  expect(result.account.first_connection).to.be.a('boolean')
  expect(result.account.students).to.be.an('array')
  expect(result.account.color).to.be.a('string')
  expect(result.token).to.be.a('string')
  expect(result._id).to.be.a('string')
  expect(result.email).to.be.a('string')
}