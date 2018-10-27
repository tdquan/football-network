const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create schema
const PostSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: 'users'
	},
	text: {
		type: String,
		required: true
	},
	name: {
		type: String
	},
	avatar: {
		type: String
	},
	date: {
		type: Date,
		default: Date.now
	},
	votes: [
		{
			user: {
				type: Schema.Types.ObjectId,
				ref: 'users'
			},
			value: {
				type: Number
			}
		}
	],
	comments: [
		{
			user: {
				type: Schema.Types.ObjectId,
				ref: 'users'
			},
			text: {
				type: String,
				required: true
			},
			name: {
				type: String
			},
			avatar: {
				type: String
			},
			votes: [
				{
					user: {
						type: Schema.Types.ObjectId,
						ref: 'users'
					},
					value: {
						type: Number
					}
				}
			],
			date: {
				type: Date,
				default: Date.now
			}
		}
	]
});

module.exports = Post = mongoose.model('post', PostSchema);
