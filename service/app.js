const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3000;

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
    return res.status(200).json({ data: data.posts });
});

app.post('/api/posts', async (req, res) => {
    const id = Math.floor(Math.random() * 100000);
    const { post } = req.body;

    if (!post) {
        return res.status(400).json({ error: 'post is required' });
    }

    data.posts.push({ id, post });
    await fs.writeFileSync(path.resolve(__dirname, 'db.json'), JSON.stringify(data));
    return res.status(200).json({ data: data.posts });
});

// Comments
app.get('/api/comments', (req, res) => {
    return res.status(200).json({ data: data.comments });
});

app.post('/api/comments', async (req, res) => {
    const id = Math.floor(Math.random() * 100000);
    const { comment } = req.body;

    if (!comment) {
        return res.status(400).json({ error: 'comment is required' });
    }

    data.comments.push({ id, comment });
    await fs.writeFileSync(path.resolve(__dirname, 'db.json'), JSON.stringify(data));
    return res.status(200).json({ data: data.comments });
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