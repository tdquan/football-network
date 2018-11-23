import React from 'react';
import { Link } from 'react-router-dom';

const AddProfileDetails = props => {
	return (
		<div className="btn-group mb-4" role="group">
			<Link to="/edit-profile" className="btn btn-info">
				<i className="fas fa-user-circle mr-1" />
				Edit profile
			</Link>
		</div>
	);
};

export default AddProfileDetails;
