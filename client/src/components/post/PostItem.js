import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import classnames from 'classnames';

import { deletePost, upvotePost, downvotePost } from '../../actions/postActions';

class PostItem extends Component {
	onDeleteClick(id) {
		this.props.deletePost(id);
	}

	onUpvoteClick(id) {
		this.props.upvotePost(id);
	}

	onDownvoteClick(id) {
		this.props.downvotePost(id);
	}

	findIfUserUpvoted(votes) {
		const { auth } = this.props;

		if (votes.filter(vote => vote.user === auth.user.id && vote.value > 0).length > 0) {
			return true;
		}
		return false;
	}

	findIfUserDownvoted(votes) {
		const { auth } = this.props;

		if (votes.filter(vote => vote.user === auth.user.id && vote.value < 0).length > 0) {
			return true;
		}
		return false;
	}

	render() {
		const { post, auth, showAction } = this.props;

		return (
			<div className="card card-body mb-3">
				<div className="row">
					<div className="col-md-2">
						<Link to={`/users/${post.user}`}>
							<img src={post.avatar} alt="avatar" className="rounded-circle d-none d-md-block" />
						</Link>
						<br />
						<p className="text-center">{post.name}</p>
					</div>
					<div className="col-md-10">
						<p className="lead">{post.text}</p>
						{showAction ? (
							<span>
								<button
									onClick={this.onUpvoteClick.bind(this, post._id)}
									className="btn btn-light mr-1"
								>
									<i
										className={classnames('fas fa-thumbs-up mr-1', {
											'text-success': this.findIfUserUpvoted(post.votes)
										})}
									/>
									<span className="badge badge-light">
										{post.votes.filter(vote => vote.value > 0).length}
									</span>
								</button>
								<button
									onClick={this.onDownvoteClick.bind(this, post._id)}
									className="btn btn-light mr-1"
								>
									<i
										className={classnames('fas fa-thumbs-down mr-1', {
											'text-danger': this.findIfUserDownvoted(post.votes)
										})}
									/>
									<span className="badge badge-light">
										{post.votes.filter(vote => vote.value < 0).length}
									</span>
								</button>
								<Link to={`/posts/${post._id}`} className="btn btn-info mr-1">
									Comments
								</Link>
								{post.user === auth.user.id ? (
									<button
										onClick={this.onDeleteClick.bind(this, post._id)}
										className="btn btn-danger mr-1"
									>
										<i className="fas fa-times" />
									</button>
								) : null}
							</span>
						) : null}
					</div>
				</div>
			</div>
		);
	}
}

PostItem.defaultProps = {
	showAction: true
};

PostItem.propTypes = {
	post: PropTypes.object.isRequired,
	auth: PropTypes.object.isRequired,
	deletePost: PropTypes.func.isRequired,
	upvotePost: PropTypes.func.isRequired,
	downvotePost: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	auth: state.auth
});

export default connect(
	mapStateToProps,
	{ deletePost, upvotePost, downvotePost }
)(PostItem);
