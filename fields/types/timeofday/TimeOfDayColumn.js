import React from 'react';
import moment from 'moment';
import ItemsTableCell from '../../../admin/client/components/ItemsTable/ItemsTableCell';
import ItemsTableValue from '../../../admin/client/components/ItemsTable/ItemsTableValue';

var TimeOfDayColumn = React.createClass({
	displayName: 'TimeOfDayColumn',
	propTypes: {
		col: React.PropTypes.object,
		data: React.PropTypes.object,
	},
	renderValue () {
		const value = this.props.data.fields[this.props.col.path];
		if (!value) return null;

		const format = 'h:mm a';
		const formattedValue = moment(value).utc().format(format);

		return (
			<ItemsTableValue title={formattedValue} field={this.props.col.type}>
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

module.exports = TimeOfDayColumn;
