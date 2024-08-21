const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app') 
const { test, describe, after, beforeEach } = require('node:test')
const assert = require('assert')
const bcrypt = require('bcryptjs')
const User = require('../models/user')
const helper = require('./test_helper')
const api = supertest(app)

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })
    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'nartush',
      name: 'Nart Kosova',
      password: '123123',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })
})

describe('when creating a new user', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })
    await user.save()
  })

  test('creation fails with status 400 and message if username is less than 3 characters', async () => {
    const newUser = {
      username: 'ab',
      name: 'Short Username',
      password: '123456',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert(result.body.error.includes('Username and password must be at least 3 characters long'))

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, 1)
  })

  test('creation fails with status 400 and message if password is less than 3 characters', async () => {
    const newUser = {
      username: 'validUsername',
      name: 'Short Password',
      password: '1234',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert(result.body.error.includes('Username and password must be at least 3 characters long'))

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, 1)
  })

  test('creation fails with status 400 and message if username is not unique', async () => {
    const newUser = {
      username: 'root1',
      name: 'Superuser1',
      password: '123456',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert(result.body.error.includes('Username must be unique'))

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, 1)
  })
})

after(async () => {
  await mongoose.connection.close()
})
