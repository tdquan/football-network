import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { getCurrentProfile, deleteAccount } from '../../actions/profileActions';
import Spinner from '../common/Spinner';
import AddProfileDetails from '../dashboard/AddProfileDetails';

class CurrentProfile extends Component {
	componentDidMount() {
		this.props.getCurrentProfile();
	}

	onDeleteClick() {
		this.props.deleteAccount();
	}

	render() {
		const { user } = this.props.auth;
		const { profile, loading } = this.props.profile;

		let profileContent;

		if (profile === null || loading) {
			profileContent = <Spinner />;
		} else {
			if (Object.keys(profile).length > 0) {
				profileContent = (
					<div>
						<div className="mb-4">
							<p className="lead">
								Welcome {user.name}
							</p>
						</div>
						<AddProfileDetails />
						<hr />
						<button onClick={this.onDeleteClick.bind(this)} className="btn btn-danger">
							Delete my account
						</button>
					</div>
				);
			} else {
				// User is logged in but has no profile
				profileContent = (
					<div>
						<p className="lead">Welcome {user.name}</p>
						<p>You have not created a profile. Please create one.</p>
						<Link to="/create-profile" className="btn btn-lg btn-info">
							Create profile
						</Link>
					</div>
				);
			}
		}

		return (
			<div className="dashboard">
				<div className="container">
					<div className="row">
						<div className="col-md-8 offset-md-2">
							<h1 className="display-6 text-center">Your Profile</h1>
							{profileContent}
						</div>
					</div>
				</div>
			</div>
		);
	}
}

CurrentProfile.propTypes = {
	getCurrentProfile: PropTypes.func.isRequired,
	deleteAccount: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
	profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	auth: state.auth,
	profile: state.profile
});

export default connect(
	mapStateToProps,
	{ getCurrentProfile, deleteAccount }
)(CurrentProfile);
