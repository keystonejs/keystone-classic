var React = require('react');

var EmbedlyColumn = React.createClass({

	render: function() {
		var value = this.props.data.fields[this.props.col.path];
		if (value && Object.keys(value).length !== 0) {
			return (
				<td>
					<div className='col-value'><a href={value.url} target='_blank'>{value.url}</a></div>
				</td>
			);
		} else {
			return (
				<td>
					<div className='col-value'></div>
				</td>
			);
		}
		
	}
});

module.exports = EmbedlyColumn;
