var React = require('react');

var GeoPointColumn = React.createClass({

	render: function() {
		var value = this.props.data.fields[this.props.col.path];
		if (value.length > 0) {
			return (
				<td>
					<div className="col-value">Lat: {value[1]} Lng: {value[0]} </div>
				</td>
			);
		} else {
			return (
				<td>
					<div className="col-value"></div>
				</td>
			);
		}	
	}
	
});

module.exports = GeoPointColumn;
