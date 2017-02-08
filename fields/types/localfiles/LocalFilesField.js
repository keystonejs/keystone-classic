/*
TODO: this file has been left as a reference for the new File type field.
Some features here, including size formatting and icons, may be ported across.
*/

import _ from 'lodash';
import bytes from 'bytes';
import Field from '../Field';
import React from 'react';
import { Button, FormField, FormInput, FormNote } from '../../../admin/client/App/elemental';

const ICON_EXTS = [
	'aac', 'ai', 'aiff', 'avi', 'bmp', 'c', 'cpp', 'css', 'dat', 'dmg', 'doc', 'dotx', 'dwg', 'dxf', 'eps', 'exe', 'flv', 'gif', 'h',
	'hpp', 'html', 'ics', 'iso', 'java', 'jpg', 'js', 'key', 'less', 'mid', 'mp3', 'mp4', 'mpg', 'odf', 'ods', 'odt', 'otp', 'ots',
	'ott', 'pdf', 'php', 'png', 'ppt', 'psd', 'py', 'qt', 'rar', 'rb', 'rtf', 'sass', 'scss', 'sql', 'tga', 'tgz', 'tiff', 'txt',
	'wav', 'xls', 'xlsx', 'xml', 'yml', 'zip',
];

var LocalFilesFieldItem = React.createClass({
	propTypes: {
		deleted: React.PropTypes.bool,
		filename: React.PropTypes.string,
		isQueued: React.PropTypes.bool,
		size: React.PropTypes.number,
		toggleDelete: React.PropTypes.func,
	},

	renderActionButton () {
		if (!this.props.shouldRenderActionButton || this.props.isQueued) return null;

		var buttonLabel = this.props.deleted ? 'Undo' : 'Remove';
		var buttonType = this.props.deleted ? 'link' : 'link-cancel';

		return <Button key="action-button" type={buttonType} onClick={this.props.toggleDelete}>{buttonLabel}</Button>;
	},

	render () {
		const { filename } = this.props;
		const ext = filename.split('.').pop();

		let iconName = '_blank';
		if (_.includes(ICON_EXTS, ext)) iconName = ext;

		let note;
		if (this.props.deleted) {
			note = <FormInput key="delete-note" noedit className="field-type-localfiles__note field-type-localfiles__note--delete">save to delete</FormInput>;
		} else if (this.props.isQueued) {
			note = <FormInput key="upload-note" noedit className="field-type-localfiles__note field-type-localfiles__note--upload">save to upload</FormInput>;
		}

		return (
			<FormField>
				<img key="file-type-icon" className="file-icon" src={Keystone.adminPath + '/images/icons/32/' + iconName + '.png'} />
				<FormInput key="file-name" noedit className="field-type-localfiles__filename">
					{filename}
					{this.props.size ? ' (' + bytes(this.props.size) + ')' : null}
				</FormInput>
				{note}
				{this.renderActionButton()}
			</FormField>
		);
	},

});

var tempId = 0;

module.exports = Field.create({

	getInitialState () {
		var items = [];
		var self = this;

		_.forEach(this.props.value, function (item) {
			self.pushItem(item, items);
		});

		return { items: items };
	},

	removeItem (id) {
		var thumbs = [];
		var self = this;
		_.forEach(this.state.items, function (thumb) {
			var newProps = Object.assign({}, thumb.props);
			if (thumb.props._id === id) {
				newProps.deleted = !thumb.props.deleted;
			}
			self.pushItem(newProps, thumbs);
		});

		this.setState({ items: thumbs });
	},

	pushItem (args, thumbs) {
		thumbs = thumbs || this.state.items;
		args.toggleDelete = this.removeItem.bind(this, args._id);
		args.shouldRenderActionButton = this.shouldRenderField();
		args.adminPath = Keystone.adminPath;
		thumbs.push(<LocalFilesFieldItem key={args._id || tempId++} {...args} />);
	},

	fileFieldNode () {
		return this.refs.fileField;
	},

	renderFileField () {
		return <input ref="fileField" type="file" name={this.props.paths.upload} multiple className="field-upload" onChange={this.uploadFile} tabIndex="-1" />;
	},

	clearFiles () {
		this.fileFieldNode().value = '';

		this.setState({
			items: this.state.items.filter(function (thumb) {
				return !thumb.props.isQueued;
			}),
		});
	},

	uploadFile (event) {
		var self = this;

		var files = event.target.files;
		_.forEach(files, function (f) {
			self.pushItem({ isQueued: true, filename: f.name });
			self.forceUpdate();
		});
	},

	changeFiles () {
		this.fileFieldNode().click();
	},

	hasFiles () {
		return this.refs.fileField && this.fileFieldNode().value;
	},

	renderToolbar () {
		if (!this.shouldRenderField()) return null;

		var clearFilesButton;
		if (this.hasFiles()) {
			clearFilesButton = <Button type="link-cancel" className="ml-5" onClick={this.clearFiles}>Clear Uploads</Button>;
		}

		return (
			<div className="files-toolbar">
				<Button onClick={this.changeFiles}>Upload</Button>
				{clearFilesButton}
			</div>
		);
	},

	renderPlaceholder () {
		return (
			<div className="file-field file-upload" onClick={this.changeFiles}>
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

	renderContainer () {
		return (
			<div className="files-container clearfix">
				{this.state.items}
			</div>
		);
	},

	renderFieldAction () {
		var value = '';
		var remove = [];
		_.forEach(this.state.items, function (thumb) {
			if (thumb && thumb.props.deleted) remove.push(thumb.props._id);
		});
		if (remove.length) value = 'delete:' + remove.join(',');

		return <input ref="action" className="field-action" type="hidden" value={value} name={this.props.paths.action} />;
	},

	renderUploadsField () {
		return <input ref="uploads" className="field-uploads" type="hidden" name={this.props.paths.uploads} />;
	},

	renderNote: function () {
		if (!this.props.note) return null;
		return <FormNote html={this.props.note} />;
	},

	renderUI () {
		return (
			<FormField label={this.props.label} className="field-type-localfiles" htmlFor={this.props.path}>
				{this.renderFieldAction()}
				{this.renderUploadsField()}
				{this.renderFileField()}
				{this.renderContainer()}
				{this.renderToolbar()}
				{this.renderNote()}
			</FormField>
		);
	},
});
