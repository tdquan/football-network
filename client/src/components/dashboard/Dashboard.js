import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { getCurrentProfile, deleteAccount } from '../../actions/profileActions';
import Spinner from '../common/Spinner';
import AddProfileDetails from './AddProfileDetails';

class Dashboard extends Component {
	componentDidMount() {
		this.props.getCurrentProfile();
	}

	onDeleteClick() {
		this.props.deleteAccount();
	}

	render() {
		const { user } = this.props.auth;
		const { profile, loading } = this.props.profile;

		let dashboardContent;

		if (profile === null || loading) {
			dashboardContent = <Spinner />;
		} else {
			if (Object.keys(profile).length > 0) {
				dashboardContent = (
					<div>
						<div className="mb-4">
							<p className="lead">
								Welcome {user.name}
								<small className="ml-1 mr-1 text-muted">-</small>
								<Link to="/profile">
									<small className="text-muted">Your profile</small>
								</Link>
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
				dashboardContent = (
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
						<div className="col-md-12">
							<h1 className="display-4 text-center">Dashboard</h1>
							{dashboardContent}
						</div>
					</div>
				</div>
			</div>
		);
	}
}

Dashboard.propTypes = {
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
)(Dashboard);
