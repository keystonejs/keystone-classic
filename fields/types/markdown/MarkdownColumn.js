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
			<td>
				<div className="col-value">{this.renderValue()}</div>
			</td>
		);
	}
});

module.exports = MarkdownColumn;
