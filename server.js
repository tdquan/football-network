const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

const app = express();

// Body Parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const PORT = process.env.PORT || 8080;
const db = require('./config/keys').mongoURI;

mongoose
	.connect(
		db,
		{ useNewUrlParser: true }
	)
	.then(() => console.log('\n\x1b[32m%s\n\x1b[0m', '---- *** Connected to MongoDB. *** ----'))
	.catch(err => console.log('\n\x1b[31m%s\n\x1b[0m', err));

// Passport middleware
app.use(passport.initialize());

// Passport config
require('./config/passport')(passport);

app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

// Server static assets in production
if (process.env.NODE_ENV === 'production') {
	app.use(express.static('client/build'));

	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
	});
}

app.listen(PORT, () =>
	console.log('\n\x1b[32m%s\n\x1b[0m', `---- *** Server running on port ${PORT}... *** ----`)
);
