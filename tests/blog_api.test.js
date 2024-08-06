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
      author: 'Author KI',
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
  test('a new blog post is successfully created', async () => {
    const newBlog = {
      title: 'New Blog',
      author: 'New Author',
      url: 'http://example.com/new',
      likes: 5,
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  
    const blogsAtEnd = await Blog.find({})
    assert.strictEqual(blogsAtEnd.length, 3)  
  
    const titles = blogsAtEnd.map(blog => blog.title)
    assert.ok(titles.includes('New Blog'))
    console.log('Blogs after POST request:', JSON.stringify(blogsAtEnd, null, 2))
  })
  test('likes default to 0 if not provided', async () => {
    const newBlog = {
      title: 'Blog with no likes',
      author: 'Unknown Author',
      url: 'http://example.com/no-likes',
    };
  
    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);
  
    const createdBlog = response.body;
  
    console.log('Created blog:', createdBlog);
  
    assert.strictEqual(createdBlog.likes, 0);
  });
  test('responds with 400 if title is missing', async () => {
    const newBlog = {
      author: 'Author without title',
      url: 'http://example.com/missin-title',
      likes: 5,
    };
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/);
  });
  
  test('responds with 400 if url is missing', async () => {
    const newBlog = {
      title: 'Blog without URL',
      author: 'Author without URL',
      likes: 5,
    };
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/);
  });
  
after(async () => {
  await mongoose.connection.close() 
})
