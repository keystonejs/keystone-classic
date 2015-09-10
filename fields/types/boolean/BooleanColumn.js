import React from 'react';
import classnames from 'classnames';
import ItemsTableCell from '../../../admin/src/components/ItemsTableCell';
import ItemsTableValue from '../../../admin/src/components/ItemsTableValue';

var BooleanColumn = React.createClass({
	displayName: 'BooleanColumn',
	propTypes: {
		col: React.PropTypes.object,
		data: React.PropTypes.object,
	},
	renderValue () {
		let value = this.props.data.fields[this.props.col.path];
		let iconClassName = classnames('ItemList__boolean-check octicon', {
			'is-checked octicon-check': value,
			'octicon-x': !value
		});
		return (
			<ItemsTableValue truncate={false} field={this.props.col.type}>
				<span className={iconClassName} />
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

module.exports = BooleanColumn;
