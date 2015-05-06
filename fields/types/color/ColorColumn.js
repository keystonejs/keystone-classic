var React = require('react');

var ColorColumn = React.createClass({

	render: function() {
		var value = this.props.data.fields[this.props.col.path];
		var divColorBox = {
			backgroundColor: value,
			borderRadius: '5px',
			height: '20px',
			width: '20px'
		};
		if (value) {
			return (
				<td>
					<div className="col-value"><div style={divColorBox}></div></div>
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

module.exports = ColorColumn;
