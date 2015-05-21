var React = require('react');

var TextArrayColumn = React.createClass({

	render: function() {
		var value = this.props.data.fields[this.props.col.path];
		if (value.length > 0) {
			return (
				<td>
					{ value.map(function(date) {
						return <div className="ItemList__col-value" key={date.id}>{date}</div>;
					})}	
				</td>
			);
		} else {
			return (
				<td><div className="ItemList__col-value"></div></td>
			);
		}
	}
	
});

module.exports = TextArrayColumn;
