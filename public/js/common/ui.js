jQuery(function($) {
	
	var brand = $('#header .navbar-brand').text();
	
	$('.navbar-backtobrand').mouseenter(function(e) {
		$('.navbar-headernav-collapse').addClass('navbar-headernav-hide');
		$('.navbar-brand').text('Back to the ' + brand + ' website');
	}).mouseleave(function() {
		$('.navbar-headernav-collapse').removeClass('navbar-headernav-hide');
		$('.navbar-brand').text(brand);
	});
	
	$('a[data-confirm]').click(function(e) {
		if (!confirm($(this).data().confirm)) {
			e.preventDefault();
			return false;
		}
	});
	
	$('img.img-load').each(function() {
		var $img = $(this);
		$img.css('opacity', 0);
		$img.load(function() {
			$img[0].removeAttribute('width');
			$img[0].removeAttribute('height');
			$img.css('opacity', '');
			$img.parent().find('.img-loading').remove();
		});
		$img.prop('src', $img.data().src);
	})
	
	$('a[data-toggle=tooltip]').tooltip();
	
	$('.ui-datepicker').pikaday({ firstDay: 1 });
	
	$('.ui-select2').select2({ allowClear: true });
	
	$('.ui-select2-tags').each(function(i, el) {
		el = $(el);
		el.select2({
			tags: el.val().split(",")
		});
	});
	
	// clean up empty list sections
	$('.dropdown-menu .dropdown-header').each(function() {
		if ($(this).next('.dropdown-header').length) {
			$(this).hide();
		}
	});
	
	$('.items-list.sortable').on('ui.sorted', function() {
		var $this = $(this),
			listPath = $this.data('listPath'),
			order = _.pluck($this.find('tbody tr'), 'id');
		$.ajax({
			type: 'POST',
			url: '/keystone/api/' + listPath + '/order',
			data: {
				order: order.join(',')
			},
			error: function() {
				alert("There was a problem saving your changes. Please refresh to see the current data.");
			}
		});
	});
	
	$('.ui-select2-ref').each(function(i, el) {
		
		el = $(el);
		
		var multi = el.data('refMany'),
			refPath = el.data('refPath'),
			label = {
				singular: el.data('refSingular'),
				plural: el.data('refPlural')
			},
			perPage = 10;
		
		var args = {
			context: 'relationship',
			list: Keystone.list.path,
			field: el.attr('name')
		};
		
		if (Keystone.item) {
			args.item = Keystone.item.id;
		}
		
		el.select2({
			placeholder: 'Search for ' + (multi ? label.plural : ' a ' + label.singular) + '...',
			allowClear: true,
			multiple: multi,
			ajax: {
				url: '/keystone/api/' + refPath + '/autocomplete',
				dataType: 'json',
				quietMillis: 500,
				data: function(term, page) {
					return _.extend({
						q: term, //search term
						limit: perPage, // page size
						page: page // page number, tracked by select2, one-based
					}, args);
				},
				results: function(data, page) {
					var more = (page * perPage) < data.total; // whether or not there are more results available
					return { results: data.items, more: more };
				}
			},
			initSelection: function(element, callback) {
				var ids = $(element).val();
				if (ids !== '') {
					
					ids = ids.split(',');
					var data = [];
					
					var loaded = function(rtn) {
						data.push(rtn);
						if (data.length == ids.length)
							callback(multi ? data : data[0]);
					}
					
					$.each(ids, function() {
						$.ajax('/keystone/api/' + refPath + '/get', {
							data: {
								id: this,
								dataset: 'simple'
							},
							dataType: 'json'
						}).done(loaded);
					});
				}
			},
			formatResult: function(i) { return i.name },
			formatSelection: function(i) { return i.name },
			escapeMarkup: function (m) { return m; } // we do not want to escape markup since we are displaying html in results
		});
		
		
	});
	
	$('.btn.autoclick').each(function() {
		var $btn = $(this);
		setTimeout(function() {
			$btn.click();
		}, 1);
	});
	
});
