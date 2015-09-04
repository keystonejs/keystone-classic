var React = require('react');

var IdColumn = React.createClass({
	propTypes: {
		list: React.PropTypes.object,
		data: React.PropTypes.object
	},
	render: function() {
		var className = 'ItemList__value ItemList__value--id';
		return (
			<td>
				<a href={'/keystone/' + this.props.list.path + '/' + this.props.data.id} className={className}>
					{this.props.data.id}
				</a>
			</td>
		);
	}
});

module.exports = IdColumn;
