jQuery(function($) {
	
	$('a[data-confirm]').click(function(e) {
		if (!confirm($(this).data().confirm)) {
			e.preventDefault();
			return false;
		}
	});
	
	$('.ui-datepicker').pikaday({ firstDay: 1 });
	
	$('.ui-select2').select2({ allowClear: true });
	
	$('.ui-select2-tags').each(function(i, el) {
		el = $(el);
		el.select2({
			tags: el.val().split(",")
		});
	});
	
	$('.ui-select2-ref').each(function(i, el) {
		
		el = $(el);
		
		var multi = el.data('refMultiple'),
			refPath = el.data('refPath'),
			label = {
				singular: el.data('refSingular'),
				plural: el.data('refPlural')
			},
			perPage = 10;
		
		el.select2({
			placeholder: 'Search for ' + (multi ? label.plural : ' a ' + label.singular) + '...',
			allowClear: true,
			multiple: multi,
			ajax: {
				url: '/keystone/api/' + refPath + '/autocomplete',
				dataType: 'json',
				quietMillis: 500,
				data: function(term, page) {
					return {
						q: term, //search term
						limit: perPage, // page size
						page: page // page number, tracked by select2, one-based
					};
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
	
	$('.btn-upload').click(function() {
		$(this).parent().find('.field-upload').click();
	});
	
	$('.field-upload').change(function() {
		$(this).parent().find('.upload-queued')[($(this).val()) ? 'show' : 'hide']();
	});
	
	$('.btn.autoclick').each(function() {
		var $btn = $(this);
		setTimeout(function() {
			$btn.click();
		}, 1);
	});
	
	// fix toolbar
	(function() {
		
		var viewY = 0,
			maxY = 0,
			$window = $(window),
			$body = $('#body'),
			$toolbar = $('.toolbar-fixed'),
			offsetY = $body.offset().top - 30;
		
		if (!$toolbar.length)
			return;
		
		$toolbar.wrap("<div class='toolbar-wrapper' style='position: relative'>");
		$toolbar.parent().css("height", $toolbar.outerHeight());
		
		$toolbar.css({
			width: $toolbar.outerWidth(),
			position: 'absolute'
		});
		
		var onScroll = function() {
			viewY = $window.scrollTop() + $window.height();
			maxY = $body.outerHeight() + offsetY;
			$toolbar.css('top', (viewY > maxY) ? 0 : 0 - (maxY - viewY));
		}
		
		$window.scroll(onScroll);
		$window.resize(onScroll);
		$window.on('redraw', onScroll);
		onScroll();
		// do it again in a few hundred ms to correct for other UI initialisation
		setTimeout(onScroll, 200);
		
	})();
	
});
