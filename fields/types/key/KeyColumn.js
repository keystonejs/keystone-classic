var React = require('react');

var KeyColumn = React.createClass({
	render: function() {
		var value = this.props.data.fields[this.props.col.path];
		return (
			<td>
				<div className='ItemList__value'>{value ? value : null}</div>
			</td>
		);
	}
});

module.exports = KeyColumn;
