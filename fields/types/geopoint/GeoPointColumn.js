var React = require('react');

var GeoPointColumn = React.createClass({
	render: function() {
		var value = this.props.data.fields[this.props.col.path];
		if (value.length > 0) {
			return (
				<td className="ItemList__col">
					<div className="ItemList__value ItemList__value--geo-point">Lat: {value[1]} Lng: {value[0]} </div>
				</td>
			);
		} else {
			return (
				<td className="ItemList__col">
					<div className="ItemList__value ItemList__value--geo-point"></div>
				</td>
			);
		}
	}
});

module.exports = GeoPointColumn;
