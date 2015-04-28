jQuery(function($) {
	
	// ALT-TEXT CLASS
	// ==============
	
	var AltText = function(el) {
		this.$el = $(el);
		this.originalText = this.$el.text();
		this.altText = this.$el.data('alt-text');
	};
	
	AltText.prototype.state = function(alt) {
		
		this.$el.text(alt ? this.altText : this.originalText);
		
	};
	
	// ALT-TEXT PLUGIN
	// ===============
	
	$.fn.altText = function(state) {
		return this.each(function() {
			var $this = $(this);
			var altText = $this.data('ui.altText');
			
			if (!altText) $this.data('ui.altText', (altText = new AltText(this)));
			
			altText.state(state);
		});
	};
	
	$.fn.altText.Constructor = AltText;
	
	// EVENT BINDINGS
	// ==============
	
	$(document).on('keydown.ui.altText', function(e) {
		if (e.which != 18) return;// eslint-disable-line eqeqeq
		$('[data-alt-text]').altText(true);
	});
	
	$(document).on('keyup.ui.altText', function(e) {
		if (e.which != 18) return;// eslint-disable-line eqeqeq
		$('[data-alt-text]').altText();
	});
	
});
