var React = require('react');

var NameColumn = React.createClass({

	render: function() {
		var value = this.props.data.fields[this.props.col.path];
		if (value) {
			return (
				<td>
					<div className="col-value">{value.first + ' ' + value.last}</div>
				</td>
			)
		} else {
			return (
				<td>
					<div className="col-value"></div>
				</td>
			)
		}
	}
});

module.exports = NameColumn;