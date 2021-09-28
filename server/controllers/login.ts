import * as jwt from 'jsonwebtoken'
import * as bcrypt from 'bcrypt'
import User from '../models/user'
import config from '../utils/config'

const loginRouter = require('express').Router()

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body;

  const user = await User.findOne({ username: username })

  if (!user)
    throw {
      name: 'LoginError',
      message: `No username: ${username} found.`
    }

  const isCorrectPassword = await bcrypt.compare(password, user.passwordHash)
  if (!isCorrectPassword)
    throw {
      name: 'LoginError',
      message: 'Password incorrect.'
    }

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  const token = jwt.sign(userForToken, config.SECRET)

  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

export default loginRouter;