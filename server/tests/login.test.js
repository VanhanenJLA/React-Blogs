const app = require('../app')
const mongoose = require('mongoose')
const supertest = require('supertest')
const User = require('../models/user')
const api = supertest(app)
const { dummyUser, createUser } = require('./common')

beforeEach(async () => {
  await User.deleteMany({})
  await createUser(dummyUser)
})

describe('POST /login', () => {

  test('login works for dummyUser and returns token', async () => {

    const { username, password } = dummyUser
    const response = await api
      .post('/api/login')
      .send({ username, password })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const token = response.body.token
    expect(token).toBeDefined()

  })

})

afterAll(() => {
  mongoose.connection.close()
})