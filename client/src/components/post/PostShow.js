import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import PostItem from './PostItem';
import CommentNew from './CommentNew';
import CommentIndex from './CommentIndex';
import Spinner from '../common/Spinner';
import { showPost } from '../../actions/postActions';

class PostShow extends Component {
	componentDidMount() {
		this.props.showPost(this.props.match.params.id);
	}

	render() {
		const { post, loading } = this.props.post;
		let postContent;

		if (post === null || loading || Object.keys(post).length === 0) {
			postContent = <Spinner />;
		} else {
			postContent = (
				<div>
					<PostItem post={post} showAction={false} />
					<CommentNew postId={post._id} />
					<CommentIndex postId={post._id} comments={post.comments} />
				</div>
			);
		}

		return (
			<div className="post">
				<div className="container">
					<div className="row">
						<div className="col-md-12">
							<Link to="/feed" className="btn btn-light mb-3">
								Back To Feed
							</Link>
							{postContent}
						</div>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	post: state.post
});

PostShow.propTypes = {
	showPost: PropTypes.func.isRequired,
	post: PropTypes.object.isRequired
};

export default connect(
	mapStateToProps,
	{ showPost }
)(PostShow);
