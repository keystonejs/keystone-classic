var React = require('react');
var classnames = require('classnames');
var { Alert, Button, Form, FormField, FormInput, Spinner } = require('elemental');

var SigninView = React.createClass({
	displayName: 'SigninView',
	
	getInitialState: function() {
		return {
			email: '',
			password: '',
			isAnimating: false,
			isInvalid: false,
			invalidMessage: '',
		};
	},
	
	handleInputChange (e) {
		let newState = {};
		newState[e.target.name] = e.target.value;
		
		this.setState(newState);
	},
	
	handleSubmit (e) {
		e.preventDefault();
		console.info('Form submission attempt');
		
		if (this.state.email === 'success') {
			// TODO Success behaviour
		} else {
			// TODO Fail behaviour
			this.setState({
				isAnimating: true,
				isInvalid: true,
				invalidMessage: 'That email and password combination is invalid'
			});
			setTimeout(() => {
				this.refs.email.getDOMNode().select();
				this.setState({
					isAnimating: false
				});
			}, 750);
		}
	},
	
	renderBrand () {
		var logo = { src: '/keystone/images/logo.png', width: 205, height: 68 };
		if (this.props.logo) {
			logo = typeof this.props.logo === 'string' ? { src: this.props.logo } : this.props.logo;
			// TODO: Deprecate this
			if (Array.isArray(logo)) {
				logo = { src: logo[0], width: logo[1], height: logo[2] };
			}
		}
		
		return (
			<div className="auth-box__col">
				<div className="auth-box__brand">
					<a href='/' className="auth-box__brand__logo">
						<img src={logo.src} width={logo.width ? logo.width : null} height={logo.height ? logo.height : null} alt={this.props.brand} />
					</a>
				</div>
			</div>
		);
	},
	
	renderUserInfo () {
		if (!this.props.user) return null;
		
		var openKeystoneButton = this.props.userCanAccessKeystone ? <Button href="/keystone" type="primary">Open Keystone</Button> : null;
		
		return (
			<div className="auth-box__col">
				<p>Hi {this.props.user.name.first}</p>
				<p>You're already signed in</p>
				{openKeystoneButton}
				<Button href="/keystone/signout" type="link-cancel">Sign Out</Button>
			</div>
		);
	},
	
	renderAlert () {
		return this.state.isInvalid ? (
			<Alert key="real" type="danger" style={{ textAlign: 'center' }}>{this.state.invalidMessage}</Alert>
		) : (
			<Alert key="fake" type="placeholder">&nbsp;</Alert>
		);
	},
	
	renderForm () {
		if (this.props.user) return null;
		
		return (
			<div className="auth-box__col">
				<Form onSubmit={this.handleSubmit} noValidate>
					<FormInput type="hidden" name={this.props.csrfTokenKey} value={this.props.csrfTokenValue} />
					<FormField label="Email" htmlFor="email">
						<FormInput type="email" name="email" onChange={this.handleInputChange} value={this.state.email} ref="email" />
					</FormField>
					<FormField label="Password" htmlFor="password">
						<FormInput type="password" name="password" onChange={this.handleInputChange} value={this.state.password} ref="password" />
					</FormField>
					<Button disabled={this.state.animating} type="primary" submit>Sign In</Button>
					<Button disabled={this.state.animating} type="link-text">Forgot Password?</Button>
				</Form>
			</div>
		);
	},
	
	render: function() {
		let boxClassname = classnames('auth-box', {
			'auth-box--has-errors': this.state.isAnimating
		});
		
		return (
			<div className="auth-wrapper">
				{this.renderAlert()}
				<div className={boxClassname}>
					<h1 className="u-hidden-visually">{this.props.brand ? this.props.brand : 'Keystone'} Sign In </h1>
					<div className="auth-box__inner">
						{this.renderBrand()}
						{this.renderUserInfo()}
						{this.renderForm()}
					</div>
				</div>
				<div className="auth-footer">
					<span>Powered by </span>
					<a href="http://keystonejs.com" target="_blank" title="The Node.js CMS and web application platform (new window)">KeystoneJS</a>
				</div>
			</div>
		);
	}
	
});

React.render(<SigninView
		brand={Keystone.brand}
		csrfTokenKey={Keystone.csrf_token_key}
		csrfTokenValue={Keystone.csrf_token_value}
		logo={Keystone.logo}
		user={Keystone.user}
		userCanAccessKeystone={Keystone.userCanAccessKeystone}
	/>, document.getElementById('signin-view'));
