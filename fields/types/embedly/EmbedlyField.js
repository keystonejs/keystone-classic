var React = require('react');
var Field = require('../Field');

var FormField = require('elemental').FormField;
var FormInput = require('elemental').FormInput;

module.exports = Field.create({
	
	displayName: 'EmbedlyField',
	
	// always defers to renderValue; there is no form UI for this field
	renderField: function() {
		return this.renderValue();
	},
	
	renderValue: function(path, label, multiline) {
		return (
			<FormField key={path} label={label} className="form-field--secondary">
				<FormInput noedit multiline={multiline}>{this.props.value[path]}</FormInput>
			</FormField>
		);
	},
	renderAuthor: function() {
		if (!this.props.value.authorName) return;
		return (
			<FormField key="author" label="Author" className="form-field--secondary">
				<FormInput noedit href={this.props.value.authorUrl && this.props.value.authorUrl} target="_blank">{this.props.value.authorName}</FormInput>
			</FormField>
		);
		
	},
	renderDimensions: function() {
		if (!this.props.value.width || !this.props.value.height);
		return (
			<FormField key="dimensions" label="Dimensions" className="form-field--secondary">
				<FormInput noedit>{this.props.value.width} &times; {this.props.value.height}px</FormInput>
			</FormField>
		);
		
	},
	renderPreview: function() {
		if (!this.props.value.thumbnailUrl) return;
		
		var image = <img width={this.props.value.thumbnailWidth} height={this.props.value.thumbnailHeight} src={this.props.value.thumbnailUrl} />;
		
		var preview = this.props.value.url ? (
			<a href={this.props.value.url} target="_blank" className="img-thumbnail">{image}</a>
		) : (
			<div className="img-thumbnail">{image}</div>
		);

		return (
			<FormField label="preview" label="Preview" className="form-field--secondary">
				{preview}
			</FormField>
		);
		
	},

	renderUI: function() {
		if (!this.props.value.exists) {
			return (
				<FormField label={this.props.label}>
					<FormInput noedit>(not set)</FormInput>
				</FormField>
			);
		}
		
		return (
			<div className="field-type-embedly field-size-full">
				<FormField key="provider" label={this.props.label}>
					<FormInput noedit>{this.props.value.providerName} {this.props.value.type}</FormInput>
				</FormField>
				{this.renderValue('title', 'Title')}
				{this.renderAuthor()}
				{this.renderValue('description', 'Description', true)}
				{this.renderPreview()}
				{this.renderDimensions()}
			</div>
		);
		
	}
	
});
