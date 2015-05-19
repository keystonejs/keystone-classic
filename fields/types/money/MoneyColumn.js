var React = require('react');
var numeral = require('numeral');

var MoneyColumn = React.createClass({

	render: function() {
		var value = this.props.data.fields[this.props.col.path];
		var formattedValue = numeral(value).format('$0,0.00');
		return (
			<td>
				<div className="col-value">{formattedValue ? formattedValue : null}</div>
			</td>
		);
	}
	
});

module.exports = MoneyColumn;
