jQuery(function($) {

	if (!window.tinymce)
		return;

	var plugins = [ 'code', 'link' ],
		toolbar = 'bold italic | alignleft aligncenter alignright | bullist numlist | outdent indent | link';

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

	toolbar += ' | code';

	//init editable wysiwygs
	tinymce.init({
		selector: 'textarea.wysiwyg',
		menubar: false,
		plugins: plugins,
		toolbar: toolbar,
		skin: 'keystone',
		uploadimage_form_url: '/keystone/api/cloudinary/upload'
	});

	//init non-editable wysiwygs
	tinymce.init({
		selector: 'textarea.wysiwyg-noedit',
		mode: 'textareas',
		readonly: true,
		menubar: false,
		plugins: plugins,
		toolbar: false,
		statusbar: false,
		skin: 'keystone'
	});


});
