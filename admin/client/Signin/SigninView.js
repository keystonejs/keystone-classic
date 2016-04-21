import React from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import SessionStore from '../stores/SessionStore';
import { Button, Form, FormField, FormInput } from 'elemental';
import { createHistory } from 'history';

import AlertView from './components/AlertView';
import Brand from './components/Brand';
import UserInfo from './components/UserInfo';
import LoginForm from './components/LoginForm';

var history = createHistory();

var SigninView = React.createClass({
	getInitialState () {
		return {
			email: '',
			password: '',
			isAnimating: false,
			isInvalid: false,
			invalidMessage: '',
			signedOut: window.location.search === '?signedout',
		};
	},
	componentDidMount () {
		if (this.state.signedOut && window.history.replace) {
			history.replace({}, window.location.pathname);
		}
		if (this.refs.email) {
			ReactDOM.findDOMNode(this.refs.email).select();
		}
	},
	handleInputChange (e) {
		const newState = {};
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
			password: this.state.password,
		}, (err, data) => {
			if (err || data && data.error) {
				this.displayError('The email and password you entered are not valid.');
			} else {
				top.location.href = this.props.from ? this.props.from : Keystone.adminPath;
			}
		});
	},
	displayError (message) {
		this.setState({
			isAnimating: true,
			isInvalid: true,
			invalidMessage: message,
		});
		setTimeout(this.finishAnimation, 750);
	},
	finishAnimation () {
		if (!this.isMounted()) return;
		if (this.refs.email) {
			ReactDOM.findDOMNode(this.refs.email).select();
		}
		this.setState({
			isAnimating: false,
		});
	},
	render () {
		const boxClassname = classnames('auth-box', {
			'auth-box--has-errors': this.state.isAnimating,
		});
		return (
			<div className="auth-wrapper">
				<AlertView 
					isInvalid = {this.state.isInvalid}
					signedOut = {this.state.signedOut}
					invalidMessage={this.state.invalidMessage}
				/>
				<div className = {boxClassname}>
					<h1 className="u-hidden-visually">{this.props.brand ? this.props.brand : 'Keystone'} Sign In </h1>
					<div className="auth-box__inner">
					
					<Brand 
						logo = {this.props.isInvalid}
						brand = {this.props.brand}
					/>
					<UserInfo 
						user = {this.props.user}
						userCanAccessKeystone = {this.props.userCanAccessKeystone}
					/>

					<LoginForm
						user = {this.props.user}
						handleSubmit = {this.handleSubmit}
						handleInputChange = {this.handleInputChange}
						email = {this.state.email}
						password = {this.state.password}
						animating = {this.state.animating}
					/>
					</div>
				</div>
				<div className="auth-footer">
					<span>Powered by </span>
					<a href="http://keystonejs.com" target="_blank" title="The Node.js CMS and web application platform (new window)">KeystoneJS</a>
				</div>
			</div>
		);
	},
});


module.exports = SigninView;
