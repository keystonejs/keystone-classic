jQuery(function($) {
	
	/** Create Item */
	
	$('.btn-create-item').click(function(e) {
		
		var $form = $(this).closest('form');
		
		$form.find('.form').show();
		
		$form.find('.toolbar-default').hide();
		$form.find('.toolbar-create').show();
		
		$form.find('input[type=text]').first().focus();
		
	});
	
	// Autofocus the search field if there has been a search
	
	if ($('.search-list input').val()) {
		setTimeout(function() {
			$('.search-list input').focus();
		},10);
	}
	
	$('.btn-cancel-create-item').click(function(e) {
		
		var $form = $(this).closest('form');
		
		$form.find('.form').hide();
		
		$form.find('.toolbar-default').show();
		$form.find('.toolbar-create').hide();
		
	});
	
	/** Columns */
	
	$('.btn-toggle-column').click(function(e) {
		var key = $(this).data('col');
		if (_.contains(Keystone.list.cols, key)) {
			$.addSearchParam({ cols: _.without(Keystone.list.cols, key).join(',') }, true);
		} else {
			Keystone.list.cols.push(key);
			$.addSearchParam({ cols: Keystone.list.cols.join(',') }, true);
		}
	});
	
	/** Filtering */
	
	var checkFiltersStatus = function() {
		var enabledFilters = $('.filter.active'),
			enabledPaths = _.map(enabledFilters, function(i) { return $(i).data('path') });
		$('.list-filters-action')[enabledFilters.length ? 'show' : 'hide']();
		$('.add-list-filter').each(function() {
			var path = $(this).data('path');
			$(this).parent()[_.contains(enabledPaths, path) ? 'addClass' : 'removeClass']('disabled');
		});
	}
	
	checkFiltersStatus();
	
	$('.add-list-filter').click(function(e) {
		var path = $(this).data('path');
		var $filter = $('.filter[data-path=' + path + ']').addClass('active');
		$(window).scrollTop(0);
		checkFiltersStatus();
		var $input = $filter.find('input[type=text]');
		if ($input.length) {
			try { $input[0].focus(); }
			catch(e) {}
		}
	});
	
	$('.clear-filter').click(function(e) {
		var $filter = $(this).closest('.filter').removeClass('active');
		checkFiltersStatus();
	});
	
	$('#list-filters').submit(function(e) {
		
		e.preventDefault();
		
		var filters = [],
			search = $(this).find('#list-search').val();
		
		$(this).find('.filter.active').each(function() {
			
			var $filter = $(this),
				$ops = $filter.find('.btn.active[data-opt]'), // active options
				data = {
					type: $filter.data('type'),
					path: $filter.data('path')
				},
				str = data.path + ':';
			
			$ops.each(function() {
				console.log(data.type + ': ' + data.path + ': ' + $(this).data('opt') + ': ' + $(this).data('value'));
				data[$(this).data('opt')] = $(this).data('value');
			});
			
			if (data.inv) {
				str += '!:';
			}
			
			if (data.exact) {
				str += '=:';
			}
			
			if (data.operator) {
				str += data.operator + ':';
			}
			
			switch (data.type) {
				
				case 'text':
				case 'textarea':
				case 'html':
				case 'email':
				case 'url':
				case 'key':
					str += $filter.find('input[name=value]').val();
				break;
				
				case 'number':
				case 'money':
					var num = Number($filter.find('input[name=value]').val());
					if (num || num === 0) {
						str += num;
					}
				break;
				
				case 'date':
				case 'datetime':
					var date = moment($filter.find('input[name=value]').val());
					if (date && date.isValid()) {
						str += date.format('YYYY-MM-DD');
					}
				break;
				
				case 'select':
					str += $filter.find('select').val();
				break;
				
				case 'location':
					var loc = [];
					$filter.find('input[type=text]').each(function() {
						loc.push($(this).val());
					});
					str += loc.join(':');
				break;
				
				case 'boolean':
				case 'cloudinaryimage':
				case 'cloudinaryimages':
				case 's3file':
					str += data.value;
				break;
				
			}
			
			filters.push(str);
			
		});
		
		$.addSearchParam({
			search: search || undefined,
			q: filters.join(';') || undefined
		}, true);
	
	});
	
	/** List Controls */
	
	$('a.control-delete').hover(function(e) {
		$(this).closest('tr').addClass('delete-hover');
	}, function(e) {
		$(this).closest('tr').removeClass('delete-hover');
	}).click(function(e) {
		e.preventDefault();
		if (!confirm('Are you sure you want to delete this ' + Keystone.list.singular.toLowerCase() + '?')) {
			return false;
		}
		var $row = $(this).closest('tr');
		$row.addClass('delete-inprogress');
		var onError = function(err) {
			if (err && err.responseJSON) {
				err = err.responseJSON;
			}
			var errorMessage = 'There was an error deleting the ' + Keystone.list.singular.toLowerCase() + '.';
			if (err && err.error) {
				errorMessage += ' ( error: ' + err.error + ')';
			}
			alert(errorMessage);
			$row.removeClass('delete-inprogress');
		}
		$.ajax('/keystone/api/' + Keystone.list.path + '/delete', {
			data: {
				id: $row.attr('id')
			},
			dataType: 'json'
		}).done(function(rtn) {
			if (rtn.success) {
				$row.remove();
			} else {
				onError(rtn);
			}
		}).error(onError);
	});
	
	$('a.control-sort').hover(function(e) {
		$(this).closest('tr').addClass('sort-hover');
	}, function(e) {
		$(this).closest('tr').removeClass('sort-hover');
	});
	
});
