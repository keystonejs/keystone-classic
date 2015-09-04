var _ = require('underscore');
var React = require('react');

var LocationColumn = React.createClass({
	renderValue: function() {
		var value = this.props.data.fields[this.props.col.path];
		if (!value || !_.size(value)) return;
		var output = [];
		_.each(['street1', 'suburb', 'state', 'postcode', 'country'], function(i) {
			if (value[i]) {
				output.push(value[i]);
			}
		});
		return output.join(', ');
	},
	render: function() {
		return (
			<td className="ItemList__col">
				<div className="ItemList__value ItemList__value--location">{this.renderValue()}</div>
			</td>
		);
	}
});

module.exports = LocationColumn;
