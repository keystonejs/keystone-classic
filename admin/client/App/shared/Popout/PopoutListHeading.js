/**
 * Render a popout list heading
 */

import React from 'react';
import blacklist from 'blacklist';
import classnames from 'classnames';

var PopoutListHeading = React.createClass({
	displayName: 'PopoutListHeading',
	propTypes: {
		children: React.PropTypes.node.isRequired,
		className: React.PropTypes.string,
	},
	render () {
		const className = classnames('PopoutList__heading', this.props.className);
		const props = blacklist(this.props, 'className');

		return (
			<div className={className} {...props} />
		);
	},
});

module.exports = PopoutListHeading;
