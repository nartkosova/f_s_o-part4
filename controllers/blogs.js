const blogsRouter = require('express').Router()
const blogs = require('../models/blog')

blogsRouter.get('/', (request, response) => {
  blogs.find({}).then(blogs => {
    response.json(blogs)
  })
})
blogsRouter.get('/:id', (request, response, next) => {
  Blog.findById(request.params.id)
    .then(blog => {
      if (blog) {
        response.json(blog)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

module.exports = blogsRouter