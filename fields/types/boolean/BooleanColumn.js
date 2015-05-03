var React = require('react');

var BooleanColumn = React.createClass({
	render: function() {
		var value = this.props.data.fields[this.props.col.path];
		var imgSrc = '/keystone/images/icons/16/checkbox-' + (value ? '' : 'un') + 'checked.png';
		return (
			<td>
				<img src={imgSrc} width="16" height="16" />
			</td>
		);
	},
});

module.exports = BooleanColumn;
