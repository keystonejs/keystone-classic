jQuery(function($) {
	
	$('.ui-related-item').each(function() {
		
		var $el = $(this),
			data = $el.data(),
			itemId = $el.html();
		
		var loaded = function(data) {
			$el.html(data.name);
		};
		
		$.ajax('/prospekt/api/' + data.refPath + '/get', {
			data: {
				id: itemId,
				dataset: 'simple'
			},
			dataType: 'json'
		}).done(loaded);
		
	});
	
	$('.btn-delete-image').click(function(e) {
		
		var $field = $(this).closest('.field');
		
		if (e.altKey) {
			if (!confirm("Are you sure you want to delete the image?\n\n"))
				return;
			$field.find('.field-action').val('delete');
		} else {
			$field.find('.field-action').val('clear');
		}
		
		$field.find('.has-image').removeClass('has-image');
		$field.find('.image-preview').remove();
		$field.find('.image-details').remove();
		
		$(this).remove();
		
		$(window).trigger('redraw');
		
	});
	
	$('.btn-change-password').click(function(e) {
		
		var $field = $(this).closest('.field');
		
		$field.find('input').val('');
		$field.find('.leave-password').hide();
		$field.find('.change-password').show();
		
		$field.find('input')[0].focus();
		
	});
	
	$('.btn-leave-password').click(function(e) {
		
		var $field = $(this).closest('.field');
		
		$field.find('input').val('');
		$field.find('.leave-password').show();
		$field.find('.change-password').hide();
		
	});
	
});