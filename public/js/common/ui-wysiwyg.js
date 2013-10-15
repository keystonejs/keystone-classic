jQuery(function($) {
	
	if (!window.tinymce)
		return;
	
	tinymce.init({
		selector: 'textarea.wysiwyg',
		menubar: false,
		statusbar: false,
		plugins: [ 'code', 'link' ],
		toolbar: 'bold italic | alignleft aligncenter alignright | bullist numlist | outdent indent | link image | code'
		// skin: 'keystone'
	});
	
	// Draggable Image Fields (WIP)
	$('[draggable=true]').bind('dragenter', function(e) {
		e.preventDefault();
		return false;
	});
	
	$('[draggable=true]').bind('dragover', function(e) {
		e.preventDefault();
		return false;
	});
	
	$('[draggable=true]').bind('dragstart', function(e) {
		
		// Retrieve dragged data
		var data = e.originalEvent.dataTransfer.getData('text/html');
		
		// Detect invalid data
		if (!data) {
			console.log('[wysiwyg.image.dragging] - No valid draggable element detected.');
			e.originalEvent.dataTransfer.setData('text/html', '');
			return;
		}
		
		// Populate source HTML
		var $imgSrc = $(data);
		
		// Detect and find valid image element (cross browser compatibility)
		if ($imgSrc.prop('tagName').toLowerCase() != 'img') {
			console.log('[wysiwyg.image.dragging] - No image element detected, attempting to find nested element.');
			$imgSrc = $imgSrc.find('img');
			
			// Abort if no suitable element is found
			if (!$imgSrc.length) {
				console.log('[wysiwyg.image.dragging] - No image element detected, aborting.');
				e.originalEvent.dataTransfer.setData('text/html', '');
				return;
			}
		}
		
		// Retrieve and check data
		var imgData = $imgSrc.data();
		
		if (!imgData.dragOriginal || !imgData.dragSrc) {
			console.log('[wysiwyg.image.dragging] - No drag original or drag src detected on image.', imgData);
			e.originalEvent.dataTransfer.setData('text/html', '');
			return;
		}
		
		console.log('[wysiwyg.image.dragging] - Image data:', imgData);
		
		var imageHTML;
		
		// TODO: Parse and generate template
		// if (dragImage.dragTemplate) {
			// parse the template
		// } else {}
		
		imageHTML = '<img src="' + imgData.dragSrc + '"';
			
		if (imgData.dragClass) {
			imageHTML += ' class="' + imgData.dragClass + '"';
		}
		
		if (imgData.dragOriginal) {
			imageHTML += ' data-original="' + imgData.dragOriginal + '"';
		}
		
		imageHTML += '>';
		
		e.originalEvent.dataTransfer.setData('text/html', imageHTML);
		
	});
	
});
