import React from 'react';
import blacklist from 'blacklist';
import classnames from 'classnames';

var PopoutList = React.createClass({
	displayName: 'PopoutList',
	propTypes: {
		children: React.PropTypes.node.isRequired,
		className: React.PropTypes.string,
	},
	render () {
		let className = classnames('PopoutList', this.props.className);
		let props = blacklist(this.props, 'className');
		return <div className={className} {...props} />;
	}
});
module.exports = PopoutList;

// expose the child to the top level export
module.exports.Item = require('./PopoutListItem');
module.exports.Heading = require('./PopoutListHeading');
