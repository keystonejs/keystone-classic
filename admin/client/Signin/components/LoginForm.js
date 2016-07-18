/**
 * The login form of the signin screen
 */

import React from 'react';
import { Button, Form, FormField, FormInput } from '../../App/elemental';

// TODO FIGURE OUT IF THE BELOW NOTE IS STILL RELEVANT AND WE NEED THE REFS
// OR IF WE CAN CHANGE THIS TO A STATELESS COMPONENT
// NOTE: This is not a stateless components because those can't have refs
// attached to them
class LoginForm extends React.Component {
	render () {
		if (this.props.user) return null;
		return (
			<div className="auth-box__col">
				<Form onSubmit={this.props.handleSubmit} noValidate>
					<FormField label="Email" htmlFor="email">
						<FormInput
							type="email"
							name="email"
							onChange={this.props.handleInputChange}
							value={this.props.email}
							ref="email"
						/>
					</FormField>
					<FormField label="Password" htmlFor="password">
						<FormInput
							type="password"
							name="password"
							onChange={this.props.handleInputChange}
							value={this.props.password}
							ref="password"
						/>
					</FormField>
					<Button
						disabled={this.props.animating}
						kind="primary"
						type="submit"
					>
						Sign In
					</Button>
					{/* <Button disabled={this.state.animating} type="link-text">Forgot Password?</Button> */}
				</Form>
			</div>
		);
	}
}


module.exports = LoginForm;
