var React = require('react');

var ColorColumn = React.createClass({

	render: function() {
		var value = this.props.data.fields[this.props.col.path];

		if (!value) {
			return (
				<td>
					<div className="ItemList__col-value"></div>
				</td>
			);
		}

		var colorBoxStyle = {
			display: 'inline-block',
			backgroundColor: value,
			borderRadius: '5px',
			marginRight: '10px',
			height: '20px',
			width: '20px'
		};
		
		return (
			<td>
				<div className="ItemList__col-value"><span style={colorBoxStyle}></span>{value}</div>
			</td>
		);
	}
});

module.exports = ColorColumn;
