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
		let className = classnames('PopoutList__heading', this.props.className);
		let props = blacklist(this.props, 'className');
		return <div className={className} {...props} />;
	}
});

module.exports = PopoutListHeading;
