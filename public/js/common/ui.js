jQuery(function($) {
	
	// show hide the "back to website" message in the navbar
	
	$('.navbar-backtobrand-trigger').mouseenter(function(e) {
		$('.navbar-backtobrand-message').addClass('active');
	}).mouseleave(function() {
		$('.navbar-backtobrand-message').removeClass('active');
	});


	// generic confirm
	
	$('a[data-confirm]').click(function(e) {
		if (!confirm($(this).data().confirm)) {
			e.preventDefault();
			return false;
		}
	});


	// search box highlighting

	$('.searchbox-input').focus(function() {
		$('.searchbox-form').addClass('active');
		$('.searchbox-submit').removeClass('btn-default').addClass('btn-primary');
	}).blur(function() {
		if (!$('.searchbox-input').val().length) {
			$('.searchbox-form').removeClass('active');
			$('.searchbox-submit').removeClass('btn-primary').addClass('btn-default');
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
	});

	$('a[data-toggle=tooltip]').tooltip();

	var datepickers = $('.ui-datepicker').pikaday({ firstDay: 1 });

	$('.btn-set-today').click(function() {
		$(this).prevAll('.ui-datepicker:first').pikaday('setDate', new Date());
	});

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
			data: Keystone.csrf({
				order: order.join(',')
			}),
			error: function() {
				alert("There was a problem saving your changes. Please refresh to see the current data.");
			}
		});
	});
	
	$('.ui-select2-ref').each(function(i, el) {
		
		el = $(el);
		
		var multi = el.data('refMany'),
			refPath = el.data('refPath'),
			refFilters = el.data('refFilters'),
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
					var filters, $related, fieldName;
					if (refFilters) {
						filters = {};
						_.each(refFilters, function(value, key) {
							if($.type(value) === 'string' && value.substr(0,1) == ':') {
								fieldName = value.substr(1);
								// check for an existing input field
								$related = $('input[name="' + fieldName + '"]');
								if ($related.length) {
									filters[key] = $related.val();
									return;
								}
								// check for an existing select field
								$related = $('input#field_' + fieldName);
								if ($related.length) {
									filters[key] = $related.val();
									return;
								}
								// check if filtering by id and item was already saved
								if (fieldName === '_id' && Keystone.item) {
									filters[key] = Keystone.item.id;
									return;
								}
							} else {
								filters[key] = value;
							}
						});
					}
					return _.extend({
						q: term, //search term
						limit: perPage, // page size
						page: page, // page number, tracked by select2, one-based
						filters: filters // reference filters
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
					};
					
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

		if (!multi) {
			el.on('change', function(e) {
				var $this = $(this),
					$gotoLink = $this.next('a.btn-goto-linked-item'),
					val = $this.select2('val');

				if (val == '') {
					$gotoLink.hide();
				} else {
					$gotoLink.attr('href','/keystone/' + refPath + '/' + val);
					$gotoLink.show();
				}
			});
		}
		
	});
	
	$('.field.type-relationship input[data-ref-filters]').each(function() {

		var $input = $(this),
			data = $input.data(),
			$inputs2 = $input.siblings('#s2id_' + $input.attr('id'));

		_.each(data.refFilters, function(value, key) {

			if (value.substr(0,1) != ':') {
				return;
			}

			var $related = $('#field_' + value.substr(1)),
				relatedData = $related.data();

			var checkRelated = function(msg) {
				var $message = $input.siblings('.field-message');
				if ($related.val() == '') {
					$inputs2.hide();
					$message.html('<span>Please select a ' + relatedData.refSingular + ' before selecting a ' + data.refSingular + '.</span>').show();
				} else {
					$inputs2.show();
					$message.hide();
				}
			}

			checkRelated();

			$related.on('change.dependency.' + $input.attr('id'), function(e) {
				var $gotoLink = $input.next('a.btn-goto-linked-item');

				checkRelated();

				$inputs2.select2('val', '');
				$input.val('');
				$gotoLink.hide();
			});

		});

	});

	$('.btn.autoclick').each(function() {
		var $btn = $(this);
		setTimeout(function() {
			$btn.click();
		}, 1);
	});
	
});