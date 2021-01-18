
const app = require('../app')
const mongoose = require('mongoose')
const supertest = require('supertest')
const User = require('../models/user')
const api = supertest(app)
const { dummyUser, usersInDb, createUser } = require('./common')


beforeAll(async () => {
  await User.deleteMany({})
})

describe('/POST users', () => {

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await usersInDb()
    const freshUsername = 'fresh'
    await api
      .post('/api/users')
      .send({ ...dummyUser, username: freshUsername })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(freshUsername)

  })

  test('invalid user returns code 400 and an appropriate message', async () => {

    const invalidUser = { dummyUser, password: 'xx' }
    let response = await api
      .post('/api/users')
      .send(invalidUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    let error = response.body
    expect(error.message).toContain('Password too short')

    response = await api
      .post('/api/users')
      .send({ username: '', name: '', password: 'salasana' })
      .expect(400)
      .expect('Content-Type', /application\/json/)

    error = response.body
    expect(error.message).toContain('`username` is required')
    expect(error.message).toContain('`name` is required')

  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await usersInDb()

    const u = usersAtStart[0]
    const existingUser = { username: u.username, name: u.name, password: 'salasana' }
    const response = await api
      .post('/api/users')
      .send(existingUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const error = response.body
    expect(error.message).toContain('`username` to be unique')

    const usersAtEnd = await usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })


})

afterAll(async () => {
  User.deleteMany({})
  await mongoose.connection.close()
})