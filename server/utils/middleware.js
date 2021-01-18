const logger = require('./logger')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send('unknown endpoint')
}

const errorHandler = (error, request, response, next) => {

  logger.error(error.message)

  if (error.name === 'CastError')
    return response.status(400).json(error)

  if (error.name === 'ValidationError')
    return response.status(400).json(error)

  if (error.name === 'MongoError')
    return response.status(400).json(error)

  if (error.name === 'JsonWebTokenError')
    return response.status(401).json(error)

  if (error.name === 'TestError')
    return response.status(200).json(error)

  if (error.name === 'AuthenticationError')
    return response.status(401).json(error)

  if (error.name === 'LoginError')
    return response.status(401).json(error)

  logger.error(error.message)

  next(error)
}

const tokenExtractor = (request, response, next) => {
  request.token = getTokenFrom(request)
  next()

  function getTokenFrom(request) {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer '))
      return authorization.substring(7)
  }
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor
}