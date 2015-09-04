var React = require('react');
var _ = require('underscore');

var MarkdownColumn = React.createClass({
	renderValue: function() {
		var value = this.props.data.fields[this.props.col.path];
		if (!value || !_.size(value)) return;
		return value.md.substring(0, 500);
	},
	render: function() {
		return (
			<td className="ItemList__col">
				<div className="ItemList__value ItemList__value--markdown">{this.renderValue()}</div>
			</td>
		);
	}
});

module.exports = MarkdownColumn;
