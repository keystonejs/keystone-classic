var tinymce = require('tinymce'),
	React = require('react'),
	Field = require('../Field'),
	_ = require('underscore');

var lastId = 0;

function getId() {
	return 'keystone-html-' + lastId++;
}

module.exports = Field.create({
	
	displayName: 'HtmlField',
	
	getInitialState: function() {
		return {
			id: getId(),
			isFocused: false
		};
	},

	initWysiwyg: function() {
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

	componentDidUpdate: function(prevProps, prevState) {
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

	componentDidMount: function() {
		this.initWysiwyg();
	},
	
	componentWillReceiveProps: function(nextProps) {
		if (this.editor && this._currentValue !== nextProps.value) {
			this.editor.setContent(nextProps.value);
		}
	},
	
	focusChanged: function(focused) {
		this.setState({
			isFocused: focused
		});
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
		var plugins = ['code', 'link'],
			options = _.defaults(
				{},
				this.props.wysiwyg,
				Keystone.wysiwyg.options
			),
			toolbar = options.overrideToolbar ? '' : 'bold italic | alignleft aligncenter alignright | bullist numlist | outdent indent | link',
			i;

		if (options.enableImages) {
			plugins.push('image');
			toolbar += ' | image';
		}

		if (options.enableCloudinaryUploads) {
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
				importcss_merge_classes: true
			};
			
			_.extend(options.additionalOptions, importcssOptions);
		}
		
		if (!options.overrideToolbar) {
			toolbar += ' | code';
		}

		var opts = {
			selector: '#' + this.state.id,
			toolbar:  toolbar,
			plugins:  plugins,
			menubar:  options.menubar || false,
			skin:     options.skin || 'keystone'
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

		if (options.additionalOptions){
			_.extend(opts, options.additionalOptions);
		}

		return opts;
	},

	getFieldClassName: function() {
		var className = this.props.wysiwyg ? 'wysiwyg' : 'code';
		return className;
	},
	
	renderEditor: function(readOnly) {
		var className = this.state.isFocused ? 'is-focused' : '';
		var style = {
			height: this.props.height
		};
		return (
			<div className={className}>
				<textarea ref='editor' style={style} onChange={this.valueChanged} id={this.state.id} className={this.getFieldClassName()} name={this.props.path} readOnly={readOnly} value={this.props.value}></textarea>
			</div>
		);
	},

	renderField: function() {
		return this.renderEditor();
	},
	
	renderValue: function() {
		return this.renderEditor(true);
	}
	
});
