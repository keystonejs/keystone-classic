jQuery(function($) {
	
	tinymce.init({
		selector: 'textarea.wysiwyg',
		menubar: false,
		statusbar: false,
		plugins: [ 'code', 'link' ],
		toolbar: 'bold italic | alignleft aligncenter alignright | bullist numlist | outdent indent | link | code',
		content_css: '/keystone/js/lib/tinymce/skins/lightgray/content.css'
	});
	
	// Draggable Image Fields (WIP)
	$('.img-thumbnail[draggable=true]').bind('dragstart', function(e) { // .img-draggable
		
		// Retrieve dragged data
		var data = e.originalEvent.dataTransfer.getData('text/html');
		
		// Detect invalid data
		if (!data) {
			console.log('[wysiwyg.image.dragging] - No valid draggable element detected.');
			e.originalEvent.dataTransfer.setData('text/html', '');
			return;
		}
		
		var $imgSrc = $(data).find('img');
		
		if (!$imgSrc.length) {
			console.log('[wysiwyg.image.dragging] - No image element detected.');
			e.originalEvent.dataTransfer.setData('text/html', '');
			return;
		}
		
		var imgData = $imgSrc.data();
		
		if (!imgData.originalSrc || !imgData.dragSrc) {
			console.log('[wysiwyg.image.dragging] - No original or drag src detected on image.', imgData);
			e.originalEvent.dataTransfer.setData('text/html', '');
			return;
		}
		
		// Log data
		console.log('[wysiwyg.image.dragging] - Image data:', imgData);
		
		// Construct standardised HTML
		var imageHTML = '<a href="' + imgData.originalSrc + '" class="ui-popup">' + 
				'<img src="' + imgData.dragSrc + '" />' +
			'</a>';
		
		// Send back optimised HTML
		e.originalEvent.dataTransfer.setData('text/html', imageHTML);
		
	});
	
});
