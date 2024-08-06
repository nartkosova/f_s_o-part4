import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Footer from './components/Footer'
import blogService from './services/blogs'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [newLikes, setNewLikes] = useState(0)
  const [notification, setNotification] = useState(null)
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    blogService
      .getAll()
      .then(initialBlogs => {
        setBlogs(initialBlogs)
      })
  }, [])

  const addBlog = (event) => {
    event.preventDefault()
    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl,
      likes: newLikes,
    }
  
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setNewTitle('')
        setNewAuthor('')
        setNewUrl('')
        setNewLikes(0)
      })
      .catch(error => {
        setNotification('Failed to add blog')
        setIsError(true);
        setTimeout(() => {
          setNotification(null)
        }, 5000)
      })
  }

  const handleTitleChange = (event) => {
    setNewTitle(event.target.value)
  }

  const handleAuthorChange = (event) => {
    setNewAuthor(event.target.value)
  }

  const handleUrlChange = (event) => {
    setNewUrl(event.target.value)
  }

  const handleLikesChange = (event) => {
    setNewLikes(event.target.value)
  }

  return (
    <div>
      <h1>Blogs</h1>
      <Notification message={notification} isError={isError} />
      <ul>
        {blogs.map(blog => 
          <Blog
            key={blog.id}
            blog={blog}
          />
        )}
      </ul>
      <BlogForm
       addBlog={addBlog}
       newTitle={newTitle}
       handleTitleChange={handleTitleChange}
       newAuthor={newAuthor}
       handleAuthorChange={handleAuthorChange}
       newUrl={newUrl}
       handleUrlChange={handleUrlChange}
       newLikes={newLikes}
       handleLikesChange={handleLikesChange} />
      <Footer />
    </div>
  )
}

export default App
