var React = require('react');

var PasswordColumn = React.createClass({
	render: function() {
		var value = this.props.data.fields[this.props.col.path];
		return (
			<td className="ItemList__col">
				<div className="ItemList__value ItemList__value--password">{value ? '********' : ''}</div>
			</td>
		);
	}
});

module.exports = PasswordColumn;
