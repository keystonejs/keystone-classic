import React from 'react';
import moment from 'moment';
import ItemsTableCell from '../../../admin/src/components/ItemsTableCell';
import ItemsTableValue from '../../../admin/src/components/ItemsTableValue';

var DateColumn = React.createClass({
	displayName: 'SelectColumn',
	propTypes: {
		col: React.PropTypes.object,
		data: React.PropTypes.object,
	},
	renderValue () {
		let value = this.props.data.fields[this.props.col.path];
		if (!value) return null;

		let format = (this.props.col.path === 'dateTime') ? 'MMMM Do YYYY, h:mm:ss a' : 'MMMM Do YYYY';
		let formattedValue = moment(value).format(format);

		return (
			<ItemsTableValue title={formattedValue} field={this.props.col.path}>
				{formattedValue}
			</ItemsTableValue>
		);;
	},
	render () {
		return (
			<ItemsTableCell>
				{this.renderValue()}
			</ItemsTableCell>
		);
	}
});

module.exports = DateColumn;
