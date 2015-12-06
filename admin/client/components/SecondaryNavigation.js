import React from 'react';
import { Container } from 'elemental';

var SecondaryNavItem = React.createClass({
	displayName: 'SecondaryNavItem',
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

var SecondaryNavigation = React.createClass({
	displayName: 'SecondaryNavigation',
	propTypes: {
		currentListKey: React.PropTypes.string,
		lists: React.PropTypes.array.isRequired,
	},
	getInitialState() {
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
			navIsVisible: this.props.lists && this.props.lists.length > 1 && window.innerWidth >= 768
		});
	},
	renderNavigation (lists) {
		let navigation = lists.map((list) => {
			let href = list.external ? list.path : `${Keystone.adminPath}/${list.path}`;
			let className = (this.props.currentListKey && this.props.currentListKey === list.path) ? 'active' : null;

			return (
				<SecondaryNavItem key={list.path} className={className} href={href}>
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
		if (!this.state.navIsVisible) return null;

		return (
			<nav className="secondary-navbar">
				<Container clearfix>
					{this.renderNavigation(this.props.lists)}
				</Container>
			</nav>
		);
	}
});

module.exports = SecondaryNavigation;
