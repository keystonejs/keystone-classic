import React from 'react';
import ItemsTableCell from '../../../admin/client/components/ItemsTableCell';
import ItemsTableValue from '../../../admin/client/components/ItemsTableValue';

var GeoPointColumn = React.createClass({
	displayName: 'GeoPointColumn',
	propTypes: {
		col: React.PropTypes.object,
		data: React.PropTypes.object,
	},
	renderValue () {
		let value = this.props.data.fields[this.props.col.path];
		if (!value || !value.length) return null;

		let formattedValue = `${value[1]}, ${value[0]}`;
		let formattedTitle = `Lat: ${value[1]} Lng: ${value[0]}`;

		return (
			<ItemsTableValue title={formattedTitle} field={this.props.col.type}>
				{formattedValue}
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

module.exports = GeoPointColumn;
