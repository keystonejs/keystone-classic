var React = require('react');

var IdColumn = React.createClass({
	propTypes: {
		list: React.PropTypes.object,
		data: React.PropTypes.object
	},
	render: function() {
		var className = 'ItemList__value ItemList__value--id ItemList__link--padded ItemList__link--interior';
		return (
			<td className="ItemList__col">
				<a href={'/keystone/' + this.props.list.path + '/' + this.props.data.id} className={className}>
					{this.props.data.id}
				</a>
			</td>
		);
	}
});

module.exports = IdColumn;
