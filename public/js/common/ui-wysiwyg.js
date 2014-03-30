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
	
	toolbar += ' | code';
	
	tinymce.init({
		selector: 'textarea.wysiwyg',
		menubar: false,
		plugins: plugins,
		toolbar: toolbar,
		skin: 'keystone',
		uploadimage_form_url: '/keystone/api/cloudinary/upload'
	});
	
});
