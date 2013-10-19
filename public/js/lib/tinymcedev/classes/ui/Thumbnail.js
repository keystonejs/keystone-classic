/**
 * Thumbnail.js
 *
 * Copyright, Tom Walker
 */

/**
 * This class is used to create thumbnails. You can create them directly or through the Factory.
 *
 * @example
 * // Create and render a thumbnail to the body element
 * tinymce.ui.Factory.create({
 *     type: 'thumbnail'
 * }).renderTo(document.body);
 *
 * @-x-less Thumbnail.less
 * @class tinymce.ui.Thumbnail
 * @extends tinymce.ui.Widget
 */
define("tinymce/ui/Thumbnail", [
	"tinymce/ui/Widget"
], function(Widget) {
	"use strict";

	return Widget.extend({
		Defaults: {
			classes: 'thumbnail',
			selected: false,
			role: 'button'
		},

		/**
		 * Constructs a new thumbnail instance with the specified settings.
		 *
		 * @constructor
		 * @setting {String} select Whether thumbnail is already selected
		 */
		init: function(settings) {
			var self = this;
			
			self._super(settings);
			
			self.on('click', function(e) {
				e.preventDefault();
				self.selected(!self.selected());
				self.fire('select');
			});
			
			self.selected(false); // self.settings.selected
		},
		
		/**
		 * Getter/setter function for the selected state.
		 *
		 * @method selected
		 * @param {Boolean} [state] selected to be set.
		 * @return {Boolean|tinymce.ui.Thumbnail} True/false if it's a set operation.
		 */
		selected: function(selected) {
			var self = this;

			if (typeof selected != "undefined") {
				if (selected) {
					self.addClass('selected');
				} else {
					self.removeClass('selected');
				}

				self._selected = selected;
				self.aria('selected', selected);

				return self;
			}

			return self._selected;
		},

		/**
		 * Renders the control as a HTML string.
		 *
		 * @method renderHtml
		 * @return {String} HTML representing the control.
		 */
		renderHtml: function() {
			var self = this, id = self._id, prefix = self.classPrefix;
			
			var $img = $(self.settings.$el),
				data = $img.data();
			
			return (
				'<div id="' + id + '" class="' + self.classes() + '" tabindex="-1">' +
					'<div class="image-preview">' +
						'<a href="javascript:;" class="img-thumbnail">' +
							'<img width="90" height="90" src="' + $img.prop('src') + '"/>' +
							'<div class="glyphicon glyphicon-ok img-selected"></div>' +
						'</a>' +
					'</div>' +
				'</div>'
			);
		}
	});
});
