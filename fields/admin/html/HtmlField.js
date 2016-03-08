import _ from 'lodash';
import Field from '../Field';
import React from 'react';
import tinymce from 'tinymce';
import { FormInput } from 'elemental';

/**
 * TODO:
 * - Remove dependency on underscore
 */

var lastId = 0;

function getId () {
	return 'keystone-html-' + lastId++;
}

module.exports = Field.create({

	displayName: 'HtmlField',

	getInitialState () {
		return {
			id: getId(),
			isFocused: false,
		};
	},

	initWysiwyg () {
		if (!this.props.wysiwyg) return;

		var self = this;
		var opts = this.getOptions();

		opts.setup = function (editor) {
			self.editor = editor;
			editor.on('change', self.valueChanged);
			editor.on('focus', self.focusChanged.bind(self, true));
			editor.on('blur', self.focusChanged.bind(self, false));
		};

		this._currentValue = this.props.value;
		tinymce.init(opts);
	},

	componentDidUpdate (prevProps, prevState) {
		if (prevState.isCollapsed && !this.state.isCollapsed) {
			this.initWysiwyg();
		}

		if (_.isEqual(this.props.dependsOn, this.props.currentDependencies)
			&& !_.isEqual(this.props.currentDependencies, prevProps.currentDependencies)) {
			var instance = tinymce.get(prevState.id);
			if (instance) {
				tinymce.EditorManager.execCommand('mceRemoveEditor', true, prevState.id);
				this.initWysiwyg();
			} else {
				this.initWysiwyg();
			}
		}
	},

	componentDidMount () {
		this.initWysiwyg();
	},

	componentWillReceiveProps (nextProps) {
		if (this.editor && this._currentValue !== nextProps.value) {
			this.editor.setContent(nextProps.value);
		}
	},

	focusChanged (focused) {
		this.setState({
			isFocused: focused,
		});
	},

	valueChanged  () {
		var content;
		if (this.editor) {
			content = this.editor.getContent();
		} else if (this.refs.editor) {
			content = this.refs.editor.getDOMNode().value;
		} else {
			return;
		}

		this._currentValue = content;
		this.props.onChange({
			path: this.props.path,
			value: content,
		});
	},

	getOptions () {
		var plugins = ['code', 'link'];
		var options = Object.assign(
				{},
				Keystone.wysiwyg.options,
				this.props.wysiwyg
			);
		var toolbar = options.overrideToolbar ? '' : 'bold italic | alignleft aligncenter alignright | bullist numlist | outdent indent | removeformat | link ';
		var i;

		if (options.enableImages) {
			plugins.push('image');
			toolbar += ' | image';
		}

		if (options.enableCloudinaryUploads || options.enableS3Uploads) {
			plugins.push('uploadimage');
			toolbar += options.enableImages ? ' uploadimage' : ' | uploadimage';
		}

		if (options.additionalButtons) {
			var additionalButtons = options.additionalButtons.split(',');
			for (i = 0; i < additionalButtons.length; i++) {
				toolbar += (' | ' + additionalButtons[i]);
			}
		}
		if (options.additionalPlugins) {
			var additionalPlugins = options.additionalPlugins.split(',');
			for (i = 0; i < additionalPlugins.length; i++) {
				plugins.push(additionalPlugins[i]);
			}
		}
		if (options.importcss) {
			plugins.push('importcss');
			var importcssOptions = {
				content_css: options.importcss,
				importcss_append: true,
				importcss_merge_classes: true,
			};

			Object.assign(options.additionalOptions, importcssOptions);
		}

		if (!options.overrideToolbar) {
			toolbar += ' | code';
		}

		var opts = {
			selector: '#' + this.state.id,
			toolbar: toolbar,
			plugins: plugins,
			menubar: options.menubar || false,
			skin: options.skin || 'keystone',
		};

		if (this.shouldRenderField()) {
			opts.uploadimage_form_url = options.enableS3Uploads ? Keystone.adminPath + '/api/s3/upload' : Keystone.adminPath + '/api/cloudinary/upload';
		} else {
			Object.assign(opts, {
				mode: 'textareas',
				readonly: true,
				menubar: false,
				toolbar: 'code',
				statusbar: false,
			});
		}

		if (options.additionalOptions) {
			Object.assign(opts, options.additionalOptions);
		}

		return opts;
	},

	getFieldClassName () {
		var className = this.props.wysiwyg ? 'wysiwyg' : 'code';
		return className;
	},

	renderField () {
		var className = this.state.isFocused ? 'is-focused' : '';
		var style = {
			height: this.props.height,
		};
		return (
			<div className={className}>
				<FormInput multiline ref="editor" style={style} onChange={this.valueChanged} id={this.state.id} className={this.getFieldClassName()} name={this.props.path} value={this.props.value} />
			</div>
		);
	},

	renderValue () {
		return <FormInput multiline noedit value={this.props.value} />;
	},

});
