import React from 'react';
import { Container } from 'elemental';
import { Link } from 'react-router';

var PrimaryNavItem = React.createClass({
	displayName: 'PrimaryNavItem',
	propTypes: {
		children: React.PropTypes.node.isRequired,
		className: React.PropTypes.string,
		href: React.PropTypes.string.isRequired,
		label: React.PropTypes.string,
		title: React.PropTypes.string,
	},
	render () {
		return (
			<li className={this.props.className} data-section-label={this.props.label}>
				<Link to={this.props.href} title={this.props.title} tabIndex="-1">
					{this.props.children}
				</Link>
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
			<PrimaryNavItem label="octicon-sign-out" href={this.props.signoutUrl} title="Sign Out">
				<span className="octicon octicon-sign-out" />
			</PrimaryNavItem>
		);
	},
	renderFrontLink () {
		return (
			<ul className="app-nav app-nav--primary app-nav--right">
				<PrimaryNavItem label="octicon-globe" href={Keystone.backUrl} title={'Front page - ' + this.props.brand}>
					<span className="octicon octicon-globe" />
				</PrimaryNavItem>
				{this.renderSignout()}
			</ul>
		);
	},
	renderBrand () {
		// TODO: support navbarLogo from keystone config
		return (
			<PrimaryNavItem label="octicon-home" className={this.props.currentSectionKey === 'dashboard' ? 'active' : null} href={Keystone.adminPath} title={'Dashboard - ' + this.props.brand}>
				<span className="octicon octicon-home" />
			</PrimaryNavItem>
		);
	},
	renderNavigation () {
		if (!this.props.sections || !this.props.sections.length) return null;

		return this.props.sections.map((section) => {
			const href = section.lists[0].external ? section.lists[0].path : `${Keystone.adminPath}/${section.lists[0].path}`;
			const className = (this.props.currentSectionKey && this.props.currentSectionKey === section.key) ? 'active' : null;

			return (
				<PrimaryNavItem key={section.key} label={section.label} className={className} href={href}>
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
