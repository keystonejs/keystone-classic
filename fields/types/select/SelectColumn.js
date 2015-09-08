import React from 'react';
import ItemsTableCell from '../../../admin/src/components/ItemsTableCell';
import ItemsTableValue from '../../../admin/src/components/ItemsTableValue';

var SelectColumn = React.createClass({
	displayName: 'SelectColumn',
	propTypes: {
		col: React.PropTypes.object,
		data: React.PropTypes.object,
	},
	renderValue () {
		var value = this.props.data.fields[this.props.col.path];
		var option = this.props.col.field.ops.filter(i => i.value === value)[0];

		return option ? option.label : null;
	},
	render () {
		return (
			<ItemsTableCell>
				<ItemsTableValue field={this.props.col.path}>
					{this.renderValue()}
				</ItemsTableValue>
			</ItemsTableCell>
		);
	}
});

module.exports = SelectColumn;
