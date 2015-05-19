var React = require('react');
var _ = require('underscore');

var LocalFilesColumn = React.createClass({

	renderValue: function() {
		var value = this.props.data.fields[this.props.col.path];
		if (value.length === 0) return
		var fileOrFiles = (value.length > 1) ? 'Files' : 'File'; 
		return value.length + ' ' + fileOrFiles
	},

	render: function() {
		return (
			<td>
				<div className="col-value">{this.renderValue()}</div>
			</td>
		);
	}
	
});

module.exports = LocalFilesColumn;
