var React = require('react');

var LocalFileColumn = React.createClass({
	renderValue: function () {
		var value = this.props.data.fields[this.props.col.path];
		if (!value || !_.size(value)) return;
		return value.path + '/' + value.filename;
	},
	render: function () {
		return (
			<td className="ItemList__col">
				<div className="ItemList__value ItemList__value--local-file">{this.renderValue()}</div>
			</td>
		);
	},
});

module.exports = LocalFileColumn;
