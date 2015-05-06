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
		if (this.props.col.isName) {
			return (
				<a href={'/keystone/' + this.props.list.path + '/' + this.props.data.id}>
					{value}
				</a>
			);
		} else {
			return (
				<div className="col-value">
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
