const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({})
    .populate('blogs', { title: 1, author: 1, url: 1, likes: 1 })

  response.json(users.map(u => u.toJSON()))
})

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body;

  if (password.length < 3)
    response.status(400)
      .json({ message: 'Password too short.' })

  const passwordHash = await bcrypt.hash(password, 10)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  response.json(await user.save())
})

module.exports = usersRouter