var React = require('react');

var SelectColumn = React.createClass({
	renderValue () {
		var value = this.props.data.fields[this.props.col.path];
		var option = this.props.col.field.ops.filter(i => i.value === value)[0];
		return option ? <span>{option.label}</span> : '';
	},
	render () {
		return (
			<td>
				<div>{this.renderValue()}</div>
			</td>
		);
	}
});

module.exports = SelectColumn;
