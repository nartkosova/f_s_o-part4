const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app') 
const Blog = require('../models/blog') 
const { test, after, beforeEach } = require('node:test')
const assert = require('assert')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({}) 

  const initialBlogs = [
    {
      title: 'Blog 1',
      author: 'Author 1',
      url: 'http://example.com/1',
      likes: 10,
    },
    {
      title: 'Blog 2',
      author: 'Author KA',
      url: 'http://example.com/2',
      likes: 20,
    },
  ]

  await Blog.insertMany(initialBlogs)
})

test('blogs are returned as JSON and correct amount of blogs is returned', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  console.log(JSON.stringify(response.body, null, 2))

  assert.strictEqual(response.body.length, 2)
})

test('blog posts have an id property, not _id', async () => {
    const response = await api.get('/api/blogs')
  
    const blogs = response.body
    blogs.forEach(blog => {
      assert.ok(blog.id)           
      assert.strictEqual(blog._id, undefined) 
      console.log('Blog Posts:', JSON.stringify(blogs, null, 2))
    })
  })

after(async () => {
  await mongoose.connection.close() 
})
