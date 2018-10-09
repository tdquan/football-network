const express = require('express');
const mongoose = require('mongoose');

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

const app = express();
const PORT = process.env.PORT || 3000;
const db = require('./config/keys').mongoURI;

mongoose
	.connect(db)
	.then(() => console.log('Connected to MongoDB.'))
	.catch(err => console.log(err));

app.get('/', (req, res) => res.send('Hello World!'));
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

app.listen(PORT, () => console.log(`Server running on port ${PORT}...`));
