var React = require('react');

var CodeColumn = React.createClass({

	render: function() {
		var value = this.props.data.fields[this.props.col.path];
		if (value) {
			var limitedValue = value.substring(0, 500);
			return (
				<td className='col-value'>{limitedValue}</td>
			)
		} else {
			return (
				<td className='col-value'></td>
			)
		}
		
	},
});

module.exports = CodeColumn;