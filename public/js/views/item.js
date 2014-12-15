jQuery(function($) {
	
	var $fields = $('.field'),
		fieldsMap = {};
	
	/*
		The WYSIWYG editor fails to initialise on a hidden element, so we have to
		wait about a second before we actually hide elements. The _initQueue
		manages this for us.
	*/
	var _initQueue = [],
		waitForInit = function(fn) {
		if (_initQueue) {
			_initQueue.push(fn);
		} else {
			fn();
		}
	}
	setTimeout(function() {
		while (_initQueue.length) {
			_initQueue.pop()();
		}
		_initQueue = null;
		$(window).trigger('redraw');
	}, 1000);
	
	$fields.each(function() {
		var $field = $(this);
		fieldsMap[$field.data('field-path')] = $field;
	});
	
	var getFieldValue = function($field) {
		
		if (!$field || !$field.length) {
			return undefined;
		}
		
		if ($field.data('field-noedit')) {
			
			switch ($field.data('field-type')) {
				case 'boolean':
				case 'select':
				case 'relationship':
				case 'cloudinaryimage':
				case 'cloudinaryimages':
				case 's3file':
					return $field.data('field-value');
			}
			
			return $field.find('.field-value').text();
			
		} else {
			
			switch ($field.data('field-type')) {
				case 'boolean':
					return $field.find('input[type=checkbox]').prop('checked');
				case 'select':
					return $field.find('select').val();
				case 'html':
				case 'textarea':
					return $field.find('textarea').val();
				case 'cloudinaryimage':
				case 'cloudinaryimages':
				case 's3file':
					return $field.data('field-value');
			}
			
			return _.reduce($field.find('input:not([type="checkbox"])'), function(memo, input) {
				memo += $(input).val();
				return memo;
			}, '');
			
		}
		
	}
	
	$('.field[data-field-collapse=true]').each(function() {
		
		var $field = $(this),
			value = getFieldValue($field);
		
		if (!value) {
			
			if ($field.data('field-noedit')) {
				return $field.remove();
			}
			
			$field.wrapInner('<div class="field-hidden">');
			
			waitForInit(function() {
				$field.find('.field-hidden').hide();
			});
			
			if ($field.data('field-noedit'))
				return;
			
			var fieldLabel = ($field.data('field-type') == 'location') ? $field.find('label').first().text().replace('(show more fields)', '') : $field.find('.field-label').first().text();
			
			var $show = $('<div class="col-sm-12"><label class="uncollapse"><a href="javascript:;" class="btn-uncollapse">+ Add ' + fieldLabel.toLowerCase() + '</a></label></div>');
			
			$show.on('click', function(e) {
				$show.remove();
				$field.find('.field-hidden').removeClass('field-hidden').show();
				setTimeout(function() {
					try {
						$field.find('.form-control')[0].focus();
					} catch(e) {}
					$(window).trigger('redraw');
				}, 10);
			});
			
			$field.prepend($show);
			
		}
		
	});
	
	$('.field, .form-heading').filter('[data-field-depends-on]').each(function() {
		
		var $field = $(this),
			dependsOn = $field.data('field-depends-on'),
			conditions = {},
			lastMet;
		
		_.each(dependsOn, function(val, path) {
			conditions[path] = {
				$field: fieldsMap[path],
				value: val
			};
		});
		
		var hideField = function() {
			$field.addClass('field-hidden');
			waitForInit(function() {
				if ($field.hasClass('field-hidden')) {
					$field.hide();
				}
			});
		}
		
		var showField = function() {
			$field.removeClass('field-hidden').show();
		}
		
		var evalConditions = function() {
			
			// console.log('evaluating conditions for ' + $field.data('field-path') + ':');
			
			var met = _.all(conditions, function(cond, path) {
				var value = getFieldValue(cond.$field);
				
				// if cond.value is an array loop through 
				if(_.isArray(cond.value)) {
					
					var findme = _.find(cond.value,function(v) {
						// console.log('evaluating condition ' + path + ' == (' + v + ') with (' + value + ')',v==value)
						return (v === true && value || v == value);
					});
					return findme ? true : false;
					
				} else {
					// console.log('evaluating condition ' + path + ' == (' + cond.value + ') with (' + value + ')')
					return (cond.value === true && value || cond.value == value);
				}
				
			});
			
			// console.log(met ? '(met)' : '(not met)');
			
			if (met === lastMet) {
				return;
			}
			
			lastMet = met;
			
			if (met) {
				showField();
			} else {
				hideField();
			}
			
			$(window).trigger('redraw');
			
		}
		
		_.each(conditions, function(cond) {
			cond.$field.on('change', evalConditions);
		});
		
		evalConditions();
		
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
	
	$('.btn-change-password').click(function(e) {
		
		var $field = $(this).closest('.field');
		
		$field.find('input').val('');
		$field.find('.leave-password').hide();
		$field.find('.change-password').show();
		
		$field.find('input')[0].focus();
		
		$(window).trigger('redraw');
		
	});
	
	$('.btn-leave-password').click(function(e) {
		
		var $field = $(this).closest('.field');
		
		$field.find('input').val('');
		$field.find('.leave-password').show();
		$field.find('.change-password').hide();
		
		$(window).trigger('redraw');
		
	});
	
	$('.type-email[data-gravatar=true] input').on('change', function(e){
		
		var $field = $(this),
			$image = $field.siblings('img.img-gravatar'),
			src = $image.attr('src'),
			val = $field.val().toLowerCase().trim();
		
		if (val === '') {
			$image.hide();
			return;
		}
		else {
			$image.show();
		}
		
		$image.attr('src', src.replace(/^(\/\/www\.gravatar\.com\/avatar\/)[^\?]+(\?.*$)/i,'$1' + md5(val) + '$2'));
	});


	// show/hide the search form in the toolbar

	var item_breadcrumbs = $('.item-breadcrumbs'),
		item_searchform  = $('.searchbox');

	$('.js-itemsearch-open').click(function() {
		item_breadcrumbs.hide();
		item_searchform.show().find('input[type!=hidden]')[0].focus();
	});
	$('.js-itemsearch-close').click(function() {
		item_searchform.hide();
		item_breadcrumbs.show();
	});





	
});
