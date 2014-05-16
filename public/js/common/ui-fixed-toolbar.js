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
		
		var mode = 'inline',
			windowSize = {
				x: $window.width(),
				y: $window.height()
			};
		
		var onScroll = function() {
			
			var maxY = $wrap.offset().top + toolbarHeight,
				viewY = $window.scrollTop() + $window.height(),
				newSize = {
					x: $window.width(),
					y: $window.height()
				},
				sizeChanged = (newSize.x != windowSize.x || newSize.y != windowSize.y);
			
			if (viewY > maxY && (sizeChanged || mode != 'inline')) {
				mode = 'inline';
				windowSize = newSize;
				$toolbar.css({
					top: 0,
					position: 'absolute'
				});
			} else if (viewY <= maxY && (sizeChanged || mode == 'inline')) {
				mode = 'fixed';
				windowSize = newSize;
				$toolbar.css({
					top: $window.height() - toolbarHeight,
					position: 'fixed'
				});
			}
			
		};
		
		$window.scroll(onScroll);
		$window.resize(onScroll);
		$window.on('redraw', onScroll);
		onScroll();
		
		// do it again in a few hundred ms to correct for other UI initialisation
		setTimeout(onScroll, 200);
		
	})();
});