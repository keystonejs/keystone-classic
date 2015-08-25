var React = require('react');
var moment = require('moment');

var DateColumn = React.createClass({
	render: function() {
		var value = this.props.data.fields[this.props.col.path];
		var formattedValue = moment(value).format('MMMM Do YYYY');
		return (
			<td>
				<div className="ItemList__col-value">{formattedValue ? formattedValue : null}</div>
			</td>
		);
	}
});

module.exports = DateColumn;
