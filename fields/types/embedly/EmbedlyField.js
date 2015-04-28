var React = require('react'),
	Field = require('../Field');

module.exports = Field.create({
	
	displayName: 'EmbedlyField',
	
	// always defers to renderValue; there is no form UI for this field
	renderField: function() {
		return this.renderValue();
	},
	
	renderValue: function() {
		
		if (!this.props.value.exists) {
			return <div className="field-value">(not set)</div>;
		}
		
		var imagePreview = this.props.value.thumbnailUrl ? (
				<div className="image-preview">
					<a href={this.props.value.url} className="img-thumbnail">
						<img width={this.props.value.thumbnailWidth} height={this.props.value.thumbnailHeight} src={this.props.value.thumbnailUrl} />
					</a>
				</div>
			) : null;
		
		// TODO review this return statement
		return (
			<div>
				<div className="field-value">{this.props.value.providerName} {this.props.value.type}</div>
				<div className="field-value">{this.props.value.url}</div>
				{imagePreview}
			</div>
		);
		
		// if item.get(field.paths.exists)
		// 	.field-value= item.get(field.paths.providerName) + ' ' + utils.upcase(item.get(field.paths.type))
		// 	.field-value= item.get(field.paths.url)
		// 	if item.get(field.paths.thumbnailUrl)
		// 		.image-preview
		// 			a(href=item.get(field.paths.url), rel=field.path).img-thumbnail
		// 				img(width=item.get(field.paths.thumbnailWidth), height=item.get(field.paths.thumbnailHeight), src=item.get(field.paths.thumbnailUrl))
		
		//return <div className="field-value">{this.props.value}</div>;
		
	}
	
});
