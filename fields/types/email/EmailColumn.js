import React from 'react';
import ItemsTableCell from '../../../admin/client/components/ItemsTable/ItemsTableCell';
import ItemsTableValue from '../../../admin/client/components/ItemsTable/ItemsTableValue';

var EmailColumn = React.createClass({
	displayName: 'EmailColumn',
	propTypes: {
		col: React.PropTypes.object,
		data: React.PropTypes.object,
	},
	renderValue () {
		const value = this.props.data.fields[this.props.col.path];
		if (!value) return;

		return (
			<ItemsTableValue href={'mailto:' + value} padded exterior field={this.props.col.type}>
				{value}
			</ItemsTableValue>
		);
	},
	render () {
		const value = this.props.data.fields[this.props.col.path];
		return (
			<ItemsTableCell>
				{this.renderValue()}
			</ItemsTableCell>
		);
	},
});

module.exports = EmailColumn;
