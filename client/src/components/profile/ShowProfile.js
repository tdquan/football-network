import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import Spinner from '../common/Spinner';
import { getProfileByHandle } from '../../actions/profileActions';
import isEmpty from '../../validation/is-empty';

class ShowProfile extends Component {
	componentDidMount() {
		if (this.props.match.params.handle) {
			this.props.getProfileByHandle(this.props.match.params.handle);
		}
	}

	componentWillReceiveProps(nextProps) {
		if (isEmpty(nextProps.profile.profile) && this.props.profile.loading) {
			this.props.history.push('/not-found');
		}
	}

	render() {
		const { profile, loading } = this.props.profile;
		let profileContent;

		if (isEmpty(profile) || loading) {
			profileContent = <Spinner />;
		} else {
			profileContent = (
				<div>
					<div className="row">
						<div className="col-md-12">
							<div className="card card-body bg-info text-white mb-3">
								<div className="row">
									<div className="col-4 col-md-3 m-auto">
										<img src={profile.user.avatar} className="rounded-circle" alt="avatar" />
									</div>
								</div>
								<div className="text-center">
									<h1 className="display-4 text-center">{profile.user.name}</h1>
									<p className="lead text-center">{profile.bio}</p>
									<p>
										{isEmpty(profile.social.facebook) ? null : (
											<a
												href={profile.social.facebook}
												className="text-white p-2"
												target="_blank"
												rel="noopener noreferrer"
											>
												<i className="fab fa-facebook fa-2x" />
											</a>
										)}
										{isEmpty(profile.social.twitter) ? null : (
											<a
												href={profile.social.twitter}
												className="text-white p-2"
												target="_blank"
												rel="noopener noreferrer"
											>
												<i className="fab fa-twitter fa-2x" />
											</a>
										)}
										{isEmpty(profile.social.youtube) ? null : (
											<a
												href={profile.social.youtube}
												className="text-white p-2"
												target="_blank"
												rel="noopener noreferrer"
											>
												<i className="fab fa-youtube fa-2x" />
											</a>
										)}
									</p>
								</div>
							</div>
						</div>
					</div>
					<div className="row">
						<div className="col-md-6">
							<Link to="/dashboard" className="btn btn-info mb-3 float-left">
								Back
							</Link>
						</div>
						<div className="col-md-6" />
					</div>
				</div>
			);
		}

		return (
			<div className="profile">
				<div className="container">
					<div className="row col-md-12">{profileContent}</div>
				</div>
			</div>
		);
	}
}

ShowProfile.propTypes = {
	profile: PropTypes.object.isRequired,
	getProfileByHandle: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	profile: state.profile
});

export default connect(
	mapStateToProps,
	{ getProfileByHandle }
)(ShowProfile);
