const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const validatePostInput = require('../../validation/post');

router.get('/test', (req, res) => res.json({ msg: "Posts works!" }));

// Create a post
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
	// Validation
	const { errors, isValid } = validatePostInput(req.body);
	if (!isValid) {
		return res.status(400).json(errors);
	}

	// Create new post
	const newPost = new Post({
		text: req.body.text,
		name: req.body.name,
		avatar: req.body.avatar,
		user: req.user.id
	});

	newPost.save().then(post => res.json(post));
});

// Get all posts
router.get('/', (req, res) => {
	Post.find()
		.sort({ date: -1 })
		.then(posts => res.json(posts))
		.catch(err => res.status(404).json({ noposts: "No posts found." }));
});

// Get one post
router.get('/:id', (req, res) => {
	Post.findById(req.params.id)
		.then(post => res.json(post))
		.catch(err => res.status(404).json({ nopost: "No post found with that id." }));
});

// Delete post
router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
	Profile.findOne({ user: req.user.id })
		.then(profile => {
			Post.findById(req.params.id)
				.then(post => {
					if (post.user.toString() !== req.user.id) {
						return res.status(401).json({ notauthorized: "You are not authorized to delete this post." })
					}
					post.remove().then(() => res.json({ success: true }));
				})
				.catch(err => res.status(404).json({ nopost: "No post found with that id." }));
		});
});


// Upvote
router.post('/upvote/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
	Profile.findOne({ user: req.user.id })
		.then(profile => {
			Post.findById(req.params.id)
				.then(post => {
					if (post.votes.filter(vote => vote.user.toString() === req.user.id).length > 0) {
						const removeIndex = post.votes
							.map(vote => vote.user.toString())
							.indexOf(req.user.id);
						post.votes.splice(removeIndex, 1);
						post.save().then(post => res.json(post));
					} else {
						post.votes.unshift({ user: req.user.id, value: 1 });
						post.save().then(post => res.json(post));
					}
				})
				.catch(err => res.status(404).json({ nopost: "No post found with that id." }));
		});
});

// Upvote
router.post('/downvote/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
	Profile.findOne({ user: req.user.id })
		.then(profile => {
			Post.findById(req.params.id)
				.then(post => {
					if (post.votes.filter(vote => vote.user.toString() === req.user.id).length > 0) {
						const removeIndex = post.votes
							.map(vote => vote.user.toString())
							.indexOf(req.user.id);
						post.votes.splice(removeIndex, 1);
						post.save().then(post => res.json(post));
					} else {
						post.votes.unshift({ user: req.user.id, value: -1 });
						post.save().then(post => res.json(post));
					}
				})
				.catch(err => res.status(404).json({ nopost: "No post found with that id." }));
		});
});

// Add a comment to a post
router.post('/comment/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
	// Validation
	const { errors, isValid } = validatePostInput(req.body);
	if (!isValid) {
		return res.status(400).json(errors);
	}

	Post.findById(req.params.id)
		.then(post => {
			const newComment = {
				text: req.body.text,
				name: req.body.name,
				avatar: req.body.avatar,
				user: req.user.id
			}

			// Add comment to array
			post.comments.unshift(newComment);
			post.save().then(post => res.json(post));
		})
		.catch(err => res.status(404).json({ nopost: 'No post found with that id.' }));
});

// Delete a comment of a post
router.delete('/comment/:id/:comment_id', passport.authenticate('jwt', { session: false }), (req, res) => {
	Post.findById(req.params.id)
		.then(post => {
			if (post.comments.filter(comment => comment._id.toString() === req.params.comment_id).length === 0) {
				return res.status(404).json({ commentnotfound: 'Cannot find comment.' });
			}

			// Get removeIndex
			const removeIndex = post.comments
				.map(comment => comment._id.toString())
				.indexOf(req.params.comment_id);

			// Remove from the comments array
			post.comments.splice(removeIndex, 1);
			post.save().then(post => res.json(post));
		})
		.catch(err => res.status(404).json({ nopost: 'No post found with that id.' }));
});

module.exports = router;