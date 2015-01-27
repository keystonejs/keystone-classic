/*
 * Add visual anchor links to docs-content
 */
$(function() {
	// for all anchor tags with name props
	$(".docs-content a[name]").each(function() {
		var $anchor = $(this),
			name = $anchor.attr("name"),
			$link = $('<a class="anchor" href="#' + name + '"><i class="entypo entypo-link"></i></a>'),
			$next = $anchor.next();

		// only append links to H2/H3 tags
		if ($next.prop("tagName") === "H2" || $next.prop("tagName") === "H3") {
			$next.append($link);
		}
	});
});
