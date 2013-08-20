jQuery(function($) {
	
	$('.field[data-field-collapse=true]').each(function() {
		
		var $field = $(this),
			value = _.reduce($field.find('input'), function(input, memo) {
				return memo + $(input).val();
			}, '');
		
		if (!value) {
			$field.wrapInner('<div class="field-collapsed">');
			var $show = $('<a href="javascript:;" class="btn-uncollapse">set ' + $field.find('.field-label').text() + '</a>');
			$show.on('click', function(e) {
				$show.remove();
				$field.find('.field-collapsed').removeClass('field-collapsed').show();
				setTimeout(function() {
					try {
						$field.find('input')[0].focus();
					} catch(e) {}
				}, 10);
			});
			$field.prepend($show);
			// wait 500ms for field ui initialisation before hiding the field
			setTimeout(function() {
				$field.find('.field-collapsed').hide();
			}, 500);
		}
		
	});
	
	$('.ui-related-item').each(function() {
		
		var $el = $(this),
			data = $el.data(),
			itemId = $el.html();
		
		var loaded = function(data) {
			$el.html(data.name);
		};
		
		$.ajax('/keystone/api/' + data.refPath + '/get', {
			data: {
				id: itemId,
				dataset: 'simple'
			},
			dataType: 'json'
		}).done(loaded);
		
	});
	
	$('.field.type-relationship input[data-ref-filters]').each(function() {
		
		var $input = $(this),
			$field = $input.closest('.field'),
			data = $input.data(),
			depChanged = false;
		
		_.each(data.refFilters, function(value, key) {
			
			if (value.substr(0,1) != ':') {
				return;
			}
			
			var $related = $('#field_' + value.substr(1)),
				relatedData = $related.data();
			
			var trigger = function(msg) {
				depChanged = true;
				$field.find('.field-ui').hide();
				$field.find('.field-message').append('<span>' + msg + '</span>').show();
				$input.val('');
			}
			
			if (!$related.val() && !depChanged) {
				trigger('Please select a ' + relatedData.refSingular + ' and save before selecting a ' + data.refSingular + '.');
			} else {
				$related.on('change.dependency.' + $input.attr('id'), function(e) {
					if (!depChanged) {
						trigger(relatedData.refSingular + ' has changed. Please save to select a ' + data.refSingular + '.');
					}
				});
			}
			
		});
		
	});
	
	$('.btn-delete-image').click(function(e) {
		
		var $field = $(this).closest('.field');
		
		if (e.altKey) {
			if (!confirm("Are you sure you want to delete the image?\n\n"))
				return;
			$field.find('.field-action').val('delete');
		} else {
			$field.find('.field-action').val('reset');
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