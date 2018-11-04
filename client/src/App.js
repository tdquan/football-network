// Library
import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import jwt_decode from 'jwt-decode';

// Components
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Footer from './components/layout/Footer';
import Register from './components/auth/Register';
import Login from './components/auth/Login';

// CSS
import './App.css';

// Custome libraries
import store from './store';
import setAuthToken from './utils/setAuthToken';
import { setCurrentUser } from './actions/authActions';

if (localStorage.jwtToken) {
	// Set token to AuthHeader
	setAuthToken(localStorage.jwtToken);
	// Decode token to get user data
	const decoded = jwt_decode(localStorage.jwtToken);
	// Set current user
	store.dispatch(setCurrentUser(decoded));
}

class App extends Component {
	render() {
		return (
			<Provider store={ store }>
				<Router>
					<div className="App">
		        <Navbar />
		        <Route exact path='/' component={ Landing } />
		        <div className="main-body container">
		        	<Route exact path='/register' component={ Register } />
		        	<Route exact path='/login' component={ Login } />
		        </div>
		        <Footer />
		      </div>
	      </Router>
      </Provider>
		);
	}
}

export default App;