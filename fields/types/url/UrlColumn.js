var React = require('react');

var UrlColumn = React.createClass({

	render: function() {
		var value = this.props.data.fields[this.props.col.path];
		if (value) {
			return (
				<td>
					<div className="col-value"><a href={value} target="_blank">{value}</a></div>
				</td>
			)
		} else {
			return (
				<td><div className="col-value"></div></td>
			)
		}	
	}
	
});

module.exports = UrlColumn;