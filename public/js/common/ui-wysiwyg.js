jQuery(function($) {
	
	tinymce.init({
		selector: 'textarea.wysiwyg'
	});
	
	/*
	$('textarea.wysiwyg').each(function() {
	
		var $field = $(this);
		
		if (!$field.prop('id'))
			$field.prop('id', 'ui-wysiwyg-' + new Date().getTime());
		
		tinymce.init({
			selector: '#' + $field.prop('id')
		});
		
		setTimeout(function() {
			$field.addClass('code');
		}, 1000);
	
	});
	*/
	
});