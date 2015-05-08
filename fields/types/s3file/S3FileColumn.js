var React = require('react');

var S3FileColumn = React.createClass({

	render: function() {
		var value = this.props.data.fields[this.props.col.path];
		return (
			<td>
				<div className="col-value"><a href={value.url} target='_blank'>{ value ? value.url : null }</a></div>
			</td>
		);	
	}
	
});

module.exports = S3FileColumn;
