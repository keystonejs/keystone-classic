import React from 'react';
import ItemsTableCell from '../../components/ItemsTableCell';
import ItemsTableValue from '../../components/ItemsTableValue';

var stripUsername = require('./utils/stripUsername');

var TwitterColumn = React.createClass({
	displayName: 'TwitterColumn',
	propTypes: {
		col: React.PropTypes.object,
		data: React.PropTypes.object,
	},
	renderValue () {
		var value = this.props.data.fields[this.props.col.path];
		if (!value) return;

		// Format href and label
		value = stripUsername(value);
		var href = 'https://twitter.com/' + value;
		var label = '@' + value;

		return (
			<ItemsTableValue href={href} padded exterior field={this.props.col.type}>
				{label}
			</ItemsTableValue>
		);
	},
	render () {
		return (
			<ItemsTableCell>
				{this.renderValue()}
			</ItemsTableCell>
		);
	},
});

module.exports = TwitterColumn;
