import React, { cloneElement } from 'react';
import Field from '../Field';
import { FormField, FormNote } from 'elemental';
import { Button } from '../../../admin/client/App/elemental';
import Lightbox from '../../components/Lightbox';
import cloudinaryResize from '../../../admin/client/utils/cloudinaryResize';
import Thumbnail from './CloudinaryImagesThumbnail';
import FileChangeMessage from '../../components/FileChangeMessage';

const SUPPORTED_TYPES = ['image/*', 'application/pdf', 'application/postscript'];
const SUPPORTED_REGEX = new RegExp(/^image\/|application\/pdf|application\/postscript/g);
const RESIZE_DEFAULTS = {
	crop: 'fit',
	format: 'jpg',
};

module.exports = Field.create({
	displayName: 'CloudinaryImagesField',
	statics: {
		type: 'CloudinaryImages',
	},
	getInitialState () {
		const thumbnails = [];

		this.props.value.forEach((item) => {
			this.pushThumbnail({
				imageSourceSmall: cloudinaryResize(item.public_id, {
					...RESIZE_DEFAULTS,
					height: 90,
				}),
				imageSourceLarge: cloudinaryResize(item.public_id, {
					...RESIZE_DEFAULTS,
					height: 600,
					width: 900,
				}),
			}, thumbnails);
		});

		return { thumbnails: thumbnails };
	},

	// ==============================
	// HELPERS
	// ==============================

	changeImage () {
		this.fileFieldNode().click();
	},
	fileFieldNode () {
		return this.refs.fileField;
	},
	hasFiles () {
		return this.refs.fileField && this.fileFieldNode().value;
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

	// ==============================
	// METHODS
	// ==============================

	removeThumbnail (i) {
		const newThumbnails = this.state.thumbnails;
		const target = newThumbnails[i];

		// if the image is just in the queue (and not uploaded yet)
		// remove it from the array
		if (target.props.isQueued) {
			newThumbnails.splice(i, 1);

		// React > 0.14 the props object is frozen
		// https://facebook.github.io/react/blog/2015/10/07/react-v0.14.html#breaking-changes
		// Using splice + clone to toggle target thumb props
		} else {
			newThumbnails.splice(i, 1, cloneElement(target, {
				isDeleted: !target.props.isDeleted,
			}));
		}

		this.setState({ thumbnails: newThumbnails });
	},
	pushThumbnail (args, thumbs = this.state.thumbnails) {
		const i = thumbs.length;

		thumbs.push(
			<Thumbnail
				key={i}
				openLightbox={this.openLightbox.bind(this, i)}
				shouldRenderActionButton={this.shouldRenderField()}
				toggleDelete={this.removeThumbnail.bind(this, i)}
				{...args}
			/>
		);
	},
	getCount (key) {
		var count = 0;

		this.state.thumbnails.forEach((thumb) => {
			if (thumb && thumb.props[key]) count++;
		});

		return count;
	},
	clearFiles () {
		this.fileFieldNode().value = '';

		this.setState({
			thumbnails: this.state.thumbnails.filter(function (thumb) {
				return !thumb.props.isQueued;
			}),
		});
	},
	uploadFile (event) {
		if (!window.FileReader) {
			return alert('File reader not supported by browser.');
		}
		const files = event.target.files;

		// FileList not a real Array; forEach not supported
		for (let i = 0; i < files.length; i++) {
			const reader = new FileReader();
			const f = files[i];

			if (!f.type.match(SUPPORTED_REGEX)) {
				return alert('Unsupported file type. Supported formats are: GIF, PNG, JPG, BMP, ICO, PDF, TIFF, EPS, PSD, SVG');
			}

			// TODO use `onloadstart` + `onloadend` to display a loading indicator
			// for each thumbnail when applicable

			reader.readAsDataURL(f);
			reader.onload = (e) => {
				this.pushThumbnail({
					isQueued: true,
					imageSourceSmall: e.target.result,
				});
				this.forceUpdate();
			};
		}
	},

	// ==============================
	// RENDERERS
	// ==============================

	renderFileField () {
		if (!this.shouldRenderField()) return null;

		return (
			<input
				accept={SUPPORTED_TYPES.join()}
				ref="fileField"
				type="file"
				name={this.getInputName(this.props.paths.upload)}
				multiple
				className="field-upload"
				onChange={this.uploadFile}
				tabIndex="-1"
			/>
		);
	},
	renderLightbox () {
		const { value } = this.props;
		if (!value || !value.length) return;

		const images = value.map(image => cloudinaryResize(image.public_id, {
			...RESIZE_DEFAULTS,
			height: 600,
			width: 900,
		}));

		return (
			<Lightbox
				images={images}
				initialImage={this.state.lightboxImageIndex}
				isOpen={this.state.lightboxIsVisible}
				onCancel={this.closeLightbox}
			/>
		);
	},
	renderToolbar () {
		if (!this.shouldRenderField()) return null;

		const uploadCount = this.getCount('isQueued');
		const deleteCount = this.getCount('isDeleted');

		// provide a gutter for the change message
		// only required when no cancel button, which has equiv. padding
		const uploadButtonStyles = !this.hasFiles()
			? { marginRight: 10 }
			: {};

		// prepare the change message
		const changeMessage = uploadCount || deleteCount ? (
			<FileChangeMessage>
				{uploadCount && deleteCount ? `${uploadCount} added and ${deleteCount} removed` : null}
				{uploadCount && !deleteCount ? `${uploadCount} image added` : null}
				{!uploadCount && deleteCount ? `${deleteCount} image removed` : null}
			</FileChangeMessage>
		) : null;

		// prepare the save message
		const saveMessage = uploadCount || deleteCount ? (
			<FileChangeMessage color={!deleteCount ? 'success' : 'danger'}>
				Save to {!deleteCount ? 'Upload' : 'Confirm'}
			</FileChangeMessage>
		) : null;

		// clear floating images above
		const toolbarStyles = {
			clear: 'both',
		};

		return (
			<div style={toolbarStyles}>
				<Button onClick={this.changeImage} style={uploadButtonStyles}>
					Upload Images
				</Button>
				{this.hasFiles() && (
					<Button variant="link" color="cancel" onClick={this.clearFiles}>
						Clear selection
					</Button>
				)}
				{changeMessage}
				{saveMessage}
			</div>
		);
	},
	renderFieldAction () {
		if (!this.shouldRenderField()) return null;

		var value = '';
		var remove = [];
		this.state.thumbnails.forEach((thumb) => {
			if (thumb && thumb.props.isDeleted) remove.push(thumb.props.public_id);
		});
		if (remove.length) value = 'remove:' + remove.join(',');

		return (
			<input
				className="field-action"
				name={this.getInputName(this.props.paths.action)}
				ref="action"
				type="hidden"
				value={value}
			/>
		);
	},
	renderUploadsField () {
		if (!this.shouldRenderField()) return null;

		return (
			<input
				className="field-uploads"
				name={this.getInputName(this.props.paths.uploads)}
				ref="uploads"
				type="hidden"
			/>
		);
	},
	renderUI () {
		const { label, note, path } = this.props;
		const { thumbnails } = this.state;

		return (
			<FormField label={label} className="field-type-cloudinaryimages" htmlFor={path}>
				{this.renderFieldAction()}
				{this.renderUploadsField()}
				{this.renderFileField()}
				<div>
					{thumbnails}
				</div>
				{this.renderToolbar()}
				{!!note && <FormNote note={note} />}
				{this.renderLightbox()}
			</FormField>
		);
	},
});
