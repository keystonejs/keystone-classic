var React = require('react');

var TextColumn = React.createClass({

	propTypes: {
		col: React.PropTypes.obj,
		list: React.PropTypes.obj,
		data: React.PropTypes.obj,
		href: React.PropTypes.string
	},

	renderValue: function() {
		var value = this.props.data.fields[this.props.col.path];
		var className = 'ItemList__col-value';
		if (this.props.col.isName) className += ' ItemList__col-value--name';
		
		if (this.props.col.isName) {
			return (
				<a href={'/keystone/' + this.props.list.path + '/' + this.props.data.id} className={className}>
					{value}
				</a>
			);
		} else {
			return (
				<div className="ItemList__col-value">
					{value}
				</div>
			);
		}
	},

	render: function() {
		return (
			<td>
				{this.renderValue()}
			</td>
		);
	}

});

module.exports = TextColumn;
