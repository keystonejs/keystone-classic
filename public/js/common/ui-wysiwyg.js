jQuery(function($) {
	
	// TODO: This script file should really only be included on the item screen, discuss
	if (!window.tinymce)
		return;
	
	tinymce.init({
		selector: 'textarea.wysiwyg',
		menubar: false,
		plugins: [ 'code', 'link' ],
		toolbar: 'bold italic | alignleft aligncenter alignright | bullist numlist | outdent indent | link | code',
		content_css: '/keystone/js/lib/tinymce/skins/lightgray/content.css'
	});
	
	// Cloudinary Images Integration
	$('.field.type-cloudinaryimages').bind('dragstart', function(e) {
		
		// Retrieve dragged data
		var data = e.originalEvent.dataTransfer.getData('text/html'),
			$data = $(data);
		
		// Detect invalid data
		if (!data || !$data.hasClass('image-preview')) {
			console.log('No valid data detected.');
			e.originalEvent.dataTransfer.setData('text/html', '');
			return;
		}
		
		// Log original data
		// console.log(data);
		
		// Retrieve a and img tags
		var $link = $data.find('a'),
			link = $link.data();
		
		var $img = $data.find('img'),
			img = $img.data();
		
		// Log data
		console.log(link);
		console.log(img);
		
		// Construct enlarged image
		var imgSrc = 'http://res.cloudinary.com/do48r7mh6/image/upload/w_500,h_500,c_fit/' + link.id + '.jpg';
		
		// Construct standardised HTML
		var imageHTML = '<a href="' + $link.prop('href') + '" class="ui-popup">' + 
				'<img src="' + imgSrc + '" />' +
			'</a>';
		
		// Log new data
		// console.log(imageHTML);
		
		// Send back custom HTML
		e.originalEvent.dataTransfer.setData('text/html', imageHTML);
		
	});
	
});