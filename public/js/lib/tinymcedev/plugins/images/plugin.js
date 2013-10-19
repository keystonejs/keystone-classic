/**
 * plugin.js
 *
 * Copyright, Tom Walker
 */

/*global tinymce:true */

tinymce.PluginManager.add('images', function(editor) {
	
	var dom = editor.dom,
		dialog = false,
		$dialog = false,
		data = {};
	
	var getImageSize = function(url, callback) {
		
		var $img = $('<img>', { style: 'position: absolute; left: -9999px;' }).appendTo($('body'));
		
		function done(width, height) {
			$img.remove();
			callback({width: width, height: height});
		}
		
		$img.on({
			load: function() {
				done($img.width(), $img.height());
			},
			error: function() {
				done();
			}
		});
		
		$img.prop('src', url);
		
	}
	
	var processThumbnails = function() {
	
		var imagesList = editor.settings.images_list;
		
		return _.map(imagesList, function(img) {
			
			var $img = $(img),
				imgData = $img.data();
			
			return {
				type: 'thumbnail',
				id: imgData.id,
				src: imgData.src,
				$el: img,
				onselect: function(e) {
					e.control.selected() ? data[imgData.id] = $img : delete data[imgData.id];
					dialog.statusbar.find('.primary').disabled(!_.size(data));
				}
			};
		});
	
	}
	
	var insertImages = function() {
	
		_.each(data, function(d) {
			
			var imgData = d.data();
			
			var imgUrl = $.cloudinary.url(imgData.id, {
				format: imgData.wysiwygOptions.format || 'jpg',
				crop: imgData.wysiwygOptions.crop,
				width: imgData.wysiwygOptions.width,
				height: imgData.wysiwygOptions.height
			});
			
			getImageSize(imgUrl, function(dimensions) {
			
				editor.undoManager.transact(function() {
					editor.selection.setContent(editor.dom.createHTML('img', {
						'src': imgUrl,
						'width': dimensions.width,
						'height': dimensions.height,
						'class': imgData.wysiwygOptions.class,
						'data-original': imgData.wysiwygOriginal
					}));
				});
			
			});
			
		});
	
	}
	
	var showDialog = function() {
	
		data = {}; // Reset data
		
		dialog = editor.windowManager.open({
			title: 'Insert images',
			data: data,
			body: {
				type: 'container',
				layout: 'flex',
				align: 'center',
				spacing: 10,
				classes: 'thumbnails',
				items: processThumbnails()
			}
		});
		
		dialog.statusbar.find('.primary').disabled(true);
	
	}
	
	editor.addButton('images', {
		icon: 'image',
		tooltip: 'Insert images',
		onclick: showDialog,
		stateSelector: 'img:not([data-mce-object])'
	});
	
	editor.addMenuItem('images', {
		icon: 'image',
		text: 'Insert images',
		onclick: showDialog,
		context: 'insert',
		prependToContext: true
	});
	
});
