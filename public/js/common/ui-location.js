jQuery(function($) {
	
	$('.field.type-location').each(function() {
		
		var $field = $(this),
			$extras = $field.find('.extras'),
			visible = 0;
		
		$extras.each(function() {
			var $this = $(this);
			if (_.any($(this).find('input'), function(i) { return $(i).val() })) {
				visible++;
				$this.show();
			}
		});
		
		if (visible >= $extras.length) {
			$field.find('.btn-show-extras').remove();
		} else {
			$field.find('.btn-show-extras').on('click', function() {
				$(this).remove();
				$field.find('.extras').show();
				$(window).trigger('redraw');
			});
		}
		
		$field.find('.autoimprove').on('change', function() {
			$field.find('.overwrite')[$field.find('.autoimprove input').prop('checked') ? 'show' : 'hide']();
			$(window).trigger('redraw');
		});
		
	});
	
});