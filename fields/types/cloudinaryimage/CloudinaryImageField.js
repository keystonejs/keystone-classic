import _ from 'underscore';
import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import Field from '../Field';
import Select from 'react-select';
import { Button, FormField, FormInput, FormNote } from 'elemental';
import Lightbox from '../../../admin/client/components/Lightbox';
import classnames from 'classnames';

/**
 * TODO:
 * - Remove dependency on jQuery
 * - Remove dependency on underscore
 */

const SUPPORTED_TYPES = ['image/gif', 'image/png', 'image/jpeg', 'image/bmp', 'image/x-icon', 'application/pdf', 'image/x-tiff', 'image/x-tiff', 'application/postscript', 'image/vnd.adobe.photoshop', 'image/svg+xml'];

const iconClassUploadPending = [
	'upload-pending',
	'mega-octicon',
	'octicon-cloud-upload'
];

const iconClassDeletePending = [
	'delete-pending',
	'mega-octicon',
	'octicon-x'
];

module.exports = Field.create({

	displayName: 'CloudinaryImageField',

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
		let { value } = this.props;
		if (!value || !Object.keys(value).length) return;

		let images = [value.url];

		return (
			<Lightbox
				images={images}
				initialImage={this.state.lightboxImageIndex}
				isOpen={this.state.lightboxIsVisible}
				onCancel={this.closeLightbox}
			/>
		);
	},

	fileFieldNode () {
		return ReactDOM.findDOMNode(this.refs.fileField);
	},

	changeImage () {
		this.fileFieldNode().click();
	},

	getImageSource () {
		if (this.hasLocal()) {
			return this.state.localSource;
		} else if (this.hasExisting()) {
			return this.props.value.url;
		} else {
			return null;
		}
	},

	getImageURL () {
		if (!this.hasLocal() && this.hasExisting()) {
			return this.props.value.url;
		}
	},

	/**
	 * Reset origin and removal.
	 */
	undoRemove () {
		this.fileFieldNode().value = '';
		this.setState({
			removeExisting: false,
			localSource:    null,
			origin:         false,
			action:         null
		});
	},

	/**
	 * Check support for input files on input change.
	 */
	fileChanged  (event) {
		var self = this;

		if (window.FileReader) {
			var files = event.target.files;
			_.each(files, function (f) {
				if (!_.contains(SUPPORTED_TYPES, f.type)) {
					self.removeImage();
					alert('Unsupported file type. Supported formats are: GIF, PNG, JPG, BMP, ICO, PDF, TIFF, EPS, PSD, SVG');
					return false;
				}

				var fileReader = new FileReader();
				fileReader.onload = function (e) {
					if (!self.isMounted()) return;
					self.setState({
						localSource: e.target.result,
						origin: 'local'
					});
				};
				fileReader.readAsDataURL(f);
			});
		} else {
			this.setState({
				origin: 'local'
			});
		}
	},

	/**
	 * If we have a local file added then remove it and reset the file field.
	 */
	removeImage  (e) {
		var state = {
			localSource: null,
			origin: false,
		};

		if (this.hasLocal()) {
			this.fileFieldNode().value = '';
		} else if (this.hasExisting()) {
			state.removeExisting = true;

			if (this.props.autoCleanup) {
				if (e.altKey) {
					state.action = 'reset';
				} else {
					state.action = 'delete';
				}
			} else {
				if (e.altKey) {
					state.action = 'delete';
				} else {
					state.action = 'reset';
				}
			}
		}

		this.setState(state);
	},

	/**
	 * Is the currently active image uploaded in this session?
	 */
	hasLocal () {
		return this.state.origin === 'local';
	},

	/**
	 * Do we have an image preview to display?
	 */
	hasImage () {
		return this.hasExisting() || this.hasLocal();
	},

	/**
	 * Do we have an existing file?
	 */
	hasExisting () {
		return !!this.props.value.url;
	},

	/**
	 * Render an image preview
	 */
	renderImagePreview () {
		var iconClassName;
		var className = ['image-preview'];

		if (this.hasLocal()) {
			iconClassName = clasnames(iconClassUploadPending);
		} else if (this.state.removeExisting) {
			className.push(' removed');
			iconClassName = classnames(iconClassDeletePending);
		}
		className = classnames(className);

		var body = [this.renderImagePreviewThumbnail()];
		if (iconClassName) body.push(<div key={this.props.path + '_preview_icon'} className={iconClassName} />);

		var url = this.getImageURL();

		if (url) {
			body = <a className="img-thumbnail" href={this.getImageURL()} onClick={this.openLightbox.bind(this, 0)} target="__blank">{body}</a>;
		} else {
			body = <div className="img-thumbnail">{body}</div>;
		}

		return <div key={this.props.path + '_preview'} className={className}>{body}</div>;
	},

	renderImagePreviewThumbnail () {
		var url = this.getImageURL();

		if (url) {
			// add cloudinary thumbnail parameters to the url
			url = url.replace(/image\/upload/, 'image/upload/c_thumb,g_face,h_90,w_90');
		} else {
			url = this.getImageSource();
		}

		return <img key={this.props.path + '_preview_thumbnail'} className="img-load" style={ { height: '90' } } src={url} />;
	},

	/**
	 * Render image details - leave these out if we're uploading a local file or
	 * the existing file is to be removed.
	 */
	renderImageDetails  (add) {
		var values = null;

		if (!this.hasLocal() && !this.state.removeExisting) {
			values = (
				<div className="image-values">
					<FormInput noedit>{this.props.value.url}</FormInput>
					{/*
						TODO: move this somewhere better when appropriate
						this.renderImageDimensions()
					*/}
				</div>
			);
		}

		return (
			<div key={this.props.path + '_details'} className="image-details">
				{values}
				{add}
			</div>
		);
	},

	renderImageDimensions () {
		return <FormInput noedit>{this.props.value.width} x {this.props.value.height}</FormInput>;
	},

	/**
	 * Render an alert.
	 *
	 *  - On a local file, output a "to be uploaded" message.
	 *  - On a cloudinary file, output a "from cloudinary" message.
	 *  - On removal of existing file, output a "save to remove" message.
	 */
	renderAlert () {
		if (this.hasLocal()) {
			return (
				<FormInput noedit>Image selected - save to upload</FormInput>
			);
		} else if (this.state.origin === 'cloudinary') {
			return (
				<FormInput noedit>Image selected from Cloudinary</FormInput>
			);
		} else if (this.state.removeExisting) {
			return (
				<FormInput noedit>Image {this.props.autoCleanup ? 'deleted' : 'removed'} - save to confirm</FormInput>
			);
		} else {
			return null;
		}
	},

	/**
	 * Output clear/delete/remove button.
	 *
	 *  - On removal of existing image, output "undo remove" button.
	 *  - Otherwise output Cancel/Delete image button.
	 */
	renderClearButton () {
		if (this.state.removeExisting) {
			return (
				<Button type="link" onClick={this.undoRemove}>
					Undo Remove
				</Button>
			);
		} else {
			var clearText;
			if (this.hasLocal()) {
				clearText = 'Cancel';
			} else {
				clearText = (this.props.autoCleanup ? 'Delete Image' : 'Remove Image');
			}
			return (
				<Button type="link-cancel" onClick={this.removeImage}>
					{clearText}
				</Button>
			);
		}
	},

	renderFileField () {
		return <input ref="fileField" type="file" name={this.props.paths.upload} className="field-upload" onChange={this.fileChanged} tabIndex="-1" />;
	},

	renderFileAction () {
		return <input type="hidden" name={this.props.paths.action} className="field-action" value={this.state.action} />;
	},

	renderImageToolbar () {
		return (
			<div key={this.props.path + '_toolbar'} className="image-toolbar">
				<div className="u-float-left">
					<Button onClick={this.changeImage}>
						{this.hasImage() ? 'Change' : 'Upload'} Image
					</Button>
					{this.hasImage() && this.renderClearButton()}
				</div>
				{this.props.select && this.renderImageSelect()}
			</div>
		);
	},

	renderImageSelect () {
		var selectPrefix = this.props.selectPrefix;
		var getOptions = function(input, callback) {
			$.get(Keystone.adminPath + '/api/cloudinary/autocomplete', {
				dataType: 'json',
				data: {
					q: input
				},
				prefix: selectPrefix
			}, function (data) {
				var options = [];

				_.each(data.items, function (item) {
					options.push({
						value: item.public_id,
						label: item.public_id
					});
				});

				callback(null, {
					options: options,
					complete: true
				});
			});
		};

		return (
			<div className="image-select">
				<Select
					placeholder="Search for an image from Cloudinary ..."
					name={this.props.paths.select}
					id={'field_' + this.props.paths.select}
					asyncOptions={getOptions}
				/>
			</div>
		);
	},

	renderNote () {
		if (!this.props.note) return null;
		return <FormNote note={this.props.note} />;
	},

	renderUI () {
		var container = [];
		var body = [];
		var hasImage = this.hasImage();

		if (this.shouldRenderField()) {
			if (hasImage) {
				container.push(this.renderImagePreview());
				container.push(this.renderImageDetails(this.renderAlert()));
			}
			body.push(this.renderImageToolbar());
		} else {
			if (hasImage) {
				container.push(this.renderImagePreview());
				container.push(this.renderImageDetails());
			} else {
				container.push(<div className="help-block">no image</div>);
			}
		}
		return (
			<FormField label={this.props.label} className="field-type-cloudinaryimage">
				{this.renderFileField()}
				{this.renderFileAction()}
				<div className="image-container">{container}</div>
				{body}
				{this.renderNote()}
				{this.renderLightbox()}
			</FormField>
		);
	}
});
