var React = require('react');

var LocalFilesColumn = React.createClass({

	render: function() {
		var value = this.props.data.fields[this.props.col.path];
		if (value.length > 0) {
			var fileOrFiles = (value.length > 1) ? 'Files' : 'File'; 
			return (
				<td>
					<div className="col-value">{value.length + ' ' + fileOrFiles} </div>
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

module.exports = LocalFilesColumn;
