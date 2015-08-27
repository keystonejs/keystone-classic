var React = require('react');

var TextColumn = React.createClass({
	propTypes: {
		col: React.PropTypes.object,
		list: React.PropTypes.object,
		data: React.PropTypes.object,
		href: React.PropTypes.string
	},
	renderNoValue () {
		return (
			<div className="ItemList__col-value">
				&nbsp;
			</div>
		);
	},
	renderValue () {
		var refList = this.props.col.field.refList;
		var value = this.props.data.fields[this.props.col.path];
		return (
			<a href={'/keystone/' + refList.path + '/' + value} className="ItemList__col-value">
				{value}
			</a>
		);
	},
	render: function() {
		var value = this.props.data.fields[this.props.col.path];
		return (
			<td>
				{value ? this.renderValue() : this.renderNoValue()}
			</td>
		);
	}
});

module.exports = TextColumn;
