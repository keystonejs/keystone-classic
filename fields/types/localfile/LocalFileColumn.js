var React = require('react');
var _ = require('underscore');

var LocalFileColumn = React.createClass({

	renderValue: function() {
		var value = this.props.data.fields[this.props.col.path];
		if (!value || !_.size(value)) return;

		return value.path + '/' + value.filename
	},

	render: function() {
		return (
			<td>
				<div className="col-value">{this.renderValue()}</div>
			</td>
		);	
	}
	
});

module.exports = LocalFileColumn;
