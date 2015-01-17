jQuery(function($) {

	if (!window.tinymce)
		return;

	var plugins = [ 'code', 'link' ],
		toolbar = Keystone.wysiwyg.options.overrideToolbar ? '' : 'bold italic | alignleft aligncenter alignright | bullist numlist | outdent indent | link',
		skin = Keystone.wysiwyg.options.skin,
		menubar = Keystone.wysiwyg.options.menubar || false;

	if (Keystone.wysiwyg.options.enableImages) {
		plugins.push('image');
		toolbar += ' | image';
	}

	if (Keystone.wysiwyg.options.enableCloudinaryUploads) {
		plugins.push('uploadimage');
		toolbar += (Keystone.wysiwyg.options.enableImages) ? ' uploadimage' : ' | uploadimage';
	}

	if (Keystone.wysiwyg.options.additionalButtons) {
		var additionalButtons = Keystone.wysiwyg.options.additionalButtons.split(',');
		for (var i=0; i<additionalButtons.length; i++) {
			toolbar += (' | ' + additionalButtons[i]);
		}
	}
	if (Keystone.wysiwyg.options.additionalPlugins) {
		var additionalPlugins = Keystone.wysiwyg.options.additionalPlugins.split(',');
		for (var i=0; i<additionalPlugins.length; i++) {
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
	toolbar += ' | code';

	//init editable wysiwygs
	var tinymceOptions = {
		selector: 'textarea.wysiwyg',
		menubar: menubar,
		plugins: plugins,
		toolbar: toolbar,
		skin: skin,
		uploadimage_form_url: '/keystone/api/cloudinary/upload'
	};

	if (Keystone.wysiwyg.options.additionalOptions){
		$.extend(tinymceOptions,Keystone.wysiwyg.options.additionalOptions);
	}

	tinymce.init(tinymceOptions);
	
	console.log(tinymceOptions);

	//init non-editable wysiwygs
	var tinymceOptionsNonEditable = {
		selector: 'textarea.wysiwyg-noedit',
		mode: 'textareas',
		readonly: true,
		menubar: false,
		plugins: plugins,
		toolbar: 'code',
		statusbar: false,
		skin: 'keystone'
	};

	if (Keystone.wysiwyg.options.additionalOptions){
		$.extend(tinymceOptionsNonEditable,Keystone.wysiwyg.options.additionalOptions);
	}


	tinymce.init(tinymceOptionsNonEditable);

});
