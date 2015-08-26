var React = require('react');

var BooleanColumn = React.createClass({
	render: function() {
		var value = this.props.data.fields[this.props.col.path];
		var iconClassName = 'octicon ' + (value ? 'octicon-check' : 'octicon-x');
		return (
			<td>
				<span className="ItemList__boolean-check">
					<span className={iconClassName} />
				</span>
			</td>
		);
	}
});

module.exports = BooleanColumn;
