jQuery(function($) {
	
	tinymce.init({
		selector: 'textarea.wysiwyg',
		menubar: false,
		plugins: [ 'code', 'link' ],
		toolbar: 'bold italic | alignleft aligncenter alignright | bullist numlist | outdent indent | link | code',
		content_css: '/keystone/js/lib/tinymce/skins/lightgray/content.css'
	});
	
	// Image Fields
	$('.image-field').bind('dragstart', function(e) { // .img-draggable
		
		// Retrieve dragged data
		var data = e.originalEvent.dataTransfer.getData('text/html'),
			$el = $(data);
		
		// Detect invalid data
		if (!data || !$el.find('.img-draggable'.length)) {
			console.log('No valid draggable element detected.');
			e.originalEvent.dataTransfer.setData('text/html', '');
			return;
		}
		
		var $imgSrc = $el.find('.img-draggable'),
			imgData = $imgSrc.data();
		
		// Log data
		console.log(imgData);
		
		// Construct standardised HTML
		var imageHTML = '<a href="' + imgData.originalSrc + '" class="ui-popup">' + 
				'<img src="' + imgData.dragSrc + '" />' +
			'</a>';
		
		// Send back custom HTML
		e.originalEvent.dataTransfer.setData('text/html', imageHTML);
		
	});
	
});