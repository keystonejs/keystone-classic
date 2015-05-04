var React = require('react');

var LocationColumn = React.createClass({

	render: function() {
		var value = this.props.data.fields[this.props.col.path];
		if (Object.keys(value).length != 0) {
			return (
				<td>
					<div className='col-value'>{value.street1 + ', ' + value.suburb + ', ' + value.state + ', ' + value.postcode + ', ' + value.country}</div>
				</td>
			)	
		} else {
			return (
				<td className='col-value'></td>
			)
		}	
	}
	
});

module.exports = LocationColumn;