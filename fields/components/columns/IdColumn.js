import React from 'react';
import ItemsTableCell from '../../../admin/client/components/ItemsTable/ItemsTableCell';
import ItemsTableValue from '../../../admin/client/components/ItemsTable/ItemsTableValue';

var IdColumn = React.createClass({
	displayName: 'IdColumn',
	propTypes: {
		col: React.PropTypes.object,
		data: React.PropTypes.object,
		list: React.PropTypes.object,
	},
	renderValue () {
		const value = this.props.data.id;
		if (!value) return null;

		return (
			<ItemsTableValue padded interior title={value} href={Keystone.adminPath + '/' + this.props.list.path + '/' + value} field={this.props.col.type}>
				{value}
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

module.exports = IdColumn;
