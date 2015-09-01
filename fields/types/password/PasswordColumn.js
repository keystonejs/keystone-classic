var React = require('react');

var PasswordColumn = React.createClass({
	render: function() {
		var value = this.props.data.fields[this.props.col.path];
		return (
			<td>
				<div className="ItemList__col-value">{value ? '*****' : ''}</div>
			</td>
		);
	}
});

module.exports = PasswordColumn;
