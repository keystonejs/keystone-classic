var React = require('react');

var EmailColumn = React.createClass({
	renderValue: function() {
		var value = this.props.data.fields[this.props.col.path];
		if (!value) return;
		return <a href={'mailto:'+ value} className="ItemList__col-value ItemList__col-value--email ItemList__col-link" target="_blank">{value}</a>;
	},
	render: function() {
		return (
			<td>
				{this.renderValue()}
			</td>
		);
	}
});

module.exports = EmailColumn;
