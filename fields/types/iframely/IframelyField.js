import React from 'react';
import Field from '../Field';
import { FormField, FormInput } from '../../../admin/client/App/elemental';
import ImageThumbnail from '../../components/ImageThumbnail';
import NestedFormField from '../../components/NestedFormField';

module.exports = Field.create({

	displayName: 'IframelyField',
	statics: {
		type: 'Iframely',
		getDefaultValue: () => ({}),
	},

	// always defers to renderValue; there is no form UI for this field
	renderField () {
		return this.renderValue();
	},

	renderValue (path, label, multiline) {
		const { value } = this.props;
		return (
			<NestedFormField key={path} label={label}>
				<FormInput noedit multiline={multiline}>
					{value[path]}
				</FormInput>
			</NestedFormField>
		);
	},
	renderAuthor () {
		const { authorName, authorUrl } = this.props.value;
		if (!authorName) return;
		return (
			<NestedFormField key="author" label="Author">
				<FormInput
					noedit
					href={authorUrl && authorUrl}
					target="_blank"
					rel="noopener noreferrer"
				>
					{authorName}
				</FormInput>
			</NestedFormField>
		);
	},
	renderDimensions () {
		const { width, height } = this.props.value;
		if (!width || !height) return;
		return (
			<NestedFormField key="dimensions" label="Dimensions">
				<FormInput noedit>{width} &times; {height}px</FormInput>
			</NestedFormField>
		);
	},
	renderPreview () {
		const { thumbnailUrl, thumbnailWidth, thumbnailHeight, url } = this.props.value;
		if (!thumbnailUrl) return;

		const image = <img width={thumbnailWidth} height={thumbnailHeight} src={thumbnailUrl} />;

		var preview = url ? (
			<ImageThumbnail component="a" href={url} target="_blank">
				{image}
			</ImageThumbnail>
		) : (
			<ImageThumbnail>{image}</ImageThumbnail>
		);

		return (
			<NestedFormField label="Preview">
				{preview}
			</NestedFormField>
		);
	},

	renderUI () {
		const { value, label } = this.props;
		if (!value.exists) {
			return (
				<FormField label={label}>
					<FormInput noedit>(not set)</FormInput>
				</FormField>
			);
		}
		return (
			<div>
				<FormField key="provider" label={label}>
					<FormInput noedit>{value.providerName} {value.type}</FormInput>
				</FormField>
				{this.renderValue('title', 'Title')}
				{this.renderAuthor()}
				{this.renderValue('description', 'Description', true)}
				{this.renderPreview()}
				{this.renderDimensions()}
			</div>
		);
	},
});
