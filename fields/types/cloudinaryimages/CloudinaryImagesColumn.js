var React = require('react');

var CloudinaryimagesColumn = React.createClass({
	render: function() {
		var value = this.props.data.fields[this.props.col.path];
		if (value.length > 0) {
			return (
				<td className="ItemList__col">
					{value.map(function(image) {
						return <div className="ItemList__value ItemList__value--cloudinary-images" key={image.id}><a href={image.url}>{image.url}</a></div>;
					})}
				</td>
			);
		} else {
			return (
				<td className="ItemList__col">
					<div className="ItemList__value ItemList__value--cloudinary-images"></div>
				</td>
			);
		}
	}
});

module.exports = CloudinaryimagesColumn;
