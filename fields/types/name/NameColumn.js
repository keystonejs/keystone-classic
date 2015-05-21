var React = require('react');
var _ = require('underscore');

var NameColumn = React.createClass({

	renderValue: function() {
		var value = this.props.data.fields[this.props.col.path];
		if (!value || !_.size(value)) return;

		return <a href={'/keystone/' + this.props.list.path + '/' + this.props.data.id} className="ItemList__col-value ItemList__col-value--name">{value.first + ' ' + value.last}</a>
	},

	render: function() {
		return (
			<td>
				{this.renderValue()}
			</td>
		);
	}
});

module.exports = NameColumn;
