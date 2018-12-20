// Library
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import jwt_decode from 'jwt-decode';

// Components
import PrivateRoute from './components/common/PrivateRoute';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Footer from './components/layout/Footer';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import ShowProfile from './components/profile/ShowProfile';
import CurrentProfile from './components/profile/CurrentProfile';
import CreateProfile from './components/profile/CreateProfile';
import EditProfile from './components/profile/EditProfile';
import PostIndex from './components/post/PostIndex';
import PostShow from './components/post/PostShow';
import NotFound from './components/errors/NotFound';

// CSS
import './App.css';

// Custome libraries
import store from './store';
import setAuthToken from './utils/setAuthToken';
import { setCurrentUser, logoutUser } from './actions/authActions';
import { clearCurrentProfile } from './actions/profileActions';

// Check if there is stored token for logged in user
if (localStorage.jwtToken) {
	// Set token to AuthHeader
	setAuthToken(localStorage.jwtToken);
	// Decode token to get user data
	const decoded = jwt_decode(localStorage.jwtToken);
	// Set current user
	store.dispatch(setCurrentUser(decoded));

	// Check for expired token
	const currentTime = Date.now() / 1000;
	if (decoded.exp < currentTime) {
		// Clear current profile
		store.dispatch(clearCurrentProfile());
		// Log out user
		store.dispatch(logoutUser());
		// Redirect to login page
		window.location.href('/login');
	}
}

class App extends Component {
	render() {
		return (
			<Provider store={store}>
				<Router>
					<div className="App">
						<Navbar />
						<Route exact path="/" component={Landing} />
						<div className="main-body container">
							<Route exact path="/register" component={Register} />
							<Route exact path="/login" component={Login} />
							<Route exact path="/profile/:handle" component={ShowProfile} />
							<Switch>
								<PrivateRoute exact path="/dashboard" component={Dashboard} />
							</Switch>
							<Switch>
								<PrivateRoute exact path="/create-profile" component={CreateProfile} />
							</Switch>
							<Switch>
								<PrivateRoute exact path="/edit-profile" component={EditProfile} />
							</Switch>
							<Switch>
								<PrivateRoute exact path="/profile" component={CurrentProfile} />
							</Switch>
							<Switch>
								<PrivateRoute exact path="/feed" component={PostIndex} />
							</Switch>
							<Switch>
								<PrivateRoute exact path="/posts/:id" component={PostShow} />
							</Switch>
							<Route exact path="/not-found" component={NotFound} />
						</div>
						<Footer />
					</div>
				</Router>
			</Provider>
		);
	}
}

export default App;
