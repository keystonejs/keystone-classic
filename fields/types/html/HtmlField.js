import Field from '../Field';
import React from 'react';
import { FormInput } from 'elemental';
import $script from 'scriptjs';
import TinyMce from 'react-tinymce-input';

let editorLoaded = !!global.tinymce;

module.exports = Field.create({

	displayName: 'HtmlField',
	statics: {
		type: 'Html',
	},

	getInitialState () {
		return {
			isFocused: false,
			editorLoaded,
		};
	},

	componentWillMount () {
		this.tinymceConfig = this.getOptions();
	},

	componentDidMount () {
		if (this.props.wysiwyg && !this.state.editorLoaded) {
			this.loadEditor();
		}
	},

	loadEditor () {
		$script(`${Keystone.adminPath}/lib/tinymce/tinymce.min.js`, () => {
			this.setState({ editorLoaded: true });
		});
	},

	handleFocus () {
		this.setState({ isFocused: true });
	},

	handleBlur () {
		this.setState({ isFocused: false });
	},

	handleChange (value) {
		const { onChange, path } = this.props;
		onChange({ path, value });
	},

	// TODO this doesn't seem very logical, especially overrideToolbar
	getOptions () {
		const plugins = ['code', 'link'];
		const options = {
			...Keystone.wysiwyg.options,
			...this.props.wysiwyg,
		};
		let toolbar = options.overrideToolbar ? '' : 'bold italic | alignleft aligncenter alignright | bullist numlist | outdent indent | removeformat | link ';

		if (options.enableImages) {
			plugins.push('image');
			toolbar += ' | image';
		}

		if (options.enableCloudinaryUploads || options.enableS3Uploads) {
			plugins.push('uploadimage');
			toolbar += options.enableImages ? ' uploadimage' : ' | uploadimage';
		}

		if (options.additionalButtons) {
			toolbar = `${toolbar} | ${options.additionalButtons.split(',').join(' | ')}`;
		}
		if (options.additionalPlugins) {
			plugins.push.apply(options.additionalPlugins.split(','));
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
			toolbar,
			plugins,
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

	renderField () {
		const { height, value, path, wysiwyg } = this.props;
		const { isFocused, editorLoaded } = this.state;
		const { tinymceConfig } = this;
		const className = isFocused ? 'is-focused' : '';
		const fieldClassName = wysiwyg ? 'wysiwyg' : 'code';
		const name = this.getInputName(path);
		const style = { minHeight: height };
		const showEditor = wysiwyg && editorLoaded;
		return (
			<div className={className}>
				{showEditor ? (
					<TinyMce
						onChange={this.handleChange}
						onFocus={this.handleFocus}
						onBlur={this.handleBlur}
						className={fieldClassName}
						style={style}
						tinymceConfig={tinymceConfig}
						name={name}
						value={value}
					/>
				) : (
					<FormInput
						multiline
						style={style}
						onChange={ev => this.handleChange(ev.target.value)}
						className={fieldClassName}
						name={name}
						value={value}
					/>
				)}
			</div>
		);
	},

	renderValue () {
		const { value } = this.props;
		return <FormInput multiline noedit value={value} />;
	},

});
