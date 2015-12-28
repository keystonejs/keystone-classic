'use strict';

import classnames from 'classnames';
import React from 'react';
import ReactDOM from 'react-dom';
import SessionStore from '../stores/SessionStore';
import { Alert, Button, Form, FormField, FormInput } from 'elemental';
import { createHistory } from 'history';

var history = createHistory();

var SigninView = React.createClass({
	getInitialState () {
		return {
			email: '',
			password: '',
			isAnimating: false,
			isInvalid: false,
			invalidMessage: '',
			signedOut: window.location.search === '?signedout'
		};
	},
	componentDidMount () {
		if (this.state.signedOut && window.history.replaceState) {
			history.replaceState({}, window.location.pathname);
		}
		if (this.refs.email) {
			ReactDOM.findDOMNode(this.refs.email).select();
		}
	},
	handleInputChange (e) {
		let newState = {};
		newState[e.target.name] = e.target.value;
		this.setState(newState);
	},
	handleSubmit (e) {
		e.preventDefault();
		if (!this.state.email || !this.state.password) {
			return this.displayError('Please enter an email address and password to sign in.');
		}
		SessionStore.signin({
			email: this.state.email,
			password: this.state.password
		}, (err, data) => {
			if (err || data && data.error) {
				this.displayError('The email and password you entered are not valid.');
			} else {
				// TODO: Handle custom signin redirections
				top.location.href = Keystone.adminPath;
			}
		});
	},
	displayError (message) {
		this.setState({
			isAnimating: true,
			isInvalid: true,
			invalidMessage: message
		});
		setTimeout(this.finishAnimation, 750);
	},
	finishAnimation () {
		if (!this.isMounted()) return;
		if (this.refs.email) {
			ReactDOM.findDOMNode(this.refs.email).select();
		}
		this.setState({
			isAnimating: false
		});
	},
	renderBrand () {
		let logo = { src: `${Keystone.adminPath}/images/logo.png`, width: 205, height: 68 };
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
					<a href="/" className="auth-box__brand__logo">
						<img src={logo.src} width={logo.width ? logo.width : null} height={logo.height ? logo.height : null} alt={this.props.brand} />
					</a>
				</div>
			</div>
		);
	},
	renderUserInfo () {
		if (!this.props.user) return null;
		let openKeystoneButton = this.props.userCanAccessKeystone ? <Button href={Keystone.adminPath} type="primary">Open Keystone</Button> : null;
		return (
			<div className="auth-box__col">
				<p>Hi {this.props.user.name.first},</p>
				<p>You're already signed in.</p>
				{openKeystoneButton}
				<Button href={`${Keystone.adminPath}/signout`} type="link-cancel">Sign Out</Button>
			</div>
		);
	},
	renderAlert () {
		if (this.state.isInvalid) {
			return <Alert key="error" type="danger" style={{ textAlign: 'center' }}>{this.state.invalidMessage}</Alert>;
		} else if (this.state.signedOut) {
			return <Alert key="signed-out" type="info" style={{ textAlign: 'center' }}>You have been signed out.</Alert>;
		} else {
			/* eslint-disable react/self-closing-comp */
			// TODO: This probably isn't the best way to do this, we
			// shouldn't be using Elemental classNames instead of components
			return <div key="fake" className="Alert Alert--placeholder">&nbsp;</div>;
			/* eslint-enable */
		}
	},
	renderForm () {
		if (this.props.user) return null;
		return (
			<div className="auth-box__col">
				<Form method="post" onSubmit={this.handleSubmit} noValidate>
					<FormField label="Email" htmlFor="email">
						<FormInput type="email" name="email" onChange={this.handleInputChange} value={this.state.email} ref="email" />
					</FormField>
					<FormField label="Password" htmlFor="password">
						<FormInput type="password" name="password" onChange={this.handleInputChange} value={this.state.password} ref="password" />
					</FormField>
					<Button disabled={this.state.animating} type="primary" submit>Sign In</Button>
					{/*<Button disabled={this.state.animating} type="link-text">Forgot Password?</Button>*/}
				</Form>
			</div>
		);
	},
	render () {
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

ReactDOM.render(<SigninView
		brand={Keystone.brand}
		logo={Keystone.logo}
		user={Keystone.user}
		userCanAccessKeystone={Keystone.userCanAccessKeystone}
	/>, document.getElementById('signin-view'));
