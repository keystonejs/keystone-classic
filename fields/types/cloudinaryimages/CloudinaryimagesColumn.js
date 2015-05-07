var React = require('react');

var CloudinaryimagesColumn = React.createClass({

	render: function() {
		var value = this.props.data.fields[this.props.col.path];
		if (value.length > 0) {
			return (
				<td>
					{value.map(function(image) {
 						return <div className="col-value" key={image.id}><a href={image.url}>{image.url}</a></div>;
 					})}
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

module.exports = CloudinaryimagesColumn;
