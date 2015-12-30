import React from 'react';
import moment from 'moment';
import ItemsTableCell from '../../../admin/client/components/ItemsTableCell';
import ItemsTableValue from '../../../admin/client/components/ItemsTableValue';

var DateColumn = React.createClass({
	displayName: 'DateColumn',
	propTypes: {
		col: React.PropTypes.object,
		data: React.PropTypes.object,
	},
	renderValue () {
		let value = this.props.data.fields[this.props.col.path];
		if (!value) return null;

		let format = (this.props.col.type === 'datetime') ? 'MMMM Do YYYY, h:mm:ss a' : 'MMMM Do YYYY';
		let formattedValue = moment(value).format(format);

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
	}
});

module.exports = DateColumn;
