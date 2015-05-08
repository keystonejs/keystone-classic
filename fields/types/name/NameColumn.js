var React = require('react');
var _ = require('underscore');

var NameColumn = React.createClass({

	render: function() {
		var value = this.props.data.fields[this.props.col.path];
		if (!value || !_.size(value)) return;
		return (
			<td>
				<div className="col-value"><a href={'/keystone/users/'+ this.props.data.id}>{value.first + ' ' + value.last}</a></div>
			</td>
		);
	}
});

module.exports = NameColumn;
