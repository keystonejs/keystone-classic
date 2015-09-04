var React = require('react');

var HtmlColumn = React.createClass({
	renderValue: function() {
		var value = this.props.data.fields[this.props.col.path];
		if (!value || !_.size(value)) return;
		return value.substring(0, 500);
	},
	render: function() {
		return (
			<td>
				<div className='ItemList__value'>{this.renderValue()}</div>
			</td>
		);
	}
});

module.exports = HtmlColumn;
