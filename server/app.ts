const express = require('express')
require('express-async-errors')
const app = express()
import { connect as mongooseConnect } from 'mongoose'
const cors = require('cors')
import config from './utils/config'
import logger from './utils/logger'
import middleware from './utils/middleware'
import blogsRouter from './controllers/blogs'
import usersRouter from './controllers/users'
import loginRouter from './controllers/login'
import testRouter from './controllers/testing'

// const options: mongoose.ConnectionOptions = {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }

const connect = async () => {
  const { MONGO_URI } = config;

  logger.info('connecting to', MONGO_URI)

  await mongooseConnect(MONGO_URI)
  logger.info('connected to MongoDB')
}

connect()

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

// if (process.env.NODE_ENV === 'test')
app.use('/api/testing', testRouter)


app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

export default app;
