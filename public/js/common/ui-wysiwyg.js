jQuery(function($) {
	
	if (!window.tinymce)
		return;
	
	var images = $('.field.type-cloudinaryimage,.field.type-cloudinaryimages').find('img[data-wysiwyg=true]');
	
	var options = {
		selector: 'textarea.wysiwyg',
		menubar: false,
		plugins: [ 'code', 'link', 'image', 'images',],
		toolbar: 'bold italic | alignleft aligncenter alignright | bullist numlist | outdent indent | link ' + ( images.length ? '| images' : '' ) + ' | code',
		skin: 'keystone',
	};
	
	if (images.length)
		options.images_list = images;
	
	tinymce.init(options);
	
});
