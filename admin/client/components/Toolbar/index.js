import React from 'react';
import { Container } from 'elemental';

module.exports = React.createClass({
	displayName: 'Toolbar',
	render () {
		return (
			<div {...this.props} className="Toolbar">
				<Container clearfix >
					{this.props.children}
				</Container>
			</div>
		);
	},
});

// expose the children to the top level export
module.exports.Section = require('./ToolbarSection');
