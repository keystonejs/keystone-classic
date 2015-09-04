var React = require('react');

var IdColumn = React.createClass({
	propTypes: {
		col: React.PropTypes.object,
		list: React.PropTypes.object,
		data: React.PropTypes.object
	},
	render: function() {
		return (
			<td className="ItemList__col">
				<div className="ItemList__value ItemList__value--invalid">
					(Invalid Type: {this.props.col.type})
				</div>
			</td>
		);
	}
});

module.exports = IdColumn;
