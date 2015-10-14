import blacklist from 'blacklist';
import classnames from 'classnames';
import React from 'react';

var PopoutListHeading = React.createClass({
	displayName: 'PopoutListHeading',
	propTypes: {
		children: React.PropTypes.node.isRequired,
	},
	render () {
		let className = classnames('PopoutList__heading', this.props.className);
		let props = blacklist(this.props, 'className');
		return <div className={className} {...props} />;
	}
});

module.exports = PopoutListHeading;
