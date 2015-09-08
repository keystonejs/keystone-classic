import React from 'react';
import ItemsTableCell from '../../../admin/src/components/ItemsTableCell';
import ItemsTableValue from '../../../admin/src/components/ItemsTableValue';

var MarkdownColumn = React.createClass({
	displayName: 'MarkdownColumn',
	propTypes: {
		col: React.PropTypes.object,
		data: React.PropTypes.object,
	},
	renderValue: function() {
		let value = this.props.data.fields[this.props.col.path];
		return (value && Object.keys(value).length) ? value.md.substr(0, 100) : null;
	},
	render: function() {
		return (
			<ItemsTableCell>
				<ItemsTableValue field={this.props.col.path}>
					{this.renderValue()}
				</ItemsTableValue>
			</ItemsTableCell>
		);
	}
});

module.exports = MarkdownColumn;
