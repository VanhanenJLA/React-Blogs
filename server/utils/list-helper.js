
const totalLikes = (blogs) => {
  return blogs.reduce((acc, cur) => acc + cur.likes, 0)
}

const mostBlogs = (blogs) => {
  let bloggers = new Map();
  blogs.forEach(b => {
    let v = bloggers.get(b.author)
    v ? v += 1 : v = 1;
    bloggers.set(b.author, v)
  });

  const kovin = Array.from(bloggers.keys()).reduce((a, c) => {
    return bloggers.get(c) > bloggers.get(a) ? c : a
  })

  return {
    author: kovin,
    blogs: bloggers.get(kovin)
  }

}

const mostLikes = (blogs) => {
  let bloggers = new Map();
  blogs.forEach(b => {
    let v = bloggers.get(b.author)
    v ? v += b.likes : v = b.likes;
    bloggers.set(b.author, v)
  });

  const kovin = Array.from(bloggers.keys()).reduce((a, c) => {
    return bloggers.get(c) > bloggers.get(a) ? c : a
  })

  return {
    author: kovin,
    likes: bloggers.get(kovin)
  }

}

// const mostLiked = (blogs) => {
//   return blogs.reduce((a, c) =>
//     c.likes > a.likes ? c : a
//   )
// }

module.exports = {
  totalLikes, mostLikes, mostBlogs
}
