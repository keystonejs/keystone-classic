var React = require('react');

var EmailColumn = React.createClass({

	render: function() {
		var value = this.props.data.fields[this.props.col.path];
		if (value) {
			return (
				<td>
					<div className="col-value"><a href={'mailto:'+ {value}} target="_blank">{value}</a></div>
				</td>
			);
		} else {
			return (
				<td></td>
			);
		}	
	}
	
});

module.exports = EmailColumn;
