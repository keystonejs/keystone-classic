var React = require('react');
var moment = require('moment');

var DateColumn = React.createClass({
	render: function() {
		var value = this.props.data.fields[this.props.col.path];
		var formattedValue = moment(value).format('MMMM Do YYYY');
		return (
			<td className="ItemList__col">
				<div className="ItemList__value ItemList__value--date">{formattedValue ? formattedValue : null}</div>
			</td>
		);
	}
});

module.exports = DateColumn;
