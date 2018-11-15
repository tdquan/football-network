import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import TextFieldGroup from '../common/TextFieldGroup';
import TextAreaGroup from '../common/TextAreaGroup';
import SelectListGroup from '../common/SelectListGroup';
import InputWithIcon from '../common/InputWithIcon';
import { createProfile } from '../../actions/profileActions';

class CreateProfile extends Component {
	constructor(props) {
		super(props);
		this.state = {
			displaySocialInputs: false,
			handle: '',
			clubs: '',
			bio: '',
			twitter: '',
			youtube: '',
			facebook: '',
			errors: {}
		}

		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	onSubmit(event) {
		event.preventDefault();
		const profileData = {
			handle: this.state.handle,
			clubs: this.state.clubs,
			bio: this.state.bio,
			facebook: this.state.facebook,
			twitter: this.state.twitter,
			youtube: this.state.youtube
		}

		this.props.createProfile(profileData, this.props.history);
	}

	onChange(event) {
		this.setState({
			[event.target.name]: event.target.value
		});
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.errors) {
			this.setState({ errors: nextProps.errors });
		}
	}

	render() {
		const { errors, displaySocialInputs } = this.state;
		// Select options for clubs
		const clubs = [
			{ label: '* Select your favourite team', value: 0 },
			{ label: 'Manchester United', value: 'Manchester United' },
			{ label: 'Barcelona', value: 'Barcelona' },
			{ label: 'Real Madrid', value: 'Real Madrid' },
			{ label: 'Bayern Munich', value: 'Bayern Munich' },
			{ label: 'Juventus', value: 'Juventus' }
		];
		// Social links
		let socialInputs;
		if (displaySocialInputs) {
			socialInputs = (
				<div>
					<InputWithIcon
						placeholder="Facebook"
						name="facebook"
						icon="fab fa-facebook"
						value={ this.state.facebook }
						onChange={ this.onChange }
						error={ errors.facebook }
					/>
					<InputWithIcon
						placeholder="Twitter"
						name="twitter"
						icon="fab fa-twitter"
						value={ this.state.twitter }
						onChange={ this.onChange }
						error={ errors.twitter }
					/>
					<InputWithIcon
						placeholder="Youtube"
						name="youtube"
						icon="fab fa-youtube"
						value={ this.state.youtube }
						onChange={ this.onChange }
						error={ errors.youtube }
					/>
				</div>
			)
		}

		return (
			<div className="create-profile">
				<div className="container">
					<div className="row">
						<div className="col-md-8 m-auto">
							<h1 className="display-4 text-center">Create your profile</h1>
							<p className="lead text-center">Please enter your information</p>
							<small className="d-block pb-3">* = required fields</small>
							<form onSubmit={ this.onSubmit }>
								<TextFieldGroup
									placeholder="* Profile handle"
									name="handle"
									value={ this.state.handle }
									onChange={ this.onChange }
									error={ errors.handle }
									info="A unique handle for your profile URL."
								/>
								<SelectListGroup
									placeholder="* Favourite team"
									name="clubs"
									value={ this.state.clubs }
									onChange={ this.onChange }
									options={ clubs }
									error={ errors.clubs }
									info="Pick your favourite team."
								/>
								<TextAreaGroup
									placeholder="Bio"
									name="bio"
									value={ this.state.bio }
									onChange={ this.onChange }
									error={ errors.bio }
									info="Some info about yourself."
								/>
								<div className="mb-3">
									<button
										type="button"
										onClick={() => {
											this.setState(prevState => ({ displaySocialInputs: !prevState.displaySocialInputs }))
										}}
										className="btn btn-secondary"
									>
									Add social links
									</button>
									<small className="text-muted ml-3">Optional</small>
								</div>
								{ socialInputs }
								<input className="btn btn-info btn-block mt-4" type="submit" value="Submit" />
							</form>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	profile: state.profile,
	errors: state.errors
});

CreateProfile.propTypes = {
	profile: PropTypes.object.isRequired,
	errors: PropTypes.object.isRequired
};

export default connect(mapStateToProps, { createProfile })(withRouter(CreateProfile))