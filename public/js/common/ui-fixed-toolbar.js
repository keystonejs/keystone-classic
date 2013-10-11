jQuery(function($) {
	// fix toolbar
	(function() {
		
		var $window = $(window),
			$body = $('#body'),
			$toolbar = $('.toolbar-fixed');
		
		if (!$toolbar.length)
			return;
		
		$toolbar.wrap("<div class='toolbar-wrapper' style='position: relative'>");
		
		var toolbarHeight = $toolbar.outerHeight() + 15, // add 15px for margin
			$wrap = $toolbar.parent().css("height", toolbarHeight);
		
		$toolbar.css({
			width: $toolbar.outerWidth(),
			position: 'absolute'
		});
		
		var mode = 'inline';
		
		var onScroll = function() {
			
			var maxY = $wrap.offset().top + toolbarHeight,
				viewY = $window.scrollTop() + $window.height()
				
			if (viewY > maxY && mode != 'inline') {
				mode = 'inline';
				$toolbar.css({
					top: 0,
					position: 'absolute'
				});
			} else if (viewY <= maxY && mode == 'inline') {
				mode = 'fixed';
				$toolbar.css({
					top: $window.height() - toolbarHeight,
					position: 'fixed'
				});
			}
			
		}
		
		$window.scroll(onScroll);
		$window.resize(onScroll);
		$window.on('redraw', onScroll);
		onScroll();
		
		// do it again in a few hundred ms to correct for other UI initialisation
		setTimeout(onScroll, 200);
		
	})();
});