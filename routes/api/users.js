const express = require('express');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const router = express.Router();

const keys = require('../../config/keys');
const User = require('../../models/User');

// Registration
router.post('/register', (req, res) => {
	User.findOne({ email: req.body.email })
		.then(user => {
			if (user) {
				return res.status(400).json({ email: "Email alerady exists." })
			}
			else {
				const avatar = gravatar.url(req.body.email, {
					s: '200',
					r: 'r',
					d: 'mm'
				});

				const newUser = new User({
					name: req.body.name,
					email: req.body.email,
					password: req.body.password,
					avatar: avatar
				});

				bcrypt.genSalt(10, (err, salt) => {
					bcrypt.hash(newUser.password, salt, (err, hash) => {
						if(err) throw err;
						newUser.password = hash;
						newUser.save()
							.then(user => res.json(user))
							.catch(err => console.log(err));
					})
				})
			}
		})
});

// Login
router.post('/login', (req, res) => {
	const email = req.body.email;
	const password = req.body.password;

	User.findOne({ email })
		.then(user => {
			// Check user
			if (!user) {
				return res.status(400).json({ err: "User or password incorrect." });
			}

			// Check password
			bcrypt.compare(password, user.password)
				.then(isMatch =>{
					if (isMatch) {
						// User matched
						const payload = { id: user.id, name: user.name, avatar: user.avatar }
						// Sign token
						jwt.sign(payload, keys.secret, { expiresIn: 3600 }, (err, token) => {
							res.json({
								success: true,
								token: `Bearer ${token}`
							})
						});
					}
					else {
						return res.status(400).json({ err: "User or password incorrect." })
					}
				})
		});
});

// Current user
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
	res.json({
		id: req.user.id,
		name: req.user.name,
		email: req.user.email
	});
});

module.exports = router;
