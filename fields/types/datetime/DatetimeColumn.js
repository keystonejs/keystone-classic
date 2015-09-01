var React = require('react');
var moment = require('moment');

var DatetimeColumn = React.createClass({
	render: function() {
		var value = this.props.data.fields[this.props.col.path];
		var formattedValue = moment(value).format('MMMM Do YYYY, h:mm:ss a');
		return (
			<td>
				<div className="ItemList__col-value">{formattedValue ? formattedValue : null}</div>
			</td>
		);
	}
});

module.exports = DatetimeColumn;
