/*global jQuery, moment, _, Keystone, alert, confirm, require */
jQuery(function($) {
	// Import
	var queryfilterUtil = require('queryfilter'),
		querystringUtil = require('querystring');
	
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


	// --------------------------------
	// Recent Searches

	if (window.localStorage) {
		
		var querystring = querystringUtil.parse(document.location.search.replace('?', ''));
		var recentSearches;
		var $searchDropdown = $('.js-recent-searches');
		var $searches = $searchDropdown.find('ul');
		var key = 'keystone-recentsearches-' + Keystone.list.path;

		// Prase the recent searches
		try {
			recentSearches = JSON.parse(window.localStorage.getItem(key) || 'false');
		} catch (err) {}
		if (Array.isArray(recentSearches) === false) {
			recentSearches = [];
		}

		// Add the new search
		// If it exists, remove it where it was, and add it to the start
		// If it doesn't exist, just add it to the start
		if (querystring.q) {
			var existingIndex = recentSearches.indexOf(querystring.q);
			if (existingIndex !== -1) {
				recentSearches = recentSearches.slice(0, existingIndex).concat(recentSearches.slice(existingIndex+1));
			}
			recentSearches.unshift(querystring.q);
			recentSearches = recentSearches.slice(0, 20); // only keep the 20 most recent
			window.localStorage.setItem(key, JSON.stringify(recentSearches));
		}
		
		// Add the recent searches to the dom
		if (recentSearches.length !== 0) {
			recentSearches.forEach(function(recentSearch){
				var filter = queryfilterUtil.QueryFilters.create(recentSearch);
				var readablefilter = filter.toHumanString().replace(/([A-Z])/g, ' $1').toLowerCase(); // separate camel cased words
				var querystring = querystringUtil.parse(document.location.search.replace('?', ''));
				querystring.q = recentSearch;
				querystring = querystringUtil.stringify(querystring);
				$('<a>', {
					href: '?' + querystring,
					text: readablefilter.charAt(0).toUpperCase() + readablefilter.slice(1)
				}).appendTo($('<li>').appendTo($searches));
			});
			$searchDropdown.removeClass('hidden');
		}
	}


	// --------------------------------
	// Filters
	
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
			search = $(this).find('.js-search-list').val(),
			cancelled = false;
		
		$(this).find('.filter.active').each(function() {
			
			var $filter = $(this),
				$ops = $filter.find('.btn.active[data-opt]'), // active options
				data = {
					type: $filter.data('type'),
					path: $filter.data('path')
				},
				queryFilter = queryfilterUtil.QueryFilter.create(),
				value;
			
			$ops.each(function() {
				data[$(this).data('opt')] = $(this).data('value');
			});
			
			queryFilter.type = data.type;
			queryFilter.key = data.path;
			queryFilter.inverse = data.inv;
			queryFilter.exact = data.exact;
			queryFilter.operator = data.operator;
			
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
				queryFilter.value = value;
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
						if (value = parseValueWithType(data.type, $filter.find('input[name=value]').val())) {
							queryFilter.value = value;
						}
						break;
					
					case 'select':
						if (value = parseValueWithType(data.type, $filter.find('select[name=value]').val())) {
							queryFilter.value = value;
						}
						break;
					
					case 'location':
						value = [];
						$filter.find('input[type=text]').each(function() {
							value.push($(this).val());
						});
						queryFilter.value = value;
						break;
					
					case 'boolean':
					case 'cloudinaryimage':
					case 'cloudinaryimages':
					case 's3file':
						if (data.value) { // where is this defined???
							queryFilter.value = value;
						}
						break;
					
					case 'relationship':
						if (value = parseValueWithType(data.type, $filter.find('input[type=hidden]').val())) {
							queryFilter.value = value;
						}
						break;
				}
			}
			
			if (queryFilter.value != null) {
				filterQueryString.push(queryFilter.toString());
			}
			
		});
		
		if (cancelled === false) {
			$.addSearchParam({
				search: search || undefined,
				q: filterQueryString.join(';') || undefined
			}, true);
		}
	
	});
	
	/** List Controls */
	$('table.items-list tbody').on('mouseenter mouseleave', 'tr a.control-delete', function(e) {
		if (e.type == 'mouseenter') {
			$(this).closest('tr').addClass('delete-hover');
		} else {
			$(this).closest('tr').removeClass('delete-hover');
		}
	}).on('click', 'tr a.control-delete', function(e) {
		e.preventDefault();
		if (!confirm('Are you sure you want to delete this ' + Keystone.list.singular.toLowerCase() + '?')) {
			return false;
		}
		var $row = $(this).closest('tr'), 
			$table = $(this).closest('table');
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
			data: Keystone.csrf({
				id: $row.attr('id')
			}),
			dataType: 'json'
		}).done(function(rtn) {
			if (rtn.success) {
				// decrement total
				Keystone.items.total--;
				Keystone.items.totalPages = Math.ceil(Keystone.items.total / Keystone.list.perPage);

				// update .list-header
				if (!Keystone.items.total) {
					$('.page-header.list-header').addClass('empty-list');
					$('.items-total').text('No ' + Keystone.list.plural.toLowerCase() + ' found.');
					$('.search-sort').remove();
					$('form#list-filters').remove();
					$('.list-pagination').remove();
					$('.items-list-wrapper').remove();
					return;
				}

				if (Keystone.items.currentPage > Keystone.items.totalPages) {
					window.location.href = '/keystone/' + Keystone.list.path + '/' + Keystone.items.previous;
					return;
				}

				$row.remove();

				$('.items-total').text(Keystone.items.total + ' ' + (Keystone.items.total == 1 ? Keystone.list.singular : Keystone.list.plural));

				// update .list-pagination
				if (Keystone.items.totalPages == 1) {
					$('.list-pagination .count').text('Showing ' + Keystone.items.total + ' ' + (Keystone.items.total == 1 ? Keystone.list.singular : Keystone.list.plural));
				}
				if (Keystone.items.totalPages > 1) {
					if(Keystone.items.last > Keystone.items.total) {
						Keystone.items.last = Keystone.items.total;
						$('.list-pagination .count').text('Showing ' + Keystone.items.first + ' to ' + Keystone.items.last + ' of ' + Keystone.items.total);
					} else {
						$.ajax('/keystone/api/' + Keystone.list.path + '/fetch', {
							data: Keystone.csrf({
								items: { 
									first: Keystone.items.first,
									last: Keystone.items.last,
									total: Keystone.items.total,
									currentPage: Keystone.items.currentPage,
									totalPages: Keystone.items.totalPages
								},
								search: Keystone.search,
								filters: Keystone.filters,
								cols: Keystone.list.cols,
								sort: Keystone.sort,
								csrf_query: Keystone.csrf_query,
								q: Keystone.query
							}),
							dataType: 'json'
						}).done(function(rtn) {
							if (rtn.success) {
								$table.append(rtn.row);
								$('.list-pagination').html(rtn.pagination);
							} else {
								onError(rtn);
							}
						}).error(onError);
					}
				}
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
