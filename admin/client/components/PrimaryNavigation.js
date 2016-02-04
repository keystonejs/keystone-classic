import React from 'react';
import { Container } from 'elemental';

var PrimaryNavItem = React.createClass({
	displayName: 'PrimaryNavItem',
	propTypes: {
		children: React.PropTypes.node.isRequired,
		className: React.PropTypes.string,
		href: React.PropTypes.string.isRequired,
		title: React.PropTypes.string,
	},
	render () {
		return (
			<li className={this.props.className}>
				<a href={this.props.href} title={this.props.title} tabIndex="-1">
					{this.props.children}
				</a>
			</li>
		);
	},
});

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
	renderSignout () {
		if (!this.props.signoutUrl) return null;

		return (
			<PrimaryNavItem href={this.props.signoutUrl} title="Sign Out">
				<span className="octicon octicon-sign-out" />
			</PrimaryNavItem>
		);
	},
	renderFrontLink () {
		return (
			<ul className="app-nav app-nav--primary app-nav--right">
				<PrimaryNavItem href="/" title={'Front page - ' + this.props.brand}>
					<span className="octicon octicon-globe" />
				</PrimaryNavItem>
				{this.renderSignout()}
			</ul>
		);
	},
	renderBrand () {
		// TODO: support navbarLogo from keystone config
		return (
			<PrimaryNavItem className={this.props.currentSectionKey === 'dashboard' ? 'active' : null} href={Keystone.adminPath} title={'Dashboard - ' + this.props.brand}>
				<span className="octicon octicon-home" />
			</PrimaryNavItem>
		);
	},
	renderNavigation () {
		if (!this.props.sections || !this.props.sections.length) return null;

		return this.props.sections.map((section) => {
			let href = section.lists[0].external ? section.lists[0].path : `${Keystone.adminPath}/${section.lists[0].path}`;
			let className = (this.props.currentSectionKey && this.props.currentSectionKey === section.key) ? 'active' : null;

			return (
				<PrimaryNavItem key={section.key} className={className} href={href}>
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
						{this.renderBrand()}
						{this.renderNavigation()}
					</ul>
					{this.renderFrontLink()}
				</Container>
			</nav>
		);
	},
});

module.exports = PrimaryNavigation;
