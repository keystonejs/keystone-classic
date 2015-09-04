var React = require('react');

var TextColumn = React.createClass({
	propTypes: {
		col: React.PropTypes.object,
		list: React.PropTypes.object,
		data: React.PropTypes.object,
		href: React.PropTypes.string
	},
	renderValue: function() {
		return this.props.data.fields[this.props.col.path];
	},
	renderText () {
		return (
			<div className="ItemList__value ItemList__value--text">
				{this.renderValue()}
			</div>
		);
	},
	renderLink () {
		return (
			<a href={this.props.linkTo} className="ItemList__value ItemList__value--text ItemList__link--padded ItemList__link--interior">
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

module.exports = TextColumn;
