var React = require('react');

var HtmlColumn = React.createClass({

	render: function() {
		var value = this.props.data.fields[this.props.col.path];
		if (value) {
			var limitedValue = value.substring(0, 500);
			return (
				<td>
					<div className='col-value'>{limitedValue}</div>
				</td>
			);
		} else {
			return (
				<td>
					<div className='col-value'></div>
				</td>
			);
		}
		
	}
});

module.exports = HtmlColumn;
