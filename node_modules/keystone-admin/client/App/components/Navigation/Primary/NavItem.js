/**
 * A item in the primary navigation. If it has a "to" prop it'll render a
 * react-router "Link", if it has a "href" prop it'll render a simple "a" tag
 */
import React from 'react';
import { Link } from 'react-router';

var PrimaryNavItem = React.createClass({
	displayName: 'PrimaryNavItem',
	propTypes: {
		children: React.PropTypes.node.isRequired,
		className: React.PropTypes.string,
		href: React.PropTypes.string,
		label: React.PropTypes.string,
		title: React.PropTypes.string,
		to: React.PropTypes.string,
	},
	render () {
		let Button;
		// If we have a "to" prop, render a react-router Link component for
		// client-side routing without page reloads
		if (this.props.to) {
			Button = (
				<Link
					to={this.props.to}
					title={this.props.title}
					key={this.props.title}
					tabIndex="-1"
				>
					{this.props.children}
				</Link>
			);
		// Otherwise, if we have a "href" prop, render a normal link
		} else if (this.props.href) {
			Button = (
				<a
					href={this.props.href}
					title={this.props.title}
					key={this.props.title}
					tabIndex="-1"
				>
					{this.props.children}
				</a>
			);
		}
		return (
			<li
				className={this.props.className}
				data-section-label={this.props.label}
			>
				{Button}
			</li>
		);
	},
});

module.exports = PrimaryNavItem;
