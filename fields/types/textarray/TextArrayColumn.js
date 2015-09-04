var React = require('react');

var TextArrayColumn = React.createClass({
	render: function() {
		var value = this.props.data.fields[this.props.col.path];
		if (value.length > 0) {
			return (
				<td className="ItemList__col">
					{ value.map(function(date) {
						return <div className="ItemList__value ItemList__value--text-array" key={date.id}>{date}</div>;
					})}
				</td>
			);
		} else {
			return (
				<td className="ItemList__col">
					<div className="ItemList__value ItemList__value--text-array"></div>
				</td>
			);
		}
	}
});

module.exports = TextArrayColumn;
