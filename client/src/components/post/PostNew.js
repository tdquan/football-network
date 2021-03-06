import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import TextAreaGroup from '../common/TextAreaGroup';
import { addPost } from '../../actions/postActions';

class PostNew extends Component {
	constructor(props) {
		super(props);
		this.state = {
			text: '',
			errors: {}
		};

		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	onChange(event) {
		this.setState({ [event.target.name]: event.target.value });
	}

	onSubmit(event) {
		event.preventDefault();

		const { user } = this.props.auth;

		const newPost = {
			text: this.state.text,
			name: user.name,
			avatar: user.avatar
		};

		this.props.addPost(newPost);
		this.setState({ text: '' });
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.errors) {
			this.setState({ errors: nextProps.errors });
		}
	}

	render() {
		const { errors } = this.state;

		return (
			<div className="post-form mb-3">
				<div className="card card-info">
					<div className="card-header bg-info text-white">Say something...</div>
					<div className="card-body">
						<form onSubmit={this.onSubmit}>
							<div className="form-body">
								<TextAreaGroup
									placeholder="Create a post"
									name="text"
									value={this.state.text}
									onChange={this.onChange}
									error={errors.text}
								/>
							</div>
							<button className="btn btn-dark">Submit</button>
						</form>
					</div>
				</div>
			</div>
		);
	}
}

PostNew.propTypes = {
	addPost: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	auth: state.auth,
	errors: state.errors
});

export default connect(
	mapStateToProps,
	{ addPost }
	// Implement map dispatch to props
)(PostNew);
