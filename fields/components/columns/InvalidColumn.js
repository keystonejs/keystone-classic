import React from 'react';
import ItemsTableCell from '../../components/ItemsTableCell';
import ItemsTableValue from '../../components/ItemsTableValue';

var InvalidColumn = React.createClass({
	displayName: 'InvalidColumn',
	propTypes: {
		col: React.PropTypes.object,
	},
	renderValue () {
		return (
			<ItemsTableValue field={this.props.col.type}>
				(Invalid Type: {this.props.col.type})
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

module.exports = InvalidColumn;
