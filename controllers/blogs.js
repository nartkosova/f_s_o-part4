const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  try {
    const blogs = await Blog.find({})
    response.json(blogs)
  } catch (error) {
    response.status(500).json({ error: 'Something went wrong' })
  }
})

blogsRouter.get('/:id', async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id)
    if (blog) {
      response.json(blog)
    } else {
      response.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})
blogsRouter.post('/', async (request, response) => {
  try {
    const body = request.body;
    
    if (!body.title || !body.url) {
      return response.status(400).json({ error: 'Title or URL missing' });
    }

    const blog = new Blog({
      title: body.title,
      author: body.author || 'Unknown',
      url: body.url,
      likes: body.likes || 0,
    });

    const savedBlog = await blog.save();
    response.status(201).json(savedBlog);
  } catch (error) {
    response.status(500).json({ error: 'Failed to save the blog' });
  }
});
blogsRouter.delete('/:id', async (request, response) => {
  try {
    const result = await Blog.findByIdAndDelete(request.params.id);

    if (result) {
      response.status(204).end();  // 204 No Content
    } else {
      response.status(404).json({ error: 'Blog not found' });
    }
  } catch (error) {
    response.status(500).json({ error: 'Failed to delete the blog' });
  }
});


module.exports = blogsRouter
