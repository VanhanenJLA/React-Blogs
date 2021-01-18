
const router = require('express').Router()
const Blog = require('./../models/blog')
const User = require('./../models/user')
const jwt = require('jsonwebtoken')

const isAuthenticated = request => {
  if (!request.token)
    throw { name: 'AuthenticationError', message: 'Token missing.' }

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id)
    throw { name: 'AuthenticationError', message: 'Invalid token.' }

  return decodedToken
}

router.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })
  response.status(200).json(blogs.map(b => b.toJSON()))
})

router.post('/', async (request, response) => {

  const decodedToken = isAuthenticated(request)

  const user = await User.findById(decodedToken.id)

  const blog = new Blog(request.body)
  blog.user = user
  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

router.delete('/:id', async (request, response) => {

  const decodedToken = isAuthenticated(request)

  const user = await User.findById(decodedToken.id)
  const blog = await Blog.findById(request.params.id)

  if (user.id.toString() !== blog.user.toString())
    return response.status(401)
      .json({ error: 'Removing blogs created by others is not permitted.' })

  await blog.remove()
  user.blogs = user.blogs.filter(blog =>
    blog.id.toString() !== request.params.id.toString())

  await user.save()

  response.status(204).send()
})

router.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
    .populate('user')

  response.status(200).json(blog)
})

router.put('/:id', async (request, response) => {
  const id = request.params.id
  const blog = request.body

  blog.user = blog.user.id
  const options = { new: true, runValidators: true, context: 'query' }
  const updatedBlog =
    await Blog.findByIdAndUpdate(id, blog, options)
      .populate('user', { username: 1, name: 1 })

  response.status(200).json(updatedBlog)
})

router.post('/:id/comments', async (request, response) => {
  const comment = request.body.comment
  const commentedBlog = await Blog
    .findById(request.params.id)
    .populate('user', { username: 1, name: 1 })

  commentedBlog.comments = commentedBlog.comments.concat(comment)
  await commentedBlog.save()

  response.status(200).json(commentedBlog)
})

module.exports = router