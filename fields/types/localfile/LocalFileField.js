var React = require('react'),
	Field = require('../Field'),
	Note = require('../../components/Note');

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
					<div className='field-value'>{this.getFilename()}</div>
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
				<div className='upload-queued pull-left'>
					<div className='alert alert-success'>File selected - save to upload</div>
				</div>
			);
		} else if (this.state.origin === 'cloudinary') {
			return ( 
				<div className='select-queued pull-left'>
					<div className='alert alert-success'>File selected from Cloudinary</div>
				</div>
			);
		} else if (this.state.removeExisting) {
			return (
				<div className='delete-queued pull-left'>
					<div className='alert alert-danger'>File {this.props.autoCleanup ? 'deleted' : 'removed'} - save to confirm</div>
				</div>
			);
		} else {
			return null;
		}
	},

	renderClearButton: function() {
		if (this.state.removeExisting) {
			return (
				<button type='button' className='btn btn-link btn-cancel btn-undo-file' onClick={this.undoRemove}>
					Undo Remove
				</button>
			);
		} else {
			var clearText;
			if (this.hasLocal()) {
				clearText = 'Cancel Upload';
			} else {
				clearText = (this.props.autoCleanup ? 'Delete File' : 'Remove File');
			}
			return (
				<button type='button' className='btn btn-link btn-cancel btn-delete-file' onClick={this.removeFile}>
					{clearText}
				</button>
			);
		}
	},

	renderFileField: function() {
		return <input ref='fileField' type='file' name={this.props.paths.upload} className='field-upload' onChange={this.fileChanged} />;
	},

	renderFileAction: function() {
		return <input type='hidden' name={this.props.paths.action} className='field-action' value={this.state.action} />;
	},

	renderFileToolbar: function() {
		return (
			<div key={this.props.path + '_toolbar'} className='file-toolbar'>
				<div className='pull-left'>
					<button type='button' onClick={this.changeFile} className='btn btn-default btn-upload-file'>
						{this.hasFile() ? 'Change' : 'Upload'} File
					</button>
					{this.hasFile() && this.renderClearButton()}
				</div>
			</div>
		);
	},

	renderUI: function() {
		var container = [],
			body = [],
			hasFile = this.hasFile(),
			fieldClassName = 'field-ui';

		if (hasFile) {
			fieldClassName += ' has-file';
		}

		if (this.shouldRenderField()) {
			if (hasFile) {
				container.push(this.renderFileDetails(this.renderAlert()));
			}
			body.push(this.renderFileToolbar());
		} else {
			if (hasFile) {
				container.push(this.renderFileDetails());
			} else {
				container.push(<div className='help-block'>no file</div>);
			}
		}

		return (
			<div className='field field-type-localfile'>
				<label className='field-label'>{this.props.label}</label>
	
				{this.renderFileField()}
				{this.renderFileAction()}
	
				<div className={fieldClassName}>
					<div className='file-container'>{container}</div>
					{body}
					<Note note={this.props.note} />
				</div>
			</div>
		);
	}
	
});
