import Blog, { IBlog } from './../models/blog';
import User from '../models/user'
import * as bcrypt from 'bcrypt'

const dummyUser = { username: 'dummy', name: 'Tyhäm Tester', password: 'salasana' }

const blogs = [
  { _id: "5a422a851b54a676234d17f7", title: "React patterns", author: "Michael Chan", url: "https://reactpatterns.com/", likes: 7, __v: 0, user: {}, comments: [] },
  { _id: "5a422aa71b54a676234d17f8", title: "Go To Statement Considered Harmful", author: "Edsger W. Dijkstra", url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html", likes: 5, __v: 0, user: {}, comments: [] },
  { _id: "5a422b3a1b54a676234d17f9", title: "Canonical string reduction", author: "Edsger W. Dijkstra", url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html", likes: 12, __v: 0, user: {}, comments: [] },
  { _id: "5a422b891b54a676234d17fa", title: "First class tests", author: "Robert C. Martin", url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll", likes: 10, __v: 0, user: {}, comments: [] },
  { _id: "5a422ba71b54a676234d17fb", title: "TDD harms architecture", author: "Robert C. Martin", url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html", likes: 0, __v: 0, user: {}, comments: [] },
  { _id: "5a422bc61b54a676234d17fc", title: "Type wars", author: "Robert C. Martin", url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html", likes: 2, __v: 0, user: {}, comments: [] }
]

const testingRouter = require('express').Router()

testingRouter.post('/init-database', async (request, response) => {
  const { username, name, password } = dummyUser
  const passwordHash = await bcrypt.hash(password, 10)

  const dummy = await new User({
    username,
    name,
    passwordHash,
  }).save()

  const _blogs = blogs.map(b => { b.user = dummy.id; return b; })
  await Blog.insertMany(_blogs)
  // @ts-expect-error
  dummy.blogs = _blogs
  await dummy.save()
  response.status(204).end()

})

testingRouter.post('/drop-database', async (request, response) => {
  await Blog.deleteMany({})
  await User.deleteMany({})
  response.status(204).end()
})

export default testingRouter;