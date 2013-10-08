jQuery(function($) {
	
	// Cloudinary Images
	$('.field.type-cloudinaryimages').each(function() {
		
		var $el = $(this),
			data = $el.data();
		
		var $action = $el.find('input.field-action');
			// $order = $el.find('input.field-order');
		
		var $images = $el.find('.images-container');
		
		var $toolbar = $el.find('.images-toolbar'),
			$upload = $toolbar.find('.btn-upload'),
			$uploadQueued = $toolbar.find('.upload-queued'),
			$deleteQueued = $toolbar.find('.delete-queued');
		
		var actions = { delete: [], remove: [] };
			// order = '';
		
		var images = $el.find('.image-field');
		
		// Generates the action string that processes deletion and removal of images
		var updateActions = function() {
			$action.val((actions.delete.length ? 'delete:' + actions.delete.toString() : '') + '|' +
				(actions.remove.length ? 'remove:' + actions.remove.toString() : ''));
		};
		
		// Displays or hides the queue message if we have pending uploads
		var checkQueues = function() {
			var uploads = _.filter($el.find('input[type=file]'), function(f) {
				if ($(f).val()) return f;
			}).length;
				$uploadQueued[( uploads ? 'show' : 'hide' )]();
				$uploadQueued.find('.alert').html(uploads + ' image' + ( uploads > 1 ? 's' : '' ) + ' selected - save to upload');
			var removals = actions.delete.length + actions.remove.length;
				$deleteQueued[( removals ? 'show' : 'hide' )]();
				$deleteQueued.find('.alert').html(removals + ' image' + ( removals > 1 ? 's' : '' ) + ' removed - save to confirm');
		}
		
		// Handle existing images
		images.each(function() {
			var $image = $(this),
				idata = $image.data();
			
			var $preview = $image.find('.image-preview');
			
			var $remove = $image.find('.btn-remove-image'),
				$undo = $image.find('.btn-undo-remove');
			
			var $deletePending = $image.find('.delete-pending');
			
			var action = false;
			
			$remove.click(function(e) {
				e.preventDefault();
				if (e.altKey) {
					actions.delete.push(idata.id);
					action = 'delete';
				} else {
					actions.remove.push(idata.id);
					action = 'remove';
				}
				// Preview
				$preview.addClass('removed');
				$deletePending.addClass(action == 'delete' ? 'glyphicon-trash' : 'glyphicon-remove').show();
				// Remove/Undo
				$remove.hide();
				$undo.show();
				// Messages
				checkQueues();
				// Actions
				updateActions();
			});
			
			$undo.click(function(e) {
				e.preventDefault();
				actions[action].splice(actions[action].indexOf(idata.id), 1);
				// Preview
				$preview.removeClass('removed');
				$deletePending.removeClass('glyphicon-remove glyphicon-trash').hide();
				// Remove/Undo
				$undo.hide();
				$remove.show();
				// Messages
				checkQueues();
				// Actions
				updateActions();
			});
			
		});
		
		images.find('.image-preview a').fancybox({
			prevEffect: 'none',
			nextEffect: 'none',
			closeBtn: false,
			helpers: {
				titl: {},
				buttons: {}
			}
		});
		
		var imageFieldHTML = '<div class="image-field row col-sm-3 col-md-12">' +
			'<div class="image-preview"><div class="img-thumbnail placeholder-wrap"><img class="placeholder' + ( !window.FileReader ? ' no-preview' : '' ) + '" /><div class="glyphicon glyphicon-open upload-pending"></div></div></div>' +
			'<div class="image-details"><a href="javascript:;" class="btn btn-link btn-cancel btn-undo-upload">Cancel</a></div>' +
		'</div>';
		
		$upload.click(function() {
			var $field = $('<input id="' + new Date().getTime() + '" type="file" name="' + data.fieldPathsUpload + '" class="field-upload">').appendTo($toolbar);
			$field.change(function(e) {
				var imageSelected = $(this).val() ? true : false;
				var renderPlaceholder = function() {
					var $placeholder = $(imageFieldHTML).appendTo($images);
					$placeholder.find('.btn-undo-upload').click(function() {
						$placeholder.remove();
						$field.remove();
						checkQueues();
					});
					return $placeholder;
				}
				if (imageSelected) {
					if (window.FileReader) {
						var files = e.target.files;
						for (var i = 0, f; f = files[i]; i++) {
							if (!f.type.match('image.*')) {
								$field.remove();
								checkQueues();
								alert("Please select image files only.");
								continue;
							}
							var fileReader = new FileReader();
							fileReader.onload = (function(file) {
								return function(e) {
									renderPlaceholder().find('.img-thumbnail .placeholder').prop('src', e.target.result).prop( 'title', escape(file.name) );
									checkQueues();
									$(window).trigger('redraw');
								};
							})(f);
							fileReader.readAsDataURL(f);
						}
					} else {
						renderPlaceholder();
						checkQueues();
						$(window).trigger('redraw');
					}
				} else {
					$field.remove();
					checkQueues();
					$(window).trigger('redraw');
				}
			});
			$field.click();
		});
		
	});
	
});
