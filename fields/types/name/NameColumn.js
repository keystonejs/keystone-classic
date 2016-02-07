import React from 'react';
import ItemsTableCell from '../../../admin/client/components/ItemsTableCell';
import ItemsTableValue from '../../../admin/client/components/ItemsTableValue';
import displayName from 'display-name';

var NameColumn = React.createClass({
	displayName: 'NameColumn',
	propTypes: {
		col: React.PropTypes.object,
		data: React.PropTypes.object,
		linkTo: React.PropTypes.string,
	},
	renderValue () {
		var value = this.props.data.fields[this.props.col.path];
		if (!value || (!value.first && !value.last)) return '(no name)';
		return displayName(value.first, value.last);
	},
	render () {
		return (
			<ItemsTableCell>
				<ItemsTableValue href={this.props.linkTo} padded interior field={this.props.col.type}>
					{this.renderValue()}
				</ItemsTableValue>
			</ItemsTableCell>
		);
	},
});

module.exports = NameColumn;
