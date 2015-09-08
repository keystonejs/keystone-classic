import React from 'react';
import numeral from 'numeral';
import ItemsTableCell from '../../../admin/src/components/ItemsTableCell';
import ItemsTableValue from '../../../admin/src/components/ItemsTableValue';

var NumberColumn = React.createClass({
	displayName: 'NumberColumn',
	propTypes: {
		col: React.PropTypes.object,
		data: React.PropTypes.object,
	},
	renderValue: function() {
		let value = this.props.data.fields[this.props.col.path];
		if (!value || isNaN(value)) return null

		let formattedValue = (this.props.col.path === 'money') ? numeral(value).format('$0,0.00') : value;

		return formattedValue;
	},
	render: function() {
		return (
			<ItemsTableCell>
				<ItemsTableValue field={this.props.col.path}>
					{this.renderValue()}
				</ItemsTableValue>
			</ItemsTableCell>
		);
	}
});

module.exports = NumberColumn;
