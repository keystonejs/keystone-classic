import React, { PropTypes } from 'react';
import Field from '../Field';
import { FormField, FormInput, FormNote } from 'elemental';
import cloudinaryResize from '../../../admin/client/utils/cloudinaryResize';
import { Button } from '../../../admin/client/App/elemental';

import ImageThumbnail from '../../components/ImageThumbnail';
import FileChangeMessage from '../../components/FileChangeMessage';
import HiddenFileInput from '../../components/HiddenFileInput';
import Lightbox from '../../components/Lightbox';

const SUPPORTED_TYPES = ['image/*', 'application/pdf', 'application/postscript'];

const buildInitialState = () => ({
	action: null,
	removeExisting: false,
	userSelectedFile: null,
});

module.exports = Field.create({
	propTypes: {
		collapse: PropTypes.bool,
		label: PropTypes.string,
		note: PropTypes.string,
		path: PropTypes.string.isRequired,
		paths: PropTypes.shape({
			action: PropTypes.string.isRequired,
			upload: PropTypes.string.isRequired,
		}).isRequired,
		value: PropTypes.shape({
			format: PropTypes.string,
			height: PropTypes.number,
			public_id: PropTypes.string,
			resource_type: PropTypes.string,
			secure_url: PropTypes.string,
			signature: PropTypes.string,
			url: PropTypes.string,
			version: PropTypes.number,
			width: PropTypes.number,
		}),
	},
	displayName: 'CloudinaryImageField',
	statics: {
		type: 'CloudinaryImage',
	},
	getInitialState () {
		return buildInitialState();
	},

	// ==============================
	// HELPERS
	// ==============================

	hasLocal () {
		return !!this.state.userSelectedFile;
	},
	hasExisting () {
		return !!this.props.value.url;
	},
	hasImage () {
		return this.hasExisting() || this.hasLocal();
	},
	getFilename () {
		const { format, height, public_id, width } = this.props.value;

		return this.state.userSelectedFile
			? this.state.userSelectedFile.name
			: `${public_id}.${format} (${width}×${height})`;
	},
	getImageSource (height = 90) {
		let src;
		if (this.hasLocal()) {
			src = this.state.dataUri;
		} else if (this.hasExisting()) {
			src = cloudinaryResize(this.props.value.public_id, {
				crop: 'fit',
				height: height,
				format: 'jpg',
			});
		}

		return src;
	},

	// ==============================
	// METHODS
	// ==============================

	triggerFileBrowser () {
		this.refs.fileInput.clickDomNode();
	},
	handleFileChange (event) {
		const userSelectedFile = event.target.files[0];

		this.setState({ userSelectedFile });
	},

	// Toggle the lightbox
	openLightbox (index) {
		event.preventDefault();
		this.setState({
			lightboxIsVisible: true,
		});
	},
	closeLightbox () {
		this.setState({
			lightboxIsVisible: false,
		});
	},

	// Handle image selection in file browser
	handleImageChange (e) {
		if (!window.FileReader) {
			return alert('File reader not supported by browser.');
		}

		var reader = new FileReader();
		var file = e.target.files[0];
		if (!file) return;

		reader.readAsDataURL(file);

		reader.onloadstart = () => {
			this.setState({
				loading: true,
			});
		};
		reader.onloadend = (upload) => {
			this.setState({
				dataUri: upload.target.result,
				loading: false,
				userSelectedFile: file,
			});
			this.props.onChange({ file: file });
		};
	},

	// If we have a local file added then remove it and reset the file field.
	handleRemove (e) {
		var state = {};

		if (this.state.userSelectedFile) {
			state.userSelectedFile = null;
		} else if (this.hasExisting()) {
			state.removeExisting = true;
			state.action = 'reset';
		}

		this.setState(state);
	},
	undoRemove () {
		this.setState(buildInitialState());
	},

	// ==============================
	// RENDERERS
	// ==============================

	renderLightbox () {
		const { value } = this.props;
		if (!value || !Object.keys(value).length) return;

		return (
			<Lightbox
				images={[this.getImageSource(600)]}
				initialImage={0}
				isOpen={this.state.lightboxIsVisible}
				onCancel={this.closeLightbox}
			/>
		);
	},
	renderImagePreview () {
		const { value } = this.props;

		// render icon feedback for intent
		let mask;
		if (this.hasLocal()) mask = 'upload';
		else if (this.state.removeExisting) mask = 'remove';
		else if (this.state.loading) mask = 'loading';

		const url = this.getImageSource();
		const shouldOpenLightbox = value.format !== 'pdf';

		return (
			<ImageThumbnail
				component="a"
				href={url}
				onClick={shouldOpenLightbox && this.openLightbox}
				mask={mask}
				target="__blank"
				style={{ float: 'left', marginRight: '1em' }}
			>
				<img src={url} style={{ height: 90 }} />
			</ImageThumbnail>
		);
	},
	renderFileNameAndOptionalMessage (showChangeMessage = false) {
		return (
			<div>
				{this.hasImage() ? (
					<FileChangeMessage>
						{this.getFilename()}
					</FileChangeMessage>
				) : null}
				{showChangeMessage && this.renderChangeMessage()}
			</div>
		);
	},
	renderChangeMessage () {
		if (this.state.userSelectedFile) {
			return (
				<FileChangeMessage type="success">
					Save to Upload
				</FileChangeMessage>
			);
		} else if (this.state.origin === 'cloudinary') {
			return (
				<FileChangeMessage type="success">
					Selected from Cloudinary
				</FileChangeMessage>
			);
		} else if (this.state.removeExisting) {
			return (
				<FileChangeMessage type="danger">
					Save to Remove
				</FileChangeMessage>
			);
		} else {
			return null;
		}
	},

	// Output [cancel/remove/undo] button
	renderClearButton () {
		const clearText = this.hasLocal() ? 'Cancel' : 'Remove Image';

		return this.state.removeExisting ? (
			<Button variant="link" onClick={this.undoRemove}>
				Undo Remove
			</Button>
		) : (
			<Button variant="link" color="cancel" onClick={this.handleRemove}>
				{clearText}
			</Button>
		);
	},

	renderImageToolbar () {
		return (
			<div key={this.props.path + '_toolbar'} className="image-toolbar">
				<Button onClick={this.triggerFileBrowser}>
					{this.hasImage() ? 'Change' : 'Upload'} Image
				</Button>
				{this.hasImage() && this.renderClearButton()}
			</div>
		);
	},

	renderUI () {
		const { label, note, path, paths } = this.props;

		const imageContainer = (
			<div style={this.hasImage() ? { marginBottom: '1em' } : null}>
				{this.hasImage() && this.renderImagePreview()}
				{this.hasImage() && this.renderFileNameAndOptionalMessage(this.shouldRenderField())}
			</div>
		);

		const toolbar = this.shouldRenderField()
			? this.renderImageToolbar()
			: <FormInput noedit>no image</FormInput>;

		const hiddenInputs = this.shouldRenderField() && (
			<div>
				<HiddenFileInput
					accept={SUPPORTED_TYPES.join()}
					ref="fileInput"
					name={paths.upload}
					onChange={this.handleImageChange}
				/>
				<input
					name={paths.action}
					type="hidden"
					value={this.state.action}
				/>
			</div>
		);

		return (
			<FormField label={label} className="field-type-cloudinaryimage" htmlFor={path}>
				{imageContainer}
				{toolbar}
				{!!note && <FormNote note={note} />}
				{this.renderLightbox()}
				{hiddenInputs}
			</FormField>
		);
	},
});
