var React = require('react');

var CloudinaryimageColumn = React.createClass({

	render: function() {
		var value = this.props.data.fields[this.props.col.path];
		console.log(value);
		if (value) {
			return (
				<td>
					<div className='col-value'>{value.url}</div>
				</td>
			)
		} else {
			return (
				<td>
					<div className='col-value'></div>
				</td>
			)
		}
		
	},
});

module.exports = CloudinaryimageColumn;