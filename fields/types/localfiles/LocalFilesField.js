import _ from 'underscore';
import bytes from 'bytes';
import Field from '../Field';
import React from 'react';
import ReactDOM from 'react-dom';
import { Button, FormField, FormInput, FormNote } from 'elemental';

/**
 * TODO:
 * - Remove dependency on underscore
 */

const ICON_EXTS = [
	'aac', 'ai', 'aiff', 'avi', 'bmp', 'c', 'cpp', 'css', 'dat', 'dmg', 'doc', 'dotx', 'dwg', 'dxf', 'eps', 'exe', 'flv', 'gif', 'h',
	'hpp', 'html', 'ics', 'iso', 'java', 'jpg', 'js', 'key', 'less', 'mid', 'mp3', 'mp4', 'mpg', 'odf', 'ods', 'odt', 'otp', 'ots',
	'ott', 'pdf', 'php', 'png', 'ppt', 'psd', 'py', 'qt', 'rar', 'rb', 'rtf', 'sass', 'scss', 'sql', 'tga', 'tgz', 'tiff', 'txt',
	'wav', 'xls', 'xlsx', 'xml', 'yml', 'zip'
];

var LocalFilesFieldItem = React.createClass({
	propTypes: {
		deleted: React.PropTypes.bool,
		filename: React.PropTypes.string,
		isQueued: React.PropTypes.bool,
		key: React.PropTypes.number,
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
		const { filename, originalname, itemId, listKey } = this.props;
		const isPicture = originalname && originalname.match(/\.(jpeg|jpg|gif|png)$/) != null;
		let iconName = '_blank';
		if (_.contains(ICON_EXTS, ext)) iconName = ext;

		let note;
		if (this.props.deleted) {
			note = <FormInput key="delete-note" noedit className="field-type-localfiles__note field-type-localfiles__note--delete">save to delete</FormInput>;
		} else if (this.props.isQueued) {
			note = <FormInput key="upload-note" noedit className="field-type-localfiles__note field-type-localfiles__note--upload">save to upload</FormInput>;
		}

		return (
			<FormField>
				<div style={{display: 'flex'}}>
					{isPicture &&
						<div style={{display: 'flex', width: 150, marginRight: 10}}>
							<img style={{width: '100%', height: '100%'}} key="file-type-icon" className="file-icon" src={`/files/${listKey}/${itemId}/${filename}/${originalname}`}/>
						</div>
					}
					<div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start', minHeight: 100, width: '100%'}}>
						<FormInput key="file-name" noedit className="field-type-localfiles__filename">
							<a href={`/files/${listKey}/${itemId}/${filename}/${originalname}`}>{originalname}</a>
							{this.props.size ? ' (' + bytes(this.props.size) + ')' : null}
						</FormInput>
						{note}
						<span style={{fontSize: 12}}>{`url: /files/${listKey}/${itemId}/${filename}/${originalname}`}</span>
						<div style={{borderRadius: '0.3em', borderStyle: 'solid', borderWidth: 1, borderColor: '#ccc #bdbdbd #adadad', backgroundImage: 'linear-gradient(to bottom, #fafafa 0, #eaeaea 100%', alignSelf: 'flex-end'}}>{this.renderActionButton()}</div>
					</div>
				</div>
			</FormField>
		);
	}

});

module.exports = Field.create({

	getInitialState () {
		var items = [];
		var self = this;

		_.each(this.props.value, function (item) {
			self.pushItem(item, items);
		});

		return { items: items };
	},

	removeItem (id) {
		var thumbs = [];
		var self = this;
		_.each(this.state.items, function (thumb) {
			if (thumb.props._id === id) {
				thumb.props.deleted = !thumb.props.deleted;
			}
			self.pushItem(thumb.props, thumbs);
		});

		this.setState({ items: thumbs });
	},

	pushItem (args, thumbs) {
		const {listKey} = this.props
		const {itemId} = this.props
		thumbs = thumbs || this.state.items;
		var i = thumbs.length;
		args.toggleDelete = this.removeItem.bind(this, args._id);
		args.shouldRenderActionButton = this.shouldRenderField();
		args.adminPath = Keystone.adminPath;
		thumbs.push(<LocalFilesFieldItem key={args._id} {...args} {...{listKey, itemId}} />);
	},

	fileFieldNode () {
		return ReactDOM.findDOMNode(this.refs.fileField);
	},

	renderFileField () {
		return <input ref="fileField" type="file" name={this.props.paths.upload} multiple className="field-upload" onChange={this.uploadFile} tabIndex="-1" />;
	},

	clearFiles () {
		this.fileFieldNode().value = '';

		this.setState({
			items: this.state.items.filter(function (thumb) {
				return !thumb.props.isQueued;
			})
		});
	},

	uploadFile (event) {
		var self = this;

		var files = event.target.files;
		_.each(files, function (f) {
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
		_.each(this.state.items, function (thumb) {
			if (thumb && thumb.props.deleted) remove.push(thumb.props._id);
		});
		if (remove.length) value = 'delete:' + remove.join(',');

		return <input ref="action" className="field-action" type="hidden" value={value} name={this.props.paths.action} />;
	},

	renderUploadsField () {
		return <input ref="uploads" className="field-uploads" type="hidden" name={this.props.paths.uploads} />;
	},

	renderNote: function() {
		if (!this.props.note) return null;
		return <FormNote note={this.props.note} />;
	},

	renderUI () {
		return (
			<FormField label={this.props.label} className="field-type-localfiles">
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
