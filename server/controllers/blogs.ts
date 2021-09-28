
const router = require('express').Router()
import Blog from './../models/blog'
import User from './../models/user'
import * as jwt from 'jsonwebtoken'
import config from '../utils/config'

const isAuthenticated = request => {
  if (!request.token)
    throw { name: 'AuthenticationError', message: 'Token missing.' }

  const decodedToken = jwt.verify(request.token, config.SECRET) as jwt.JwtPayload

  if (!decodedToken.id)
    throw { name: 'AuthenticationError', message: 'Invalid token.' }

  return decodedToken
}

router.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })
  return response.status(200).json(blogs.map(b => b.toJSON()))
})

router.post('/', async (request, response) => {

  const decodedToken = isAuthenticated(request)

  const user = await User.findById(decodedToken.id)
  if (!user)
    return response.status(404).json("User not found.")

  const blog = new Blog(request.body)
  blog.user = user
  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  return response.status(201).json(savedBlog)
})

router.delete('/:id', async (request, response) => {

  const decodedToken = isAuthenticated(request)

  const user = await User.findById(decodedToken.id)
  if (!user)
    return response.status(404).json("User not found.")

  const blog = await Blog.findById(request.params.id)
  if (!blog)
    return response.status(404).json("Blog not found.")

  if (user?.id.toString() !== blog?.user.toString())
    return response.status(401).json({ error: 'Removing blogs created by others is not permitted.' })

  await blog.remove()
  user.blogs = user.blogs.filter(blog => blog.id.toString() !== request.params.id.toString())

  await user.save()

  return response.status(204).send()
})

router.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
    .populate('user')

  return response.status(200).json(blog)
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

  if (!commentedBlog)
    return response.status(200).json("Blog does not exist.")

  commentedBlog.comments = commentedBlog.comments.concat(comment)
  await commentedBlog.save()

  return response.status(200).json(commentedBlog)
})

export default router;