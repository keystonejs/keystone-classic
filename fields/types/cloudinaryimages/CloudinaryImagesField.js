import _ from 'underscore';
import React from 'react';
import ReactDOM from 'react-dom';
import Field from '../Field';
import { Button, FormField, FormInput, FormNote } from 'elemental';
import Lightbox from '../../../admin/client/components/Lightbox';
import classnames from 'classnames';

const SUPPORTED_TYPES = ['image/gif', 'image/png', 'image/jpeg', 'image/bmp', 'image/x-icon', 'application/pdf', 'image/x-tiff', 'image/x-tiff', 'application/postscript', 'image/vnd.adobe.photoshop', 'image/svg+xml'];

const iconClassDeleted = [
	'delete-pending',
	'mega-octicon',
	'octicon-x'
];

const iconClassQueued = [
	'img-uploading',
	'mega-octicon',
	'octicon-cloud-upload'
];

var Thumbnail = React.createClass({
	displayName: 'CloudinaryImagesFieldThumbnail',

	propTypes: {
		deleted: React.PropTypes.bool,
		height: React.PropTypes.number,
		isQueued: React.PropTypes.bool,
		openLightbox: React.PropTypes.func,
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
		let iconClassName;
		let { deleted, height, isQueued, url, width, openLightbox } = this.props;
		let previewClassName = classnames('image-preview', {
			'action': (deleted || isQueued)
		});
		let title = (width && height) ? (width + ' × ' + height) : '';

		if (deleted) {
			iconClassName = classnames(iconClassDeleted);
		} else if (isQueued) {
			iconClassName = classnames(iconClassQueued);
		}

		return (
			<div className="image-field image-sortable" title={title}>
				<div className={previewClassName}>
					<a href={url} onClick={openLightbox} className="img-thumbnail">
						<img style={{ height: '90' }} className="img-load" src={url} />
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

	openLightbox (index) {
		event.preventDefault();
		this.setState({
			lightboxIsVisible: true,
			lightboxImageIndex: index,
		});
	},

	closeLightbox () {
		this.setState({
			lightboxIsVisible: false,
			lightboxImageIndex: null,
		});
	},

	renderLightbox () {
		if (!this.props.value || !this.props.value.length) return;

		let images = this.props.value.map(image => image.url);

		return (
			<Lightbox
				images={images}
				initialImage={this.state.lightboxImageIndex}
				isOpen={this.state.lightboxIsVisible}
				onCancel={this.closeLightbox}
			/>
		);
	},

	removeThumbnail (i) {
		var thumbs = this.state.thumbnails;
		var thumb = thumbs[i];

		if (thumb.props.isQueued) {
			thumbs[i] = null;
		} else {
			thumb.props.deleted = !thumb.props.deleted;
		}

		this.setState({ thumbnails: thumbs });
	},

	pushThumbnail (args, thumbs) {
		thumbs = thumbs || this.state.thumbnails;
		var i = thumbs.length;
		args.toggleDelete = this.removeThumbnail.bind(this, i);
		args.shouldRenderActionButton = this.shouldRenderField();
		args.openLightbox = this.openLightbox.bind(this, i);
		thumbs.push(<Thumbnail key={i} {...args} />);
	},

	fileFieldNode () {
		return ReactDOM.findDOMNode(this.refs.fileField);
	},

	getCount (key) {
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

	uploadFile (event) {
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
				<FormInput noedit>{count} {imageText} {action}</FormInput>
			</div>);
		};

		push('upload', 'success', this.getCount('isQueued'), 'selected - save to upload');
		push('delete', 'danger', this.getCount('deleted'), 'removed - save to confirm');

		var clearFilesButton;
		if (this.hasFiles()) {
			clearFilesButton = <Button type="link-cancel" onClick={this.clearFiles} className="ml-5">Clear selection</Button>;
		}

		return (
			<div className="images-toolbar">
				<div className="u-float-left">
					<Button onClick={this.changeImage}>Upload Images</Button>
					{clearFilesButton}
				</div>
				{body}
			</div>
		);
	},

	renderPlaceholder () {
		return (
			<div className="image-field image-field--upload" onClick={this.changeImage}>
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
		return this.props.note ? <FormNote note={this.props.note} /> : null;
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
				{this.renderLightbox()}
			</FormField>
		);
	}
});
