const chai = require('chai')
const expect = require('chai').expect
const chaiHttp = require('chai-http')
const faker = require('faker')
const server = require('../../../../index')
const User = require('../model')
const log = console.log
//const factory = require('../../../utils/modelFactory')
//const { deleteDB } = require('../../../utils/helpers')
chai.use(chaiHttp)

describe('PUT /users/:id', () => {
  let student
  let college

  beforeEach(async () => {
    await User.remove({})

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

  it('should update a student', async () => {
    const result = await chai
      .request(server)
      .put(`/api/users/${student._id}`)
      //.set('Authorization', `Bearer ${jwt}`)
      .send({
        email: faker.internet.email(),
        account: {
          first_name: faker.name.firstName(),
          last_name: faker.name.lastName(),
          picture: faker.image.imageUrl(),
          address: faker.address.streetAddress()
        }
      })

    expect(result).to.have.status(201)
    expect(result).to.be.json
    expect(result.body).to.include.all.keys(
      'emailCheck',
      'passwordChange',
      'account',
      '_id',
      'email'
    )

    expect(result.body.account).to.include.all.keys(
      'first_name',
      'last_name',
      'picture',
      'address'
    )
  })

  it('should update a college', async () => {
    const result = await chai
      .request(server)
      .put(`/api/users/${college._id}`)
      //.set('Authorization', `Bearer ${jwt}`)
      .send({
        email: faker.internet.email(),
        account: {
          address: faker.address.streetAddress(),
          city: faker.address.city(),
          college_name: faker.name.findName(),
          phone: faker.phone.phoneNumber()
        }
      })

    expect(result).to.have.status(201)
    expect(result).to.be.json
    expect(result.body).to.include.all.keys(
      'emailCheck',
      'passwordChange',
      'account',
      '_id',
      'email'
    )

    expect(result.body.account).to.include.all.keys(
      'address',
      'city',
      'phone',
      'college_name'
    )
  })
})
