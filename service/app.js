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

// Comments
app.get('/api/comments', (req, res) => {
    return res.status(200).json({ data: data.comments });
});

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