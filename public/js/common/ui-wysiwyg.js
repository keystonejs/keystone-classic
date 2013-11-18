jQuery(function($) {
	
	if (!window.tinymce)
		return;
	
	tinymce.init({
		selector: 'textarea.wysiwyg',
		menubar: false,
		plugins: [ 'code', 'link' ],
		toolbar: 'bold italic | alignleft aligncenter alignright | bullist numlist | outdent indent | link | code',
		skin: 'keystone'
	});
	
});