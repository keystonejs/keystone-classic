var React = require('react');

var UrlColumn = React.createClass({

	render: function() {
		var value = this.props.data.fields[this.props.col.path];
		if (value) {
			return (
				<td>
					<a href={value} target="_blank">{value}</a>
				</td>
			)
		} else {
			return (
				<td></td>
			)
		}	
	}
	
});

module.exports = UrlColumn;