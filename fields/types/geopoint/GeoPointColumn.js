import React from 'react';
import ItemsTableCell from '../../components/ItemsTableCell';
import ItemsTableValue from '../../components/ItemsTableValue';

var GeoPointColumn = React.createClass({
	displayName: 'GeoPointColumn',
	propTypes: {
		col: React.PropTypes.object,
		data: React.PropTypes.object,
	},
	renderValue () {
		const value = this.props.data.fields[this.props.col.path];
		if (!value || !value.length) return null;

		const formattedValue = `${value[1]}, ${value[0]}`;
		const formattedTitle = `Lat: ${value[1]} Lng: ${value[0]}`;

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
