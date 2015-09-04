var React = require('react');

var EmailColumn = React.createClass({
	renderValue: function() {
		var value = this.props.data.fields[this.props.col.path];
		if (!value) return;
		return <a href={'mailto:'+ value} className="ItemList__value ItemList__value--email ItemList__link--padded ItemList__link--exterior">{value}</a>;
	},
	render: function() {
		return (
			<td className="ItemList__col">
				{this.renderValue()}
			</td>
		);
	}
});

module.exports = EmailColumn;
