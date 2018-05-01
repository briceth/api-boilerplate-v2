const chai = require('chai')
const expect = require('chai').expect
const should = require('chai').should()
const chaiHttp = require('chai-http')
const server = require('../../../../index')
const User = require('../../user/model')
const Offer = require('../model')

describe(`/offers`, () => {
  //let jwt
  let company
  let offer
  beforeEach(async () => {
    //await dropDb()
    await Offer.remove()
    await User.remove()
    company = await User.create({
      email: 'saintjoseph@mail.com',
      school: 'saint-joseph',
      account: { type: 'college' }
    })

    offer = await Offer.create({
      title: 'title2',
      content: 'content2',
      startAt: '09/02/2017',
      endAt: '09/04/2018',
      trade: 'commercial',
      industry: 'alimentation',
      number_application: 7,
      company: company._id
    })

    //jwt = signToken(user.id)
  })

  afterEach(async () => {
    //await dropDb()
    await Offer.remove()
    await User.remove()
  })

  describe(`GET /offers`, () => {
    it(`should get all offers`, async () => {
      const result = await chai.request(server).get(`/api/offers`)
      //.set('Authorization', `Bearer ${jwt}`)

      expect(result).to.have.status(201)
      expect(result).to.be.json
    })
  })

  describe(`POST /offers`, () => {
    it(`should create a offers`, async () => {
      const result = await chai
        .request(server)
        .post(`/api/offers`)
        //.set('Authorization', `Bearer ${jwt}`)
        .send({
          title: 'title',
          content: 'content',
          startAt: '09/02/1994',
          endAt: '09/04/1994',
          trade: 'commercial',
          industry: 'luxe',
          number_application: 9,
          company: company._id
        })

      expect(result).to.have.status(201)
      expect(result).to.be.json
    })
  })

  describe('PUT /offers/:id', () => {
    it('should update an offer from "active" to "standby"', async () => {
      const result = await chai
        .request(server)
        .put(`/api/offers/${offer._id}`)
        .send({ status: 'standby' })
      expect(result).to.have.status(201)
      expect(result).to.be.json
    })
  })
})
