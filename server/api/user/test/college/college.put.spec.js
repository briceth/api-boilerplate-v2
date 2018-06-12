const chai = require('chai')
const expect = require('chai').expect
const chaiHttp = require('chai-http')
const uid2 = require('uid2')
const faker = require('faker')
const server = require('../../../../../index')
const User = require('../../model')
const usersSpec = require('../users.utils')
const log = console.log

chai.use(chaiHttp)

describe.only("PUT COLLEGE", () => {
  let college

  beforeEach(async () => {
    await User.remove({})

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
  })

  afterEach(async () => {
    await User.remove({})
  })

  it('should update a college', async () => {
    const result = await chai
      .request(server)
      .put(`/api/users/${college._id}`)
      .set('Authorization', `Bearer ${college.token}`)
      .send({
        email: faker.internet.email(),
        account: {
          address: "5 passage Mont-fermeil",
          city: "Magny les Hameaux",
          college_name: "college lereacteur",
          phone: "0145879065"
        }
      })

    expect(result).to.have.status(201)
    expect(result).to.be.json
    expect(result.body).to.be.an('object')
    usersSpec(result.body)
    expect(result.body.account.college_name).to.equal("college lereacteur")
    expect(result.body.account.address).to.equal("5 passage Mont-fermeil")
    expect(result.body.account.city).to.equal("Magny les Hameaux")
    expect(result.body.account.phone).to.equal("0145879065")

    // expect(result).to.have.status(201)
    // expect(result).to.be.json
    // expect(result.body).to.include.all.keys(
    //   'emailCheck',
    //   'passwordChange',
    //   'account',
    //   '_id',
    //   'email'
    // )

    // expect(result.body.account).to.include.all.keys(
    //   'address',
    //   'city',
    //   'phone',
    //   'college_name'
    // )
  })
})