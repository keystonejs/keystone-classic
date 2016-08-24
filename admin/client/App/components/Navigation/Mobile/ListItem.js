/**
 * A list item of the mobile navigation
 */

import React from 'react';
import { Link } from 'react-router';

const MobileListItem = React.createClass({
	displayName: 'MobileListItem',
	propTypes: {
		children: React.PropTypes.node.isRequired,
		className: React.PropTypes.string,
		href: React.PropTypes.string.isRequired,
		onClick: React.PropTypes.func,
	},
	render () {
		return (
			<Link
				className={this.props.className}
				to={this.props.href}
				onClick={this.props.onClick}
				tabIndex="-1"
			>
				{this.props.children}
			</Link>
		);
	},
});

module.exports = MobileListItem;
