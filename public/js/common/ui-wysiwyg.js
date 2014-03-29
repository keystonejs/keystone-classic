jQuery(function($) {
	
	if (!window.tinymce)
		return;
	
	tinymce.init({
		selector: 'textarea.wysiwyg',
		menubar: false,
		plugins: [ 'code', 'link', 'uploadimage' ],
		toolbar: 'bold italic | alignleft aligncenter alignright | bullist numlist | outdent indent | link | code | uploadimage',
		skin: 'keystone',
		uploadimage_form_url: '/keystone/cloudinary/upload'
	});
	
});
