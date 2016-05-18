import React from 'react';

module.exports = React.createClass({
	displayName: 'Toolbar',
	render () {
		return (
			<div {...this.props} className="Toolbar">
				{this.props.children}
			</div>
		);
	},
});

// expose the children to the top level export
module.exports.Section = require('./ToolbarSection');
