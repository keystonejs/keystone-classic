var React = require('react');

var NumberColumn = React.createClass({
	render: function() {
		var value = this.props.data.fields[this.props.col.path];
		return (
			<td>
				<div className="ItemList__col-value">{ !isNaN(value) ? value : null }</div>
			</td>
		);
	}
});

module.exports = NumberColumn;
