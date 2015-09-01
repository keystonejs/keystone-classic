var React = require('react');
var classnames = require('classnames');

var BooleanColumn = React.createClass({
	render: function() {
		var value = this.props.data.fields[this.props.col.path];
		var iconClassName = classnames('ItemList__boolean-check octicon', {
			'is-checked octicon-check': value,
			'octicon-x': !value
		});
		return (
			<td>
				<span className={iconClassName} />
			</td>
		);
	}
});

module.exports = BooleanColumn;
