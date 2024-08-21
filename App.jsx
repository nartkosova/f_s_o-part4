import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import BlogForm from './components/blogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)
  const [isError, setIsError] = useState(false)
  const [notification, setNotification] = useState(null);
  const [blogVisible, setBlogVisible] = useState(false)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])
   useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])
  useEffect(() => {
    blogService.getAll().then(blogs => setBlogs(blogs))
  }, [])
  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      ) 
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setNotification('wrong username or password')
      setIsError(true)
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }
  const handleLogout = async (event) => {
    event.preventDefault()
      window.localStorage.removeItem('loggedBlogappUser')
      blogService.setToken(null)
      setUser(null)
      setUsername('')
      setPassword('')
    }   
    const createBlog = async (blogObject) => {
      try {
        const returnedBlog = await blogService.create(blogObject)
        setBlogs(blogs.concat(returnedBlog))
        setNotification(`A new blog '${returnedBlog.title}' by ${returnedBlog.author} has been added`)
        setIsError(false)
        setTimeout(() => {
          setNotification(null)
        }, 5000)
      } catch (error) {
        setNotification('Failed to add blog')
        setIsError(true)
        setTimeout(() => {
          setNotification(null)
        }, 5000)
      }
    }
    const updateBlog = (updatedBlog) => {
      setBlogs(blogs.map(blog => (blog.id !== updatedBlog.id ? blog : updatedBlog)))
    }
    const handleDelete = (id) => {
      if (window.confirm(`are you sure you want to delete ${returnedBlog.title} by ${returnedBlog.author}`)){
      blogService.remove(id).then(() => {
        setBlogs(blogs.filter(blog => blog.id !== id))
        setNotification('blog deleted successfully')
        setIsError(false)
        setTimeout(() => setNotification(null), 5000)
      }).catch(error => {
        console.error('failed to delete the blog:', error)
        setNotification('failed to delete the blog')
        setIsError(true)
        setTimeout(() => setNotification(null), 5000)
      })
    }
    }
    const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes)
     const blogForm = () => {
    const hideWhenVisible = { display: blogVisible ? 'none' : '' }
    const showWhenVisible = { display: blogVisible ? '' : 'none' }
    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setBlogVisible(true)}>new blog</button>
        </div>
        <div style={showWhenVisible}>
        <BlogForm createBlog={createBlog}/>
          <button onClick={() => setBlogVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }
  if (user === null) {
    return (
      <div>
        <Notification message={notification} isError={isError} />
        <h2>Log in to application</h2>
        <form onSubmit={handleLogin}>
        <div>
        username
          <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
          <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
        </form>
      </div>
    )
  }   
  
  return (
    <div>
      <Notification message={notification} isError={isError} />
      <h2>blogs</h2>
      <p>{user.name} is logged in <button onClick={handleLogout}>logout</button></p>
      {blogForm()}
      {sortedBlogs.map(blog =>
      <Blog key={blog.id} blog={blog} updateBlog={updateBlog} handleDelete={handleDelete} />
      )}
    </div>
  )
}

export default App