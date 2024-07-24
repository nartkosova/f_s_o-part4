const dummy = (blogs) => {
    return 1
  }
  
  const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
  }
  
  const favoriteBlog = (blogs) => {
    if (blogs.length === 0) return {};

    const mostLikedBlog = blogs.reduce((max, blog) => {
      return blog.likes > max.likes ? blog : max;
    });

    return {
      title: mostLikedBlog.title,
      author: mostLikedBlog.author,
      likes: mostLikedBlog.likes
    };
  };
  const mostBlogs = (blogs) => {
    const authorBlogCount = blogs.reduce((counts, blog) => {
      counts[blog.author] = (counts[blog.author] || 0) + 1;
      return counts;
    }, {});
  
    const topAuthor = Object.entries(authorBlogCount).reduce((max, [author, count]) => {
      return count > max.blogs ? { author, blogs: count } : max;
    }, { author: '', blogs: 0 });
  
    return topAuthor;
  };
  
  
  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs
  }
  
  