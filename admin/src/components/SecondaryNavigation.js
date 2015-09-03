import blacklist from 'blacklist';
import classnames from 'classnames';
import React from 'react';
import { Container } from 'elemental';

var SecondaryNavItem = React.createClass({
	displayName: 'SecondaryNavItem',
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

var SecondaryNavigation = React.createClass({
	displayName: 'SecondaryNavigation',
	propTypes: {
		currentListKey: React.PropTypes.string,
		lists: React.PropTypes.array.isRequired,
	},
	renderNavigation () {
		let navigation = this.props.lists.map((list) => {
			let href = list.external ? list.path : ('/keystone/' + list.path);
			let className = (this.props.currentListKey && this.props.currentListKey === list.path) ? 'active' : null

			return (
				<SecondaryNavItem className={className} href={href}>
					{list.label}
				</SecondaryNavItem>
			);
		});

		return (
			<ul className="app-nav app-nav--secondary app-nav--left">
				{navigation}
			</ul>
		);
	},
	render () {
		return (
			<nav className="secondary-navbar">
				<Container clearfix>
					{this.renderNavigation()}
				</Container>
			</nav>
		);
	}
});

module.exports = SecondaryNavigation;
