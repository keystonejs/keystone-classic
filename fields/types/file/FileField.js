/**
TODO:
- Format size of stored file (if present) using bytes package?
- Display file type icon? (see LocalFileField)
*/

import Field from '../Field';
import React, { PropTypes } from 'react';
import { Button, FormField, FormInput, FormNote } from 'elemental';
import FileChangeMessage from '../../components/FileChangeMessage';
import HiddenFileInput from '../../components/HiddenFileInput';

const FileThumb = ({ url }) => {
	const isPicture = url && url.match(/\.(jpeg|jpg|gif|png)$/i) != null;
	if (!isPicture) {
		// TODO generic icons
		return false;
	}
	return (
		<div style={{ width: 150, marginRight: 10, flexShrink: 0 }}>
			<img style={{ width: '100%', height: '100%' }} src={url}/>
		</div>
	);
};

const FileDom = ({ url, filename }) => {
	return (
		<div style={{ display: 'flex' }}>
			<FileThumb {...{ url }}/>
			<div style={{
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'flex-end',
				alignItems: 'flex-start',
				minHeight: 100,
				width: '100%',
			}}>
				<FileChangeMessage>
					{url ? (
						<a href={url}>{filename}</a>
					) : (
						filename
					)}
				</FileChangeMessage>
				{url && (
					<span style={{ fontSize: 10 }}>
						url: {url}
					</span>
				)}
			</div>
		</div>
	);
};

let uploadInc = 1000;

const buildInitialState = (props) => ({
	action: null,
	removeExisting: false,
	uploadFieldPath: `File-${props.path}-${++uploadInc}`,
	userSelectedFile: null,
});

module.exports = Field.create({
	propTypes: {
		autoCleanup: PropTypes.bool,
		collapse: PropTypes.bool,
		label: PropTypes.string,
		note: PropTypes.string,
		path: PropTypes.string.isRequired,
		value: PropTypes.shape({
			filename: PropTypes.string,
			// TODO: these are present but not used in the UI,
			//       should we start using them?
			// filetype: PropTypes.string,
			// originalname: PropTypes.string,
			// path: PropTypes.string,
			// size: PropTypes.number,
		}),
	},
	getInitialState () {
		return buildInitialState(this.props);
	},
	shouldCollapse () {
		return this.props.collapse && !this.hasExisting();
	},
	componentWillUpdate (nextProps) {
		const value = this.props.value || {};
		const nextVal = nextProps.value || {};
		// Show the new filename when it's finished uploading
		if (value.filename !== nextVal.filename) {
			this.setState(buildInitialState(nextProps));
		}
	},

	// ==============================
	// HELPERS
	// ==============================

	hasFile () {
		return this.hasExisting() || !!this.state.userSelectedFile;
	},
	hasExisting () {
		return this.props.value && !!this.props.value.filename;
	},
	getFilename () {
		const { value } = this.props;
		const { userSelectedFile } = this.state;
		return userSelectedFile
			? userSelectedFile.name
			: value && (value.originalname || value.filename);
	},

	// ==============================
	// METHODS
	// ==============================

	triggerFileBrowser () {
		this.fileInput && this.fileInput.clickDomNode();
	},
	handleFileChange (event) {
		const userSelectedFile = event.target.files[0];

		this.setState({
			userSelectedFile: userSelectedFile,
		});
	},
	handleRemove (e) {
		var state = {};

		if (this.state.userSelectedFile) {
			state = buildInitialState(this.props);
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
	undoRemove () {
		this.setState(buildInitialState(this.props));
	},

	// ==============================
	// RENDERERS
	// ==============================

	renderFileNameAndChangeMessage () {
		const { value } = this.props;
		let url;
		let filename;
		if (this.hasFile() && !this.state.removeExisting) {
			url = value && value.url;
			filename = this.getFilename();
		}
		return (
			<div>
				{filename && <FileDom {...{ url, filename }}/>}
				{this.renderChangeMessage()}
			</div>
		);
	},
	renderChangeMessage () {
		if (this.state.userSelectedFile) {
			return (
				<FileChangeMessage type="success">
					File selected - save to upload
				</FileChangeMessage>
			);
		} else if (this.state.removeExisting) {
			return (
				<FileChangeMessage type="danger">
					File {this.props.autoCleanup ? 'deleted' : 'removed'} - save to confirm
				</FileChangeMessage>
			);
		} else {
			return null;
		}
	},
	renderClearButton () {
		if (this.state.removeExisting) {
			return (
				<Button type="link" onClick={this.undoRemove}>
					Undo Remove
				</Button>
			);
		} else {
			var clearText;
			if (this.state.userSelectedFile) {
				clearText = 'Cancel Upload';
			} else {
				clearText = (this.props.autoCleanup ? 'Delete File' : 'Remove File');
			}
			return (
				<Button type="link-cancel" onClick={this.handleRemove}>
					{clearText}
				</Button>
			);
		}
	},
	renderActionInput () {
		// If the user has selected a file for uploading, we need to point at
		// the upload field. If the file is being deleted, we submit that.
		if (this.state.userSelectedFile || this.state.action) {
			const value = this.state.userSelectedFile
				? `upload:${this.state.uploadFieldPath}`
				: (this.state.action === 'delete' ? 'remove' : '');
			return (
				<input
					name={this.getInputName(this.props.path)}
					type="hidden"
					value={value}
				/>
			);
		} else {
			return null;
		}
	},
	renderUI () {
		const buttons = (
			<div style={this.hasFile() ? { marginTop: '1em' } : null}>
				<Button onClick={this.triggerFileBrowser}>
					{this.hasFile() ? 'Change' : 'Upload'} File
				</Button>
				{this.hasFile() && this.renderClearButton()}
			</div>
		);

		return (
			<div data-field-name={this.props.path} data-field-type="file">
				<FormField label={this.props.label} htmlFor={this.props.path}>
					{this.shouldRenderField() ? (
						<div>
							{this.hasFile() && this.renderFileNameAndChangeMessage()}
							{buttons}
							<HiddenFileInput
								key={this.state.uploadFieldPath}
								name={this.state.uploadFieldPath}
								onChange={this.handleFileChange}
								ref={el => { this.fileInput = el; }}
							/>
							{this.renderActionInput()}
						</div>
					) : (
						<div>
							{this.hasFile() ? (
								this.renderFileNameAndChangeMessage()
							) : (
								<FormInput noedit>no file</FormInput>
							)}
						</div>
					)}
					{!!this.props.note && <FormNote note={this.props.note} />}
				</FormField>
			</div>
		);
	},

});
