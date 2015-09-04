var React = require('react');

var NameColumn = React.createClass({
	renderValue: function() {
		var value = this.props.data.fields[this.props.col.path];
		if (!value || (!value.first && !value.last)) return '(no name)';
		return [value.first, value.last].filter(i => i).join(' ');
	},
	renderText () {
		return (
			<div className="ItemList__value ItemList__value--name">
				{this.renderValue()}
			</div>
		);
	},
	renderLink () {
		return (
			<a href={this.props.linkTo} className="ItemList__value ItemList__value--name ItemList__link--padded ItemList__link--interior">
				{this.renderValue()}
			</a>
		);
	},
	render: function() {
		return (
			<td className="ItemList__col">
				{this.props.linkTo ? this.renderLink() : this.renderText()}
			</td>
		);
	}
});

module.exports = NameColumn;
