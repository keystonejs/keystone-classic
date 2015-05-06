var React = require('react');
var moment = require('moment');

var DateColumn = React.createClass({

	render: function() {
		var value = this.props.data.fields[this.props.col.path];
		var formattedValue = moment(value).format('MMMM Do YYYY');
		if (value) {
			return (
				<td>
					<div className="col-value">{formattedValue}</div>
				</td>
			);
		} else {
			return (
				<td>
					<div className="col-value"></div>
				</td>
			);
		}
	}
	
});

module.exports = DateColumn;
