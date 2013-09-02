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
	
	/** Filtering */
	
	var checkFiltersStatus = function() {
		var enabledFilters = $('.filter.active'),
			enabledPaths = _.map(enabledFilters, function(i) { return $(i).data('path') });
		$('.list-filters-action')[enabledFilters.length ? 'show' : 'hide']();
		console.log(enabledPaths);
		$('.add-list-filter').each(function() {
			var path = $(this).data('path');
			console.log(path);
			console.log(_.contains(enabledPaths, path));
			$(this).parent()[_.contains(enabledPaths, path) ? 'addClass' : 'removeClass']('disabled');
		});
	}
	
	checkFiltersStatus();
	
	$('.add-list-filter').click(function(e) {
		var path = $(this).data('path');
		var $filter = $('.filter[data-path=' + path + ']').addClass('active');
		checkFiltersStatus();
	});
	
	$('.clear-filter').click(function(e) {
		var $filter = $(this).closest('.filter').removeClass('active');
		checkFiltersStatus();
	});
	
	/** List Controls */
	
	$('a.control-delete').hover(function(e) {
		$(this).closest('tr').addClass('delete-hover');
	}, function(e) {
		$(this).closest('tr').removeClass('delete-hover');
	});
	
	$('a.control-sort').hover(function(e) {
		$(this).closest('tr').addClass('sort-hover');
	}, function(e) {
		$(this).closest('tr').removeClass('sort-hover');
	});
	
});