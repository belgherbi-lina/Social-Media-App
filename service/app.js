const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());
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

// Comments
app.get('/api/comments', (req, res) => {
    const postId = parseInt(req.params.id);

    const post = data.posts.find((post) => post.id === postId);
    if (!post) {
        return res.status(404).json({ error: 'Post not found' });
    }

    return res.status(200).json({ data: data.comments });
});
//New comments
app.post('/api/comments', async (req, res) => {
    const id = Math.floor(Math.random() * 100000);
    const { usernamecomment } = req.body;
    const { comment } = req.body;

    if (!comment) {
        return res.status(400).json({ error: 'comment is required' });
    }

    data.comments.push({ id, usernamecomment , comment });
    await fs.writeFileSync(path.resolve(__dirname, 'db.json'), JSON.stringify(data));
    return res.status(200).json({ data: data.comments });
});
// Delete comment 
app.delete('/api/comments/:id', (req, res) => {
    const commentId = parseInt(req.params.id);
    const index = data.comments.findIndex(comment => comment.id === commentId);
  
    if (index !== -1) {
        data.comments.splice(index, 1);
        res.status(204).send();
    } else {
        res.status(404).json({ error: `Post with ID ${commentId} not found` });
    }
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