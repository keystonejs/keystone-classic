var React = require('react');
var Field = require('../Field');
var _ = require('underscore');
var bytes = require('bytes');

var Button = require('elemental').Button;
var FormField = require('elemental').FormField;
var FormInput = require('elemental').FormInput;

var ICON_EXTS = [
	'aac', 'ai', 'aiff', 'avi', 'bmp', 'c', 'cpp', 'css', 'dat', 'dmg', 'doc', 'dotx', 'dwg', 'dxf', 'eps', 'exe', 'flv', 'gif', 'h',
	'hpp', 'html', 'ics', 'iso', 'java', 'jpg', 'js', 'key', 'less', 'mid', 'mp3', 'mp4', 'mpg', 'odf', 'ods', 'odt', 'otp', 'ots',
	'ott', 'pdf', 'php', 'png', 'ppt', 'psd', 'py', 'qt', 'rar', 'rb', 'rtf', 'sass', 'scss', 'sql', 'tga', 'tgz', 'tiff', 'txt',
	'wav', 'xls', 'xlsx', 'xml', 'yml', 'zip'
];

var Item = React.createClass({

	render: function () {
		var filename = this.props.filename;
		var ext = filename.split('.').pop();

		var iconName = '_blank';
		if (_.contains(ICON_EXTS, ext)) iconName = ext;

		var body = [];

		body.push(<img className="file-icon" src={'/keystone/images/icons/32/' + iconName + '.png'} />);
		body.push(<FormInput noedit className="field-type-localfiles__filename">
			{filename}
			{this.props.size ? ' (' + bytes(this.props.size) + ')' : null}
		</FormInput>);

		if (this.props.deleted) {
			body.push(<FormInput noedit className="field-type-localfiles__note field-type-localfiles__note--delete">save to delete</FormInput>);
		} else if (this.props.isQueued) {
			body.push(<FormInput noedit className="field-type-localfiles__note field-type-localfiles__note--upload">save to upload</FormInput>);
		}

		if (!this.props.isQueued) {
			var buttonLabel = this.props.deleted ? 'Undo' : 'Remove';
			var buttonType = this.props.deleted ? 'link' : 'link-cancel';
			body.push(<Button type={buttonType} onClick={this.props.toggleDelete}>{buttonLabel}</Button>);
		}

		return <FormField key={this.props.key}>{body}</FormField>;
	}

});

module.exports = Field.create({

	getInitialState: function () {
		var items = [];
		var self = this;

		_.each(this.props.value, function (item) {
			self.pushItem(item, items);
		});

		return { items: items };
	},

	removeItem: function (i) {
		var thumbs = this.state.items;
		var thumb = thumbs[i];

		if (thumb.props.isQueued) {
			thumbs[i] = null;
		} else {
			thumb.props.deleted = !thumb.props.deleted;
		}

		this.setState({ items: thumbs });
	},

	pushItem: function (args, thumbs) {
		thumbs = thumbs || this.state.items;
		var i = thumbs.length;
		args.toggleDelete = this.removeItem.bind(this, i);
		thumbs.push(<Item key={i} {...args} />);
	},

	fileFieldNode: function () {
		return this.refs.fileField.getDOMNode();
	},

	renderFileField: function () {
		return <input ref="fileField" type="file" name={this.props.paths.upload} multiple className="field-upload" onChange={this.uploadFile} tabIndex="-1" />;
	},

	clearFiles: function () {
		this.fileFieldNode().value = '';

		this.setState({
			items: this.state.items.filter(function (thumb) {
				return !thumb.props.isQueued;
			})
		});
	},

	uploadFile: function (event) {
		var self = this;

		var files = event.target.files;
		_.each(files, function (f) {
			self.pushItem({ isQueued: true, filename: f.name });
			self.forceUpdate();
		});
	},

	changeFiles: function () {
		this.fileFieldNode().click();
	},

	hasFiles: function () {
		return this.refs.fileField && this.fileFieldNode().value;
	},

	renderToolbar: function () {
		var clearFilesButton;
		if (this.hasFiles()) {
			clearFilesButton = <Button type="link-cancel" className="ml-5" onClick={this.clearFiles}>Clear Uploads</Button>;
		}

		return (
			<div className="files-toolbar row col-sm-3 col-md-12">
				<div className="u-float-left">
					<Button onClick={this.changeFiles}>Upload</Button>
					{clearFilesButton}
				</div>
			</div>
		);
	},

	renderPlaceholder: function () {
		return (
			<div className="file-field file-upload row col-sm-3 col-md-12" onClick={this.changeFiles}>
				<div className="file-preview">
					<span className="file-thumbnail">
						<span className="file-dropzone" />
						<div className="ion-picture file-uploading" />
					</span>
				</div>

				<div className="file-details">
					<span className="file-message">Click to upload</span>
				</div>
			</div>
		);
	},

	renderContainer: function () {
		return (
			<div className="files-container clearfix">
				{this.state.items}
			</div>
		);
	},

	renderFieldAction: function () {
		var value = '';
		var remove = [];
		_.each(this.state.items, function (thumb) {
			if (thumb && thumb.props.deleted) remove.push(thumb.props._id);
		});
		if (remove.length) value = 'delete:' + remove.join(',');

		return <input ref="action" className="field-action" type="hidden" value={value} name={this.props.paths.action} />;
	},

	renderUploadsField: function () {
		return <input ref="uploads" className="field-uploads" type="hidden" name={this.props.paths.uploads} />;
	},

	renderUI: function () {
		return (
			<FormField label={this.props.label} className="field-type-localfiles">

				{this.renderFieldAction()}
				{this.renderUploadsField()}
				{this.renderFileField()}
				{this.renderContainer()}
				{this.renderToolbar()}

			</FormField>
		);
	}
});
