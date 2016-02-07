import React from 'react';
import classnames from 'classnames';
import Checkbox from '../../../admin/client/components/Checkbox';
import ItemsTableCell from '../../../admin/client/components/ItemsTableCell';
import ItemsTableValue from '../../../admin/client/components/ItemsTableValue';

var BooleanColumn = React.createClass({
	displayName: 'BooleanColumn',
	propTypes: {
		col: React.PropTypes.object,
		data: React.PropTypes.object,
	},
	renderValue () {
		return (
			<ItemsTableValue truncate={false} field={this.props.col.type}>
				<Checkbox readonly checked={this.props.data.fields[this.props.col.path]} />
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

module.exports = BooleanColumn;
