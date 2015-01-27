var tinymce = require('tinymce'),
	React = require('react'),
	Field = require('../Field'),
	_ = require('underscore');

var lastId = 0;

function getId() {
	return 'keystone-html-' + lastId++;
}

module.exports = Field.create({
	
	getInitialState: function() {
		return {
			id: getId()
		};
	},

	componentDidMount: function() {
		if (!this.props.wysiwyg) return;
		
		var self = this;
		var opts = this.getOptions();

		opts.setup = function (editor) {
			self.editor = editor;
			editor.on('change', self.valueChanged);
		};

		this._currentValue = this.props.value;
		tinymce.init(opts);
	},
	
	componentWillReceiveProps: function(nextProps) {
		if (this.editor && this._currentValue !== nextProps.value) {
			this.editor.setContent(nextProps.value);
		}
	},

	valueChanged: function () {
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
			value: content
		});
	},

	getOptions: function() {
  		var plugins = [ 'code', 'link' ],
  			toolbar = Keystone.wysiwyg.options.overrideToolbar ? '' : 'bold italic | alignleft aligncenter alignright | bullist numlist | outdent indent | link';

		if (Keystone.wysiwyg.options.enableImages) {
			plugins.push('image');
			toolbar += ' | image';
		}

		if (Keystone.wysiwyg.options.enableCloudinaryUploads) {
			plugins.push('uploadimage');
			toolbar += Keystone.wysiwyg.options.enableImages ? ' uploadimage' : ' | uploadimage';
		}

		if (Keystone.wysiwyg.options.additionalButtons) {
			var additionalButtons = Keystone.wysiwyg.options.additionalButtons.split(',');
			for (var i = 0; i < additionalButtons.length; i++) {
				toolbar += (' | ' + additionalButtons[i]);
			}
		}
		if (Keystone.wysiwyg.options.additionalPlugins) {
			var additionalPlugins = Keystone.wysiwyg.options.additionalPlugins.split(',');
			for (var i = 0; i < additionalPlugins.length; i++) {
				plugins.push(additionalPlugins[i]);
			}
		}
		if (Keystone.wysiwyg.options.importcss) {
			plugins.push('importcss');
			var importcssOptions = {
				content_css: Keystone.wysiwyg.options.importcss,
				importcss_append: true,
				importcss_merge_classes: true
			};
			$.extend(Keystone.wysiwyg.options.additionalOptions,importcssOptions);
		}
		if (!Keystone.wysiwyg.options.overrideToolbar) {
			toolbar += ' | code';
		}

		var opts = {
			selector: '#' + this.state.id,
			toolbar:  toolbar,
			plugins:  plugins,
			menubar:  Keystone.wysiwyg.options.menubar || false,
			skin:     Keystone.wysiwyg.options.skin || 'keystone'
		};

		if (this.shouldRenderField()) {
			opts.uploadimage_form_url = '/keystone/api/cloudinary/upload';
		} else {
			_.extend(opts, {
				mode: 'textareas',
				readonly: true,
				menubar: false,
				toolbar: 'code',
				statusbar: false
			});
		}

		if (Keystone.wysiwyg.options.additionalOptions){
			_.extend(opts, Keystone.wysiwyg.options.additionalOptions);
		}

		return opts;
	},

	getFieldClassName: function() {
		return this.props.wysiwyg ? 'wysiwyg' : 'code';
	},
	
	renderEditor: function(readOnly) {
		var style = {
			height: this.props.height
		};
		return (
			<textarea ref='editor' style={style} onChange={this.valueChanged} id={this.state.id} className={this.getFieldClassName()} name={this.props.path} readOnly={readOnly} value={this.props.value}></textarea>
		);
	},

	renderField: function() {
		return this.renderEditor();
	},
	
	renderValue: function() {
		return this.renderEditor(true);
	}
	
});
