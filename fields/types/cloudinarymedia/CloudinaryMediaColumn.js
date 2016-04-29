import React from 'react';
import CloudinaryMediaSummary from '../../components/columns/CloudinaryImageSummary';
import ItemsTableCell from '../../../admin/client/components/ItemsTable/ItemsTableCell';
import ItemsTableValue from '../../../admin/client/components/ItemsTable/ItemsTableValue';

var CloudinaryMediaColumn = React.createClass({
	displayName: 'CloudinaryMediaColumn',
	propTypes: {
		col: React.PropTypes.object,
		data: React.PropTypes.object,
	},
	renderValue: function () {
		var value = this.props.data.fields[this.props.col.path];
		if (!value || !Object.keys(value).length) return;

		return (
			<ItemsTableValue field={this.props.col.type}>
				<CloudinaryMediaSummary label="dimensions" image={value} />
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

module.exports = CloudinaryMediaColumn;
