jQuery(function($) {
	// fix toolbar
	(function() {
		
		var viewY = 0, // the lowest visible pixel
			maxY = 0,
			$window = $(window),
			$body = $('#body'),
			$toolbar = $('.toolbar-fixed');
		
		if (!$toolbar.length)
			return;
		
		$toolbar.wrap("<div class='toolbar-wrapper' style='position: relative'>");
		
		var toolbarHeight = $toolbar.outerHeight(),
			$wrap = $toolbar.parent().css("height", toolbarHeight);
		
		$toolbar.css({
			width: $toolbar.outerWidth(),
			position: 'absolute'
		});
		
		var onScroll = function() {
			maxY = $wrap.offset().top + toolbarHeight + 15;
			viewY = $window.scrollTop() + $window.height();
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