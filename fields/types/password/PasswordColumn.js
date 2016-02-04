import React from 'react';
import ItemsTableCell from '../../../admin/client/components/ItemsTableCell';
import ItemsTableValue from '../../../admin/client/components/ItemsTableValue';

var PasswordColumn = React.createClass({
	displayName: 'PasswordColumn',
	propTypes: {
		col: React.PropTypes.object,
		data: React.PropTypes.object,
	},
	renderValue () {
		let value = this.props.data.fields[this.props.col.path];
		return value ? '********' : '';
	},
	render () {
		return (
			<ItemsTableCell>
				<ItemsTableValue field={this.props.col.type}>
					{this.renderValue()}
				</ItemsTableValue>
			</ItemsTableCell>
		);
	},
});

module.exports = PasswordColumn;
