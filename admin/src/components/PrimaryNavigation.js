import blacklist from 'blacklist';
import classnames from 'classnames';
import React from 'react';
import { Container } from 'elemental';

var PrimaryNavItem = React.createClass({
	displayName: 'PrimaryNavItem',
	propTypes: {
		className: React.PropTypes.string,
		children: React.PropTypes.node.isRequired,
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
		activeView: React.PropTypes.string,
		brand: React.PropTypes.string,
		navItems: React.PropTypes.array.isRequired,
		signoutUrl: React.PropTypes.string,
	},
	renderSignout () {
		if (!this.props.signoutUrl) return null;

		return (
			<ul className="app-nav app-nav--primary app-nav--right">
				<PrimaryNavItem href={this.props.signoutUrl} title="Sign Out">
					<span className="octicon octicon-sign-out" />
				</PrimaryNavItem>
			</ul>
		);
	},
	renderBrand () {
		return (
			<PrimaryNavItem className={!this.props.activeView ? 'active' : null} href='/keystone' title={'Dashboard - ' + this.props.brand} title={'Dashboard - ' + this.props.brand} title="Sign Out">
				<span className="octicon octicon-home" />
			</PrimaryNavItem>
		);
	},
	renderNavigation () {
		return this.props.navItems.map((item) => {
			let href = item.lists[0].external ? item.lists[0].path : ('/keystone/' + item.lists[0].path);
			let className = (this.props.activeView && this.props.activeView.key === item.key) ? 'active' : null

			return (
				<PrimaryNavItem className={className} href={href} title={'Dashboard - ' + this.props.brand} title="Sign Out">
					{item.label}
				</PrimaryNavItem>
			);
		});
	},
	render () {
		return (
			<nav className="primary-navbar">
				<Container clearfix>
					<ul className="app-nav app-nav--primary app-nav--left">
						{this.renderBrand()}
						{this.renderNavigation()}
					</ul>
					{this.renderSignout()}
				</Container>
			</nav>
		);
	}
});

module.exports = PrimaryNavigation;
