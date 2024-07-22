import React from 'react'

const BlogForm = ({ addBlog, newTitle, handleTitleChange, newAuthor, handleAuthorChange, 
    newUrl, handleUrlChange, newLikes, handleLikesChange}) => {
return (
<form onSubmit={addBlog}>
<div>
  Title:
  <input
    value={newTitle}
    onChange={handleTitleChange}
  />
</div>
<div>
  Author:
  <input
    value={newAuthor}
    onChange={handleAuthorChange}
  />
</div>
<div>
  URL:
  <input
    value={newUrl}
    onChange={handleUrlChange}
  />
</div>
<div>
  Likes:
  <input
    type="number"
    value={newLikes}
    onChange={handleLikesChange}
  />
</div>
<button type="submit">save</button>
</form>
)
}
export default BlogForm