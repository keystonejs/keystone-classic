var React = require('react');
var numeral = require('numeral');

var MoneyColumn = React.createClass({
	render: function() {
		var value = this.props.data.fields[this.props.col.path];
		var formattedValue = numeral(value).format('$0,0.00');
		return (
			<td className="ItemList__col">
				<div className="ItemList__value ItemList__value--money">{formattedValue ? formattedValue : null}</div>
			</td>
		);
	}
});

module.exports = MoneyColumn;
