import React from 'react'

const Blog = ({ blog }) => {
  return (
    <li>
      {blog.title} by {blog.author} (URL: <a href={blog.url}>{blog.url}</a>, Likes: {blog.likes})
    </li>
  )
}

export default Blog
