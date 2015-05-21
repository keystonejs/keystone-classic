var _ = require('underscore');
var React = require('react');
var Field = require('../Field');

var Button = require('elemental').Button;
var FormField = require('elemental').FormField;
var FormInput = require('elemental').FormInput;

var SUPPORTED_TYPES = ['image/gif', 'image/png', 'image/jpeg', 'image/bmp', 'image/x-icon', 'application/pdf', 'image/x-tiff', 'image/x-tiff', 'application/postscript', 'image/vnd.adobe.photoshop', 'image/svg+xml'];

var Thumbnail = React.createClass({
	
	displayName: 'CloudinaryImagesField',
	
	render: function() {
		var iconClassName, imageDetails;

		if (this.props.deleted) {
			iconClassName = 'delete-pending mega-octicon octicon-x';
		} else if (this.props.isQueued) {
			iconClassName = 'img-uploading mega-octicon octicon-cloud-upload';
		}

		var previewClassName = 'image-preview';
		if (this.props.deleted || this.props.isQueued) previewClassName += ' action';

		var title = '';
		var width = this.props.width;
		var height = this.props.height;
		if (width && height) title = width + ' x ' + height;

		var actionLabel = this.props.deleted ? 'Undo' : 'Remove';

		if (!this.props.isQueued) {
			imageDetails = (
				<div className='image-details'>
					<Button type="link-cancel" block onClick={this.props.toggleDelete}>{actionLabel}</Button>
				</div>
			);
		}

		return (
			<div className="image-field image-sortable row col-sm-3 col-md-12" title={title}> 
				<div className={previewClassName}> 
					<a href={this.props.url} className="img-thumbnail" target="__blank">
						<img style={ { height: '90'} } className="img-load" src={this.props.url} />
						<span className={iconClassName} />
					</a>
				</div>

				{imageDetails}
			</div>
		);
	}
	
});

module.exports = Field.create({

	getInitialState: function() {
		var thumbnails = [];
		var self = this;

		_.each(this.props.value, function (item) {
			self.pushThumbnail(item, thumbnails);
		});

		return { thumbnails: thumbnails };
	},

	removeThumbnail: function (i) {
		var thumbs = this.state.thumbnails;
		var thumb = thumbs[i];

		if (thumb.props.isQueued) {
			thumbs[i] = null;
		} else {
			thumb.props.deleted = !thumb.props.deleted;
		}

		this.setState({ thumbnails: thumbs });
	},

	pushThumbnail: function (args, thumbs) {
		thumbs = thumbs || this.state.thumbnails;
		var i = thumbs.length;
		args.toggleDelete = this.removeThumbnail.bind(this, i);
		thumbs.push(<Thumbnail key={i} {...args} />);
	},

	fileFieldNode: function() {
		return this.refs.fileField.getDOMNode();
	},

	getCount: function (key) {
		var count = 0;

		_.each(this.state.thumbnails, function (thumb) {
			if (thumb && thumb.props[key]) count++;
		});

		return count;
	},

	renderFileField: function() {
		return <input ref='fileField' type='file' name={this.props.paths.upload} multiple className='field-upload' onChange={this.uploadFile} />;
	},

	clearFiles: function() {
		this.fileFieldNode().value = '';

		this.setState({
			thumbnails: this.state.thumbnails.filter(function (thumb) {
				return !thumb.props.isQueued;
			})
		});
	},

	uploadFile: function (event) {
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

	changeImage: function() {
		this.fileFieldNode().click();
	},

	hasFiles: function() {
		return this.refs.fileField && this.fileFieldNode().value;
	},

	renderToolbar: function() {
		var body = [];

		var push = function (queueType, alertType, count, action) {
			if (count <= 0) return;

			var imageText = count === 1 ? 'image' : 'images';

			body.push(<div key={queueType + '-toolbar'} className={queueType + '-queued' + ' u-float-left'}>
				<FormInput noedit>{count} {imageText} {action} - save to confirm</FormInput>
			</div>);
		};

		push('upload', 'success', this.getCount('isQueued'), 'queued for upload');
		push('delete', 'danger', this.getCount('deleted'), 'removed');

		var clearFilesButton;
		if (this.hasFiles()) {
			clearFilesButton = <Button type="link-cancel" onClick={this.clearFiles} className="ml-5">Clear selection</Button>;
		}

		return (
			<div className="images-toolbar row col-sm-3 col-md-12">
				<div className="u-float-left">
					<Button onClick={this.changeImage}>Select files</Button>
					{clearFilesButton}
				</div>
				{body}
			</div>
		);
	},

	renderPlaceholder: function() {
		return (
			<div className="image-field image-upload row col-sm-3 col-md-12" onClick={this.changeImage}>
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

	renderContainer: function() {
		return (
			<div className="images-container clearfix">
				{this.state.thumbnails}
			</div>
		);
	},

	renderFieldAction: function() {
		var value = '';
		var remove = [];
		_.each(this.state.thumbnails, function (thumb) {
			if (thumb && thumb.props.deleted) remove.push(thumb.props.public_id);
		});
		if (remove.length) value = 'remove:' + remove.join(',');

		return <input ref="action" className="field-action" type="hidden" value={value} name={this.props.paths.action} />;
	},

	renderUploadsField: function() {
		return <input ref="uploads" className="field-uploads" type="hidden" name={this.props.paths.uploads} />;
	},

	renderUI: function() {
		return (
			<FormField label={this.props.label} className="field-type-cloudinaryimages">
				{this.renderFieldAction()}
				{this.renderUploadsField()}
				{this.renderFileField()}
				{this.renderContainer()}
				{this.renderToolbar()}
			</FormField>
		);
	}
});
