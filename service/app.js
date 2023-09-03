const express = require('express');
const app = express()
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

const db = fs.readFileSync(path.resolve(__dirname, 'db.json'));
const data = JSON.parse(db);

// Social Media App
app.get('/api', (req, res) => {
    return res.status(200).json({ data: 'Social Media App' })
});

// Posts
app.get('/api/posts', (req, res) => {
    return res.status(200).json({ data: data.posts});
});
// New post
app.post('/api/posts', async (req, res) => {
    const id = Math.floor(Math.random() * 100000);
    const { usernamepost } = req.body;
    const { image } = req.body;
    const { description } = req.body;

    if (!usernamepost ) {
        return res.status(400).json({ error: 'username is required' });
    }

    data.posts.push({ id, usernamepost , image, description });
    await fs.writeFileSync(path.resolve(__dirname, 'db.json'), JSON.stringify(data));
    return res.status(200).json({ data: data.posts });
});
// Delete post 
app.delete('/api/posts/:id', (req, res) => {
  const postId = parseInt(req.params.id);
  const index = data.posts.findIndex(post => post.id === postId);

  if (index !== -1) {
    data.posts.splice(index, 1);
    return res.status(204).send();
  } else {
    return res.status(404).json({ error: `Post with ID ${postId} not found` });
  }
});
// Update post
app.put('/api/posts/:id', async (req, res) => {
    const postId = parseInt(req.params.id);
    const updatedPost = req.body; 
    const postIndex = data.posts.findIndex((post) => post.id === postId);
  
    if (postIndex === -1) {
      return res.status(404).json({ error: `Post with ID ${postId} not found` });
    }
  
    data.posts[postIndex] = { ...data.posts[postIndex], ...updatedPost };
  
    await fs.writeFileSync(path.resolve(__dirname, 'db.json'), JSON.stringify(data));
  
    return res.status(200).json({ message: 'Post updated successfully', post: data.posts[postIndex] });
});

app.post('/api/posts/:id/comments', (req, res) => {
    const postId = parseInt(req.params.id);
    const { usernamecomment, commentText } = req.body;
  
    const post = data.posts.find((post) => post.id === postId);
  
    if (!post) {
      return res.status(404).json({ error: `Post with ID ${postId} not found` });
    }
  
    const newComment = {
      id: generateCommentId(), 
      usernamecomment,
      commentText,
    };
  
    post.comments.push(newComment);  
    res.status(201).json(newComment);
  });
  

// comments 
app.get('/api/posts/:id/comments', (req, res) => {
    const postId = parseInt(req.params.id);
    const post = data.posts.find((post) => post.id === postId);

    if (!post) {
        return res.status(404).json({ error: 'Post not found' });
    }

    return res.status(200).json({ comments: post.comments });
});

// Create  new comment 
app.post('/api/posts/:id/comments', async (req, res) => {
    const postId = parseInt(req.params.id);
    const post = data.posts.find((post) => post.id === postId);

    if (!post) {
        return res.status(404).json({ error: 'Post not found' });
    }

    const { commentText: comment } = req.body;

    if (!comment) {
        return res.status(400).json({ error: 'Comment text is required' });
    }

    const newComment = {
        id: generateUniqueId(), // Generate a unique ID for the comment
        usernamecomment: 'SomeUser', // You can set the username of the commenter here
        commentText: comment,
    };

    post.comments.push(newComment);

    await fs.writeFileSync(path.resolve(__dirname, 'db.json'), JSON.stringify(data));

    return res.status(200).json(newComment);
});

// 404 page not found
app.use('*', (req, res) => {
    return res.status(404).json({
        message: 'Page not found'
    })
});

//start 
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
