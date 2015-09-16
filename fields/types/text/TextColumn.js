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
	getValue () {
		// cropping text is important for textarea, which uses this column
		let value = this.props.data.fields[this.props.col.path];
		return value ? value.substr(0, 100) : null;
	},
	render () {
		let value = this.getValue();
		let empty = !value && this.props.linkTo ? true : false;
		if (!value) value = this.props.data.id;
		return (
			<ItemsTableCell>
				<ItemsTableValue href={this.props.linkTo} empty={empty} padded interior field={this.props.col.type}>
					{value}
				</ItemsTableValue>
			</ItemsTableCell>
		);
	}
});

module.exports = TextColumn;
