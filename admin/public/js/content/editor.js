jQuery(function($) {
	
	var refs = $('[data-ks-editable]');
	
	function addButton($editable, href, label) {
		
		$editable.css({ position: 'relative' });
		
		var visible = false;
		
		var $btn = $('<a class="ks-editable-btn" href="' + href + '" target="_blank">' + label + '</a>')
			.css({
				opacity: 0,
				top: 0,
				right: 0
			})
			.appendTo($editable);
		
		$editable.on('mouseenter mousemove', function(e) {// eslint-disable-line no-unused-vars
			if (visible) return;
			visible = true;
			$btn.css({ opacity: 1 });
		}).on('mouseleave', function(e) {// eslint-disable-line no-unused-vars
			visible = false;
			$btn.css({ opacity: 0 });
		});
		
	}
	
	refs.each(function(i, editable) {
		
		var $editable = $(editable),
			data = $editable.data('ks-editable');
		
		switch (data.type) {
			
			case 'list':
				var href = '/keystone/' + data.path,
					label = 'Manage ' + data.plural;
				
				if (data.id) {
					href += '/' + data.id;
					label = 'Edit ' + data.singular;
				}
				
				addButton($editable, href, label);
			break;
			
			case 'content':
				// TODO
			break;
			
			case 'error':
				// TODO
			break;
			
		}
		
	});
	
});
