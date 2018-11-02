const express = require('express');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const router = express.Router();

const keys = require('../../config/keys');
const User = require('../../models/User');
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

// @route: /api/users

// Registration
router.post('/register', (req, res) => {
	const { errors, isValid } = validateRegisterInput(req.body);
	// Check validation
	if (!isValid) {
		return res.status(400).json(errors);
	}

	User.findOne({ email: req.body.email })
		.then(user => {
			if (user) {
				errors.email = "Email already exists.";
				return res.status(400).json(errors);
			} else {
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
						if (err) throw err;
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
	const { errors, isValid } = validateLoginInput(req.body);
	// Check validation
	if (!isValid) {
		return res.status(400).json(errors);
	}

	const email = req.body.email;
	const password = req.body.password;

	User.findOne({ email })
		.then(user => {
			// Check user
			if (!user) {
				errors.err = "User or password incorrect.";
				return res.status(400).json(errors);
			}

			// Check password
			bcrypt.compare(password, user.password)
				.then(isMatch => {
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
					} else {
						errors.err = "User or password incorrect.";
						return res.status(400).json(errors);
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