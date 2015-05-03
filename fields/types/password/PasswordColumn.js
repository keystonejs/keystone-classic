var React = require('react');

var PasswordColumn = React.createClass({

	render: function() {
		var value = this.props.data.fields[this.props.col.path];
		if (value) {
			return (
				<td>
					<p>******</p>
				</td>
			)
		} else {
			return (
				<td>
					<p></p>
				</td>
			)
		}	
	}
	
});

module.exports = PasswordColumn;