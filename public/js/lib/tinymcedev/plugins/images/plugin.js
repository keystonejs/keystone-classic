/**
 * plugin.js
 *
 * Copyright, Tom Walker
 */

/*global tinymce:true */

tinymce.PluginManager.add('images', function(editor) {
	
	var dom = editor.dom,
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
				d = $img .data();
			
			return {
				type: 'thumbnail',
				id: d.id,
				src: d.src,
				$el: img,
				onselect: function(e) {
					
					var selected = e.control.selected();
					
					if (selected) {
						data[d.id] = $img;
					} else {
						delete data[d.id];
					}
					
				}
			};
		});
	
	}
	
	var showDialog = function() {
	
		data = {};
		
		var win = editor.windowManager.open({
			title: 'Insert image',
			data: data,
			body: {
				type: 'container',
				classes: 'thumbnails',
				items: processThumbnails()
			},
			onSubmit: function(e) {
				
				// console.log('Submitted data:', data);
				
				_.each(data, function(d) {
					
					var imgData = d.data();
					
					console.log(imgData)
					
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
		});
	
	}
	
	editor.addButton('images', {
		icon: 'image',
		tooltip: 'Insert image',
		onclick: showDialog,
		stateSelector: 'img:not([data-mce-object])'
	});
	
	editor.addMenuItem('images', {
		icon: 'image',
		text: 'Insert image',
		onclick: showDialog,
		context: 'insert',
		prependToContext: true
	});
	
});
