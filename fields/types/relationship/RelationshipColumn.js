var React = require('react');
var classnames = require('classnames');

var TextColumn = React.createClass({
	propTypes: {
		col: React.PropTypes.object,
		list: React.PropTypes.object,
		data: React.PropTypes.object,
		href: React.PropTypes.string
	},
	renderCell (children) {
		return <td className="ItemList__col">{children}</td>;
	},
	renderNoValue () {
		return (
			<div className="ItemList__value ItemList__value--relationship">
				&nbsp;
			</div>
		);
	},
	renderMany (value) {
		var items = [];
		for (var i = 0; i < 3; i++) {
			if (!value[i]) break;
			if (i) {
				items.push(<span key={'comma' + i}>, </span>);
			}
			items.push(this.renderValue(value[i]));
		}
		if (value.length > 3) {
			items.push(<span key="more" className="ItemList__more-indicator">[...{value.length - 3} more]</span>);
		}
		return items;
	},
	renderValue (value) {
		var refList = this.props.col.field.refList;
		var className = classnames('ItemList__value ItemList__value--relationship ItemList__link--interior', {
			'ItemList__link--padded': !this.props.col.field.many
		});
		return (
			<a href={'/keystone/' + refList.path + '/' + value.id} key={value.id} className={className}>
				{value.name}
			</a>
		);
	},
	render: function() {
		var value = this.props.data.fields[this.props.col.path];
		var many = this.props.col.field.many;
		if (!value || (many && !value.length)) return this.renderCell(this.renderNoValue());
		return this.renderCell(many ? this.renderMany(value) : this.renderValue(value));
	}
});

module.exports = TextColumn;
