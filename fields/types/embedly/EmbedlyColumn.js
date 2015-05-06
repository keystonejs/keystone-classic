var React = require('react');

var EmbedlyColumn = React.createClass({

	render: function() {
		var value = this.props.data.fields[this.props.col.path];
		if (value && Object.keys(value).length !== 0) {
			var limitedValue = value.html.substring(0, 500);
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

module.exports = EmbedlyColumn;
