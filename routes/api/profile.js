const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

const router = express.Router();

const User = require('../../models/User');
const Profile = require('../../models/Profile');
const validateProfileInput = require('../../validation/profile');

// @route: /api/profile

// Profile page
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
	const errors = {};

	Profile.findOne({ user: req.user.id })
		.populate('user', ['name', 'avatar'])
		.then(profile => {
			if (!profile) {
				errors.noprofile = 'Profile not found.';
				return res.status(404).json(errors);
			}
			res.json(profile);
		})
		.catch(err => res.status(404).json(err));
});

// Get all profiles
router.get('/all', (req, res) => {
	const errors = {};

	Profile.find()
		.populate('user', ['name', 'avatar'])
		.then(profiles => {
			if (!profiles) {
				errors.noprofiles = 'There are no profiles at the moment.';
				return res.status(404).json(errors);
			}
			res.json(profiles);
		})
		.catch(err => res.status(404).json({ profiles: 'There are no profiles at the moment.' }));
});

// Get profile by handle
router.get('/handle/:handle', (req, res) => {
	const errors = {};

	Profile.findOne({ handle: req.params.handle })
		.populate('user', ['name', 'avatar'])
		.then(profile => {
			if (!profile) {
				errors.noprofile = 'Profile not found.';
				return res.status(404).json(errors);
			}
			res.json(profile);
		})
		.catch(err => res.status(404).json({ profile: 'Profile not found.' }));
});

// Get profile by user_id
router.get('/user/:user_id', (req, res) => {
	const errors = {};

	Profile.findOne({ user: req.params.user_id })
		.populate('user', ['name', 'avatar'])
		.then(profile => {
			if (!profile) {
				errors.noprofile = 'Profile not found.';
				return res.status(404).json(errors);
			}
			res.json(profile);
		})
		.catch(err => res.status(404).json({ profile: 'Profile not found.' }));
});

// Create profile
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
	// Validation
	const { errors, isValid } = validateProfileInput(req.body);
	if (!isValid) {
		return res.status(400).json(errors);
	}
	// Get fields
	profileFields = {};
	profileFields.user = req.user.id;
	if (req.body.handle) profileFields.handle = req.body.handle;
	if (req.body.bio) profileFields.bio = req.body.bio;
	if (req.body.date) profileFields.date = req.body.date;

	// Social
	profileFields.social = {};
	if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
	if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
	if (req.body.twitter) profileFields.social.twitter = req.body.twitter;

	// Clubs
	if (typeof req.body.clubs !== 'undefined') {
		profileFields.clubs = req.body.clubs.split(',');
	}

	Profile.findOne({ user: req.user.id })
		.then(profile => {
			if (profile) {
				// Update
				Profile.findOneAndUpdate(
					{ user: req.user.id },
					{ $set: profileFields },
					{ new: true }
				).then(profile => res.json(profile));
			} else {
				// Create
				// Check if handle exists
				Profile.findOne({ handle: profileFields.handle }).then(profile => {
					if (profile) {
						errors.handle = "Handle already exists.";
						res.status(400).json(errors);
					}
					// Save profile if does not exist
					new Profile(profileFields).save().then(profile => res.json(profile));
				});
			}
		})
		.catch();
});

// Delete user and profile
router.delete('/', passport.authenticate('jwt', { session: false }), (req, res) => {
	Profile.findOneAndRemove({ user: req.user.id })
		.then(() => {
			User.findOneAndRemove({ _id: req.user.id })
				.then(() => res.json({ success: true }));
		});
});

module.exports = router;
