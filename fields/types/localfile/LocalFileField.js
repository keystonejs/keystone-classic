var React = require('react');
var Field = require('../Field');

var Button = require('elemental').Button;
var FormField = require('elemental').FormField;
var FormInput = require('elemental').FormInput;
var FormNote = require('elemental').FormNote;

module.exports = Field.create({
	
	shouldCollapse: function() {
		return this.props.collapse && !this.hasExisting();
	},

	fileFieldNode: function() {
		return this.refs.fileField.getDOMNode();
	},

	changeFile: function() {
		this.refs.fileField.getDOMNode().click();
	},

	getFileSource: function() {
		if (this.hasLocal()) {
			return this.state.localSource;
		} else if (this.hasExisting()) {
			return this.props.value.url;
		} else {
			return null;
		}
	},

	getFileURL: function() {
		if (!this.hasLocal() && this.hasExisting()) {
			return this.props.value.url;
		}
	},

	undoRemove: function() {
		this.fileFieldNode().value = '';
		this.setState({
			removeExisting: false,
			localSource:    null,
			origin:         false,
			action:         null
		});
	},

	fileChanged: function (event) {//eslint-disable-line no-unused-vars
		this.setState({
			origin: 'local'
		});
	},

	removeFile: function (e) {
		var state = {
			localSource: null,
			origin: false
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

	hasLocal: function() {
		return this.state.origin === 'local';
	},

	hasFile: function() {
		return this.hasExisting() || this.hasLocal();
	},

	hasExisting: function() {
		return !!this.props.value.filename;
	},

	getFilename: function() {
		if (this.hasLocal()) {
			return this.fileFieldNode().value.split('\\').pop();
		} else {
			return this.props.value.filename;
		}
	},

	renderFileDetails: function (add) {
		var values = null;

		if (this.hasFile() && !this.state.removeExisting) {
			values = (
				<div className='file-values'>
					<FormInput noedit>{this.getFilename()}</FormInput>
				</div>
			);
		}

		return (
			<div key={this.props.path + '_details'} className='file-details'>
				{values}
				{add}
			</div>
		);
	},

	renderAlert: function() {
		if (this.hasLocal()) {
			return (
				<div className="upload-queued u-float-left">
					<FormInput noedit>File selected - save to upload</FormInput>
				</div>
			);
		} else if (this.state.origin === 'cloudinary') {
			return ( 
				<div className="select-queued u-float-left">
					<FormInput noedit>File selected from Cloudinary</FormInput>
				</div>
			);
		} else if (this.state.removeExisting) {
			return (
				<div className="delete-queued u-float-left">
					<FormInput noedit>File {this.props.autoCleanup ? 'deleted' : 'removed'} - save to confirm</FormInput>
				</div>
			);
		} else {
			return null;
		}
	},

	renderClearButton: function() {
		if (this.state.removeExisting) {
			return (
				<Button type="link-cancel" onClick={this.undoRemove}>
					Undo Remove
				</Button>
			);
		} else {
			var clearText;
			if (this.hasLocal()) {
				clearText = 'Cancel Upload';
			} else {
				clearText = (this.props.autoCleanup ? 'Delete File' : 'Remove File');
			}
			return (
				<Button type="link-cancel" onClick={this.removeFile}>
					{clearText}
				</Button>
			);
		}
	},

	renderFileField: function() {
		if (!this.shouldRenderField()) return null;
		
		return <input ref="fileField" type="file" name={this.props.paths.upload} className="field-upload" onChange={this.fileChanged} tabIndex="-1" />;
	},

	renderFileAction: function() {
		if (!this.shouldRenderField()) return null;
		
		return <input type="hidden" name={this.props.paths.action} className="field-action" value={this.state.action} />;
	},

	renderFileToolbar: function() {
		return (
			<div key={this.props.path + '_toolbar'} className='file-toolbar'>
				<div className='u-float-left'>
					<Button onClick={this.changeFile}>
						{this.hasFile() ? 'Change' : 'Upload'} File
					</Button>
					{this.hasFile() && this.renderClearButton()}
				</div>
			</div>
		);
	},
	
	renderNote () {
		if (!this.props.note) return null;
		
		return <FormNote note={this.props.note} />;
	},

	renderUI: function() {
		var container = [],
			body = [],
			hasFile = this.hasFile();

		if (this.shouldRenderField()) {
			if (hasFile) {
				container.push(this.renderFileDetails(this.renderAlert()));
			}
			body.push(this.renderFileToolbar());
		} else {
			if (hasFile) {
				container.push(this.renderFileDetails());
			} else {
				container.push(<FormInput noedit>no file</FormInput>);
			}
		}

		return (
			<FormField label={this.props.label} className="field-type-localfile">
			
				{this.renderFileField()}
				{this.renderFileAction()}
	
				<div className="file-container">{container}</div>
				{body}
				{this.renderNote()}
				
			</FormField>
		);
	}
	
});
