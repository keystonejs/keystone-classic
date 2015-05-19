var React = require('react');

var DateArrayColumn = React.createClass({

	render: function() {
		var value = this.props.data.fields[this.props.col.path];
		if (value.length > 0) {
			return (
				<td>
					{ value.map(function(date) {
						return <div className="col-value" key={date.id}>{date}</div>;
					})}	
				</td>
			);
		} else {
			return (
				<td><div className="col-value"></div></td>
			);
		}
	}
	
});

module.exports = DateArrayColumn;
