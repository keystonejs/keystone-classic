jQuery(function($) {
	
	// TODO: This script file should really only be included on the item screen, discuss
	if (!window.tinymce)
		return;
	
	tinymce.init({
		selector: 'textarea.wysiwyg',
		menubar: false,
		plugins: [ 'code', 'link' ],
		toolbar: 'code | bold italic | alignleft aligncenter alignright | bullist numlist | outdent indent | link'
	});
	
});