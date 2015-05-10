var React = require('react');

var EmailColumn = React.createClass({

	renderValue: function() {
		var value = this.props.data.fields[this.props.col.path];
		if (!value) return

		return <a href={'mailto:'+ value} target="_blank">{value}</a>
	},

	render: function() {
		return (
			<td>
				<div className="col-value">{this.renderValue()}</div>
			</td>
		);	
	}
	
});

module.exports = EmailColumn;
