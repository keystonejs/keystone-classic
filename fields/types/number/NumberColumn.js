var React = require('react');

var NumberColumn = React.createClass({
	render: function() {
		var value = this.props.data.fields[this.props.col.path];
		return (
			<td className="ItemList__col">
				<div className="ItemList__value ItemList__value--number">{ !isNaN(value) ? value : null }</div>
			</td>
		);
	}
});

module.exports = NumberColumn;
