var React = require('react');

var TextColumn = React.createClass({
	propTypes: {
		col: React.PropTypes.object,
		list: React.PropTypes.object,
		data: React.PropTypes.object,
		href: React.PropTypes.string
	},
	renderCell (children) {
		return <td>{children}</td>;
	},
	renderNoValue () {
		return (
			<div className="ItemList__col-value">
				&nbsp;
			</div>
		);
	},
	renderMany (value) {
		var items = [];
		for (var i = 0; i < 3; i++) {
			if (!value[i]) break;
			if (i) {
				items.push(<span key={'comma' + i} className="ItemList__col-separator">, </span>);
			}
			items.push(this.renderValue(value[i]));
		}
		if (items.length > 3) {
			items.push(<span key="more" className="ItemList__col-more">{items.length - 3} more</span>);
		}
		return items;
	},
	renderValue (value) {
		var refList = this.props.col.field.refList;
		return (
			<a href={'/keystone/' + refList.path + '/' + value.id} key={value.id}>
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
