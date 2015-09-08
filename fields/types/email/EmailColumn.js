import React from 'react';
import ItemsTableCell from '../../../admin/src/components/ItemsTableCell';
import ItemsTableValue from '../../../admin/src/components/ItemsTableValue';

var EmailColumn = React.createClass({
	displayName: 'EmailColumn',
	propTypes: {
		col: React.PropTypes.object,
		data: React.PropTypes.object,
	},
	renderValue: function() {
		let value = this.props.data.fields[this.props.col.path];
		if (!value) return;

		return (
			<ItemsTableValue href={'mailto:'+ value} padded exterior field={this.props.col.path}>
				{value}
			</ItemsTableValue>
		);
	},
	render: function() {
		let value = this.props.data.fields[this.props.col.path];
		return (
			<ItemsTableCell>
				{this.renderValue()}
			</ItemsTableCell>
		);
	}
});

module.exports = EmailColumn;
