var React = require('react');
var _ = require('underscore');

var NameColumn = React.createClass({

	renderValue: function() {
		var value = this.props.data.fields[this.props.col.path];
		if (!value || !_.size(value)) return;

		return <a href={'/keystone/users/'+ this.props.data.id}>{value.first + ' ' + value.last}</a>
	},

	render: function() {
		return (
			<td>
				<div className="col-value">{this.renderValue()}</div>
			</td>
		);
	}
});

module.exports = NameColumn;
