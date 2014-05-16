/*global jQuery, moment, _, Keystone, alert, confirm */
jQuery(function($) {
	
	// Cache items
	var $filters = $('#list-filters');
	
	/** Create Item */
	
	$('.btn-create-item').click(function(){
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
	
	$('.btn-cancel-create-item').click(function() {
		var $form = $(this).closest('form');
		$form.find('.form').hide();
		$form.find('.toolbar-default').show();
		$form.find('.toolbar-create').hide();
	});
	
	/** Columns */
	
	$('.btn-toggle-column').click(function() {
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
			enabledPaths = _.map(enabledFilters, function(i) { return $(i).data('path'); });
		$('.list-filters-action')[enabledFilters.length ? 'show' : 'hide']();
		$('.add-list-filter').each(function() {
			var path = $(this).data('path');
			$(this).parent()[_.contains(enabledPaths, path) ? 'addClass' : 'removeClass']('disabled');
		});
	};
	
	checkFiltersStatus();
	
	$('.add-list-filter').click(function() {
		var path = $(this).data('path');
		var $filter = $('.filter[data-path="' + path + '"]').addClass('active');
		$(window).scrollTop(0);
		checkFiltersStatus();
		var $input = $filter.find('input[type=text]');
		if ($input.length) {
			try { $input[0].focus(); }
			catch(e) {}
		}
	});
	
	// Handle switching between number types
	// If the option selected is between, then show the between range inputs
	// otherwise show the standard input field
	$filters.on('change', '.filter .btn-group-operator :radio[name=options]', function(){
		// Fetch the radio that is now checked
		var $radio = $(this);
		// Fetch the field this is for
		var $field = $radio.parents('.filter-options:first');
		// As the value isn't stored on the radio, fetch the value from the parent button's data type
		// @BEN: this seems silly
		var numericFilter = $radio.parent().data('value');
		// Whether or not the range inputs should be shown or not
		var showRange = numericFilter === 'bt';
		// Toggle the displays of the fields
		$field.find('.filter-input-range').toggle(showRange).siblings('.filter-input-standard').toggle(!showRange);
	});
	// Ensure that the correct fields are shown initially
	$filters.find('.filter .btn-group-operator .btn.active :radio').trigger('change');
	
	
	$('.clear-filter').click(function() {
		$(this).closest('.filter').removeClass('active');
		checkFiltersStatus();
	});
	
	var parseValueWithType = function(type, value){
		var result = null;
		
		switch (type) {
			case 'number':
			case 'money':
				value = Number(value);
				if (value && isNaN(value) === false) {
					result = value;
				}
				break;
			
			case 'date':
			case 'datetime':
				value = moment(value);
				if (value && value.isValid()) {
					result = value.format('YYYY-MM-DD');
				}
				break;
		
			default:
				result = value;
				break;
		}
		
		return result;
	};
	
	$filters.submit(function(e) {
		
		e.preventDefault();
		
		var filterQueryString = [],
			search = $(this).find('#list-search').val(),
			cancelled = false;
		
		$(this).find('.filter.active').each(function() {
			
			var $filter = $(this),
				$ops = $filter.find('.btn.active[data-opt]'), // active options
				data = {
					type: $filter.data('type'),
					path: $filter.data('path')
				},
				queryParts = [data.path],
				value;
			
			$ops.each(function() {
				// console.log(data.type + ': ' + data.path + ': ' + $(this).data('opt') + ': ' + $(this).data('value'));
				data[$(this).data('opt')] = $(this).data('value');
			});
			
			if (data.inv) {
				queryParts.push('!');
			}
			
			if (data.exact) {
				queryParts.push('=');
			}
			
			if (data.operator) {
				queryParts.push(data.operator);
			}
			
			if ( data.operator === 'bt' ) {
				value = [
					parseValueWithType(data.type, $filter.find('input.filter-input-range1').val()),
					parseValueWithType(data.type, $filter.find('input.filter-input-range2').val())
				];
				if ( value[0] == null || value[1] == null ) {
					alert('Both fields are required when specifying a range');
					cancelled = true;
					return false;
				}
				queryParts.push(value[0], value[1]);
			}
			else {
				switch (data.type) {
					case 'text':
					case 'textarea':
					case 'html':
					case 'email':
					case 'url':
					case 'key':
					case 'number':
					case 'money':
					case 'date':
					case 'datetime':
					case 'select':
						if ( value = parseValueWithType(data.type, $filter.find('input[name=value]').val()) ) {
							queryParts.push(value);
						}
						break;
					
					case 'location':
						var locationParts = [];
						$filter.find('input[type=text]').each(function() {
							locationParts.push($(this).val());
						});
						queryParts.push.apply(queryParts, locationParts);
						break;
					
					case 'boolean':
					case 'cloudinaryimage':
					case 'cloudinaryimages':
					case 's3file':
						if ( data.value ) { // where is this defined???
							queryParts.push(value);
						}
						break;
					
					case 'relationship':
						if ( value = parseValueWithType(data.type, $filter.find('input[type=hidden]').val()) ) {
							queryParts.push(value);
						}
						break;
				}
			}
			
			filterQueryString.push(queryParts.join(':'));
		});
		
		if ( cancelled === false ) {
			$.addSearchParam({
				search: search || undefined,
				q: filterQueryString.join(';') || undefined
			}, true);
		}
	
	});
	
	/** List Controls */
	
	$('a.control-delete').hover(function() {
		$(this).closest('tr').addClass('delete-hover');
	}, function() {
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
		};
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
	
	$('a.control-sort').hover(function() {
		$(this).closest('tr').addClass('sort-hover');
	}, function() {
		$(this).closest('tr').removeClass('sort-hover');
	});
	
});
