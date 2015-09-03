import _ from 'underscore';
import React from 'react';
import Field from '../Field';
import { Button, FormField, FormInput, FormNote } from 'elemental';

const SUPPORTED_TYPES = ['image/gif', 'image/png', 'image/jpeg', 'image/bmp', 'image/x-icon', 'application/pdf', 'image/x-tiff', 'image/x-tiff', 'application/postscript', 'image/vnd.adobe.photoshop', 'image/svg+xml'];

var Thumbnail = React.createClass({
	displayName: 'CloudinaryImagesFieldThumbnail',

	propTypes: {
		deleted: React.PropTypes.bool,
		height: React.PropTypes.number,
		isQueued: React.PropTypes.bool,
		shouldRenderActionButton: React.PropTypes.bool,
		toggleDelete: React.PropTypes.func,
		url: React.PropTypes.string,
		width: React.PropTypes.number,
	},

	renderActionButton () {
		if (!this.props.shouldRenderActionButton || this.props.isQueued) return null;
		return <Button type={this.props.deleted ? 'link-text' : 'link-cancel'} block onClick={this.props.toggleDelete}>{this.props.deleted ? 'Undo' : 'Remove'}</Button>;
	},

	render () {
		var iconClassName;

		if (this.props.deleted) {
			iconClassName = 'delete-pending mega-octicon octicon-x';
		} else if (this.props.isQueued) {
			iconClassName = 'img-uploading mega-octicon octicon-cloud-upload';
		}

		var previewClassName = 'image-preview';
		if (this.props.deleted || this.props.isQueued) previewClassName += ' action';

		var title = '';
		var width = this.props.width;
		var height = this.props.height;
		if (width && height) title = width + ' x ' + height;

		return (
			<div className="image-field image-sortable" title={title}>
				<div className={previewClassName}>
					<a href={this.props.url} className="img-thumbnail" target="__blank">
						<img style={{ height: '90' }} className="img-load" src={this.props.url} />
						<span className={iconClassName} />
					</a>
				</div>
				{this.renderActionButton()}
			</div>
		);
	}

});

module.exports = Field.create({

	getInitialState () {
		var thumbnails = [];
		var self = this;

		_.each(this.props.value, function (item) {
			self.pushThumbnail(item, thumbnails);
		});

		return { thumbnails: thumbnails };
	},

	removeThumbnail  (i) {
		var thumbs = this.state.thumbnails;
		var thumb = thumbs[i];

		if (thumb.props.isQueued) {
			thumbs[i] = null;
		} else {
			thumb.props.deleted = !thumb.props.deleted;
		}

		this.setState({ thumbnails: thumbs });
	},

	pushThumbnail  (args, thumbs) {
		thumbs = thumbs || this.state.thumbnails;
		var i = thumbs.length;
		args.toggleDelete = this.removeThumbnail.bind(this, i);
		args.shouldRenderActionButton = this.shouldRenderField();
		thumbs.push(<Thumbnail key={i} {...args} />);
	},

	fileFieldNode () {
		return this.refs.fileField.getDOMNode();
	},

	getCount  (key) {
		var count = 0;

		_.each(this.state.thumbnails, function (thumb) {
			if (thumb && thumb.props[key]) count++;
		});

		return count;
	},

	renderFileField () {
		if (!this.shouldRenderField()) return null;

		return <input ref="fileField" type="file" name={this.props.paths.upload} multiple className="field-upload" onChange={this.uploadFile} tabIndex="-1" />;
	},

	clearFiles () {
		this.fileFieldNode().value = '';

		this.setState({
			thumbnails: this.state.thumbnails.filter(function (thumb) {
				return !thumb.props.isQueued;
			})
		});
	},

	uploadFile  (event) {
		var self = this;

		var files = event.target.files;
		_.each(files, function (f) {
			if (!_.contains(SUPPORTED_TYPES, f.type)) {
				alert('Unsupported file type. Supported formats are: GIF, PNG, JPG, BMP, ICO, PDF, TIFF, EPS, PSD, SVG');
				return;
			}

			if (window.FileReader) {
				var fileReader = new FileReader();
				fileReader.onload = function (e) {
					self.pushThumbnail({ isQueued: true, url: e.target.result });
					self.forceUpdate();
				};
				fileReader.readAsDataURL(f);
			} else {
				self.pushThumbnail({ isQueued: true, url: '#' });
				self.forceUpdate();
			}
		});
	},

	changeImage () {
		this.fileFieldNode().click();
	},

	hasFiles () {
		return this.refs.fileField && this.fileFieldNode().value;
	},

	renderToolbar () {
		if (!this.shouldRenderField()) return null;

		var body = [];

		var push = function (queueType, alertType, count, action) {
			if (count <= 0) return;

			var imageText = count === 1 ? 'image' : 'images';

			body.push(<div key={queueType + '-toolbar'} className={queueType + '-queued' + ' u-float-left'}>
				<FormInput noedit>{count} {imageText} {action} - save to confirm</FormInput>
			</div>);
		};

		push('upload', 'success', this.getCount('isQueued'), 'queued for upload');
		push('delete', 'danger', this.getCount('deleted'), 'removed');

		var clearFilesButton;
		if (this.hasFiles()) {
			clearFilesButton = <Button type="link-cancel" onClick={this.clearFiles} className="ml-5">Clear selection</Button>;
		}

		return (
			<div className="images-toolbar">
				<div className="u-float-left">
					<Button onClick={this.changeImage}>Select files</Button>
					{clearFilesButton}
				</div>
				{body}
			</div>
		);
	},

	renderPlaceholder () {
		return (
			<div className="image-field image-upload" onClick={this.changeImage}>
				<div className="image-preview">
					<span className="img-thumbnail">
						<span className="img-dropzone" />
						<div className="img-uploading mega-octicon octicon-file-media" />
					</span>
				</div>

				<div className="image-details">
					<span className="image-message">Click to upload</span>
				</div>
			</div>
		);
	},

	renderContainer () {
		return (
			<div className="images-container">
				{this.state.thumbnails}
			</div>
		);
	},

	renderFieldAction () {
		if (!this.shouldRenderField()) return null;

		var value = '';
		var remove = [];
		_.each(this.state.thumbnails, function (thumb) {
			if (thumb && thumb.props.deleted) remove.push(thumb.props.public_id);
		});
		if (remove.length) value = 'remove:' + remove.join(',');

		return <input ref="action" className="field-action" type="hidden" value={value} name={this.props.paths.action} />;
	},

	renderUploadsField () {
		if (!this.shouldRenderField()) return null;

		return <input ref="uploads" className="field-uploads" type="hidden" name={this.props.paths.uploads} />;
	},

	renderNote () {
		if (!this.props.note) return null;
		return <FormNote note={this.props.note} />;
	},

	renderUI () {
		return (
			<FormField label={this.props.label} className="field-type-cloudinaryimages">
				{this.renderFieldAction()}
				{this.renderUploadsField()}
				{this.renderFileField()}
				{this.renderContainer()}
				{this.renderToolbar()}
				{this.renderNote()}
			</FormField>
		);
	}
});
