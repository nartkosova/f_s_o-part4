const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

// const getTokenFrom = request => {
//   const authorization = request.get('authorization')
//   if (authorization && authorization.startsWith('Bearer ')) {
//     return authorization.replace('Bearer ', '')
//   }
//   return null
// }

blogsRouter.get('/', async (request, response) => {
  try {
    const blogs = await Blog
      .find({})
      .populate('user', { username: 1, name: 1, id: 1 });
    response.json(blogs);
  }
  catch (error) {
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
    const user = request.user
    
    if (!user) {
      return response.status(401).json({error: "user not found"})
    }
    // const user = await User.findById(decodedToken.id)
       
    if (!body.title || !body.url) {
      return response.status(400).json({ error: 'Title or URL missing' });
    }

    const blog = new Blog({
      title: body.title,
      author: body.author || 'Unknown',
      url: body.url,
      likes: body.likes || 0,
      user: user.id
    });
    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();
    response.status(201).json(savedBlog);
    
    
  } catch (error) {
    response.status(500).json({ error: 'Failed to save the blog' });
  }
});
blogsRouter.delete('/:id', async (request, response) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET);
    const user = request.user;

    if (!user) {
      return response.status(401).json({ error: 'User not found' })
    }

    const blog = await Blog.findById(request.params.id)

    if (!blog) {
      return response.status(404).json({ error: 'Blog not found' })
    }

    if (blog.user.toString() !== user.id.toString()) {
      return response.status(403).json({ error: 'Unauthorized to delete this blog' })
    }

    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } catch (error) {
    console.error(error)
    response.status(500).json({ error: 'Failed to delete the blog' })
  }
})
blogsRouter.put('/:id', async (request, response) => {
  try {
    const { title, author, url, likes } = request.body;
    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      { title, author, url, likes },
      { new: true, runValidators: true }
    ).populate('user', { username: 1, name: 1, id: 1 })

    if (updatedBlog) {
      response.json(updatedBlog);
    } else {
      response.status(404).json({ error: 'Blog not found' });
    }
  } catch (error) {
    response.status(400).json({ error: 'Bad Request' });
  }
});

module.exports = blogsRouter
