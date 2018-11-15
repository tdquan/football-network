import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

/* beautify preserve:start */
const PrivateRoute = ({ component: Component, auth, ...rest }) => (
	<Route
		{...rest}
		render = {props =>
			auth.isAuthenticated ? (
				<Component { ...props } />
			) : (
				<Redirect to="/login" />
			)
		}
	/>
)
/* beautify preserve:end */

PrivateRoute.propTypes = {
	auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
	auth: state.auth,
});

export default connect(mapStateToProps)(PrivateRoute);