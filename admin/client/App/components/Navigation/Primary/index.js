/**
 * The primary (i.e. uppermost) navigation on desktop. Renders all sections and
 * the home-, website- and signout buttons.
 */

import React from 'react';
import { Container } from 'elemental';
import PrimaryNavItem from './NavItem';

var PrimaryNavigation = React.createClass({
	displayName: 'PrimaryNavigation',
	propTypes: {
		brand: React.PropTypes.string,
		currentSectionKey: React.PropTypes.string,
		sections: React.PropTypes.array.isRequired,
		signoutUrl: React.PropTypes.string,
	},
	getInitialState () {
		return {};
	},
	// Handle resizing, hide this navigation on mobile (i.e. < 768px) screens
	componentDidMount () {
		this.handleResize();
		window.addEventListener('resize', this.handleResize);
	},
	componentWillUnmount () {
		window.removeEventListener('resize', this.handleResize);
	},
	handleResize () {
		this.setState({
			navIsVisible: window.innerWidth >= 768,
		});
	},

	renderUser () {
		if (!Keystone.user) return null;

		var userLink = '/keystone/users/' + Keystone.user.id;
		return (
			<PrimaryNavItem label="octicon-sign-out" href={userLink} title="User">
				<span>{Keystone.user.name.first}</span>
			</PrimaryNavItem>
		);
	},

	// Render the sign out button
	renderSignout () {
		if (!this.props.signoutUrl) return null;

		return (
			<PrimaryNavItem
				label="octicon-sign-out"
				href={this.props.signoutUrl}
				title="Sign Out"
			>
				<span className="octicon octicon-sign-out" /> Sign Out
			</PrimaryNavItem>
		);
	},
	// Render the link to the webpage
	renderFrontLink () {
		var s = {
			paddingTop: '0px',
		};
		return (
			<PrimaryNavItem href={Keystone.backUrl} title={'Front page - ' + this.props.brand} style={s}>
				<span><img src="http://res.cloudinary.com/welltok/image/upload/v1463605288/wellstone_logo_white.png" height="40px"/></span>
			</PrimaryNavItem>
		);
	},
	renderBrand () {
		// TODO: support navbarLogo from keystone config

		const { brand, currentSectionKey } = this.props;

		return (
			<PrimaryNavItem label="octicon-home" className={currentSectionKey === 'dashboard' ? 'active' : null} href={Keystone.adminPath} title={'Dashboard - ' + brand}>
				<span>All</span>
			</PrimaryNavItem>
		);
	},
	// Render the navigation
	renderNavigation () {
		if (!this.props.sections || !this.props.sections.length) return null;

		return this.props.sections.map((section) => {
			// Get the link and the class name
			const href = section.lists[0].external ? section.lists[0].path : `${Keystone.adminPath}/${section.lists[0].path}`;
			const className = (this.props.currentSectionKey && this.props.currentSectionKey === section.key) ? 'primary-navbar__item--active' : null;

			return (
				<PrimaryNavItem
					key={section.key}
					label={section.label}
					className={className}
					to={href}
				>
					{section.label}
				</PrimaryNavItem>
			);
		});
	},
	render () {
		if (!this.state.navIsVisible) return null;

		return (
			<nav className="primary-navbar">
				<Container clearfix>
					<ul className="app-nav app-nav--primary app-nav--left">
						{this.renderFrontLink()}
						{this.renderBrand()}
						{this.renderNavigation()}
					</ul>
					<ul className="app-nav app-nav--primary app-nav--right">
						{this.renderUser()}
						{this.renderSignout()}
					</ul>
				</Container>
			</nav>
		);
	},
});

module.exports = PrimaryNavigation;
