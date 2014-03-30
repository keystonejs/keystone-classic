(function ($) {
	
	$.deserialize = function(str, options) {
		if (!str.length) return {};
		var pairs = str.split(/&amp;|&/i),
			h = {},
			options = options || {};
		for(var i = 0; i < pairs.length; i++) {
			var kv = pairs[i].split('=');
			kv[0] = decodeURIComponent(kv[0]);
			if(!options.except || options.except.indexOf(kv[0]) == -1) {
				if((/^\w+\[\w+\]$/).test(kv[0])) {
					var matches = kv[0].match(/^(\w+)\[(\w+)\]$/);
					if(typeof h[matches[1]] === 'undefined') {
						h[matches[1]] = {};
					}
					h[matches[1]][matches[2]] = decodeURIComponent(kv[1]);
				} else {
					h[kv[0]] = decodeURIComponent(kv[1]);
				}
			}
		}
		return h;
	};

	$.deserializeSearch = function() {
		var search = window.location.search;
		if (search.charAt(0) == '?') search = search.substr(1);
		return $.deserialize(search);
	};
	
	$.addSearchParam = function(obj, goto) {
		var params = $.deserializeSearch();
		for (var i in obj) {
			if (obj[i] === undefined || obj[i] === null) {
				delete params[i];
			} else if (obj.hasOwnProperty(i)) {
				params[i] = obj[i];
			}
		}
		var search = $.param(params);
		if (goto) {
			window.location = window.location.pathname + (search.length ? '?' + search : '');
			return false;
		} else {
			return search;
		}
	};
	
})(jQuery);
