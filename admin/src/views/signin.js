var React = require('react');
var { Button, Form, FormField, FormInput, Spinner } = require('elemental');

var SigninView = React.createClass({
	displayName: 'SigninView',
	
	getInitialState: function() {
		return {};
	},
	
	renderBrand () {
		var logo = { src: '/keystone/images/logo.png', width: 205, height: 68 };
		if (Keystone.logo) {
			logo = typeof Keystone.logo === 'string' ? { src: Keystone.logo } : Keystone.logo;
			// TODO: Deprecate this
			if (Array.isArray(logo)) {
				logo = { src: logo[0], width: logo[1], height: logo[2] };
			}
		}
		
		return (
			<div className="auth-box-col">
				<div className="auth-box-brand">
					<a href='/' className="auth-box-logo">
						<img src={logo.src} width={logo.width ? logo.width : null} height={logo.height ? logo.height : null} alt={Keystone.brand} />
					</a>
				</div>
			</div>
		);
	},
	
	renderUserInfo () {
		if (!Keystone.user) return null;
		
		var openKeystoneButton = Keystone.userCanAccessKeystone ? <Button href="/keystone" type="primary">Open Keystone</Button> : null;
		
		return (
			<div className="auth-box-col">
				<p>Hi {Keystone.user.name.first}</p>
				<p>You're already signed in</p>
				{openKeystoneButton}
				<Button href="/keystone/signout" type="link-cancel">Sign Out</Button>
			</div>
		);
	},
	
	renderForm () {
		if (Keystone.user) return null;
		
		return (
			<div className="auth-box-col">
				<Form method="post" novalidate>
					<FormInput type="hidden" name={Keystone.csrf_token_key} value={Keystone.csrf_token_value} />
					<FormField label="Email" htmlFor="email">
						<FormInput type="email" name="email" id="email" ref="email" name="email" />
					</FormField>
					<FormField label="Password" htmlFor="password">
						<FormInput type="password" name="password" id="password" ref="password" name="password" />
					</FormField>
					<Button type="primary" submit>Sign In</Button>
					<Button type="link">Forgot Password?</Button>
				</Form>
			</div>
		);
	},
	
	render: function() {
		return (
			<div className="auth-box">
				<h1 className="u-hidden-visually">Sign In</h1>
				{this.renderBrand()}
				{this.renderUserInfo()}
				{this.renderForm()}
			</div>
		);
	}
	
});

React.render(<SigninView />, document.getElementById('signin-view'));
