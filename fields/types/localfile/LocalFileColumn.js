var React = require('react');

var LocalFileColumn = React.createClass({

	render: function() {
		var value = this.props.data.fields[this.props.col.path];
		if (value && Object.keys(value).length !== 0) {
			return (
				<td>
					<div className="col-value">{value.path + '/' + value.filename}</div>
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

module.exports = LocalFileColumn;
