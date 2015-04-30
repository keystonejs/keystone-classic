var React = require('react');

var BooleanColumn = React.createClass({

	render: function() {
		var value = this.props.data.fields[this.props.col.path];
		if (value === true) {
			return (
				<td>
					<img src="/keystone/images/icons/16/checkbox-checked.png" width="16" height="16" />
				</td>
			);
		 } else {
			return (
				<td>
					<img src="/keystone/images/icons/16/checkbox-unchecked.png" width="16" height="16" />
				</td>
			)
		}
	},
});

module.exports = BooleanColumn;