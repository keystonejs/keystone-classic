import React from 'react';
import ItemsTableCell from '../../../admin/src/components/ItemsTableCell';
import ItemsTableValue from '../../../admin/src/components/ItemsTableValue';

var TextColumn = React.createClass({
	displayName: 'TextColumn',
	propTypes: {
		col: React.PropTypes.object,
		data: React.PropTypes.object,
		linkTo: React.PropTypes.string,
	},
	// cropping text is necessary for textarea, which uses this column
	renderValue: function() {
		let value = this.props.data.fields[this.props.col.path];
		return value ? value.substr(0, 100) : null;
	},
	render: function() {
		return (
			<ItemsTableCell>
				<ItemsTableValue href={this.props.linkTo} padded interior field={this.props.col.path}>
					{this.renderValue()}
				</ItemsTableValue>
			</ItemsTableCell>
		);
	}
});

module.exports = TextColumn;
