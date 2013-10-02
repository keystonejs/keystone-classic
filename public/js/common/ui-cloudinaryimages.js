jQuery(function($) {
	
	// Cloudinary Images
	$('.field.type-cloudinaryimages').each(function() {
		
		var $el = $(this),
			data = $el.data();
		
		var $action = $el.find('input.field-action');
			// $order = $el.find('input.field-order');
		
		var $images = $el.find('.images-container');
		
		var $toolbar = $el.find('.images-toolbar'),
			$upload = $toolbar.find('.btn-cloudinaryimages-upload'),
			$queued = $toolbar.find('.upload-queued');
		
		var actions = { delete: [], remove: [] };
			// order = '';
		
		var images = $el.find('.image-field');
		
		// Generates the action string that processes deletion and removal of images
		var generateAction = function() {
			$action.val((actions.delete.length ? 'delete,' + actions.delete.toString() : '') + '|' +
				(actions.remove.length ? 'remove,' + actions.remove.toString() : ''));
		};
		
		// Displays or hides the queue message if we have pending uploads
		var checkQueued = function() {
			var uploads = $el.find('input[type=file]').length;
			$queued[( uploads ? 'show' : 'hide' )]();
			$queued.find('.alert.alert-success').html(uploads + ' image' + ( uploads > 1 ? 's' : '' ) + ' selected - save to upload');
		}
		
		// Handle existing images
		images.each(function() {
			
			var $image = $(this),
				idata = $image.data();
			
			var $preview = $image.find('.image-preview');
			
			var $remove = $image.find('.btn-cloudinaryimages-remove-image'),
				$undo = $image.find('.btn-cloudinaryimages-undo-remove');
			
			var action = false;
			
			$remove.click(function(e) {
				e.preventDefault();
				if (e.altKey) {
					if (!confirm("Are you sure you want to delete the image?\n\n"))
						return;
					actions.delete.push(idata.id);
					action = 'delete';
				} else {
					actions.remove.push(idata.id);
					action = 'remove';
				}
				
				$preview.addClass('removed');
				
				$remove.hide();
				$undo.show();
				
				return generateAction();
				
			});
			
			$undo.click(function(e) {
				e.preventDefault();
				actions[action].splice(actions[action].indexOf(idata.id), 1);
				
				$preview.removeClass('removed');
				
				$undo.hide();
				$remove.show();
				
				return generateAction();
			
			});
			
		});
		
		images.find('.image-preview a').touchTouch();
		
		// Handle uploads
		var imageFieldHTML = '<div class="image-field row col-sm-3 col-md-12">' +
			'<div class="image-preview"><div class="img-thumbnail placeholder-wrap"><div class="placeholder"></div><div class="glyphicon glyphicon-time upload-pending"></div></div></div>' +
			'<div class="image-details"><div class="pull-left"><a href="javascript:;" class="btn btn-link btn-cancel btn-cloudinaryimages-undo-upload">Remove</a></div></div>' +
		'</div>';
		
		$upload.click(function() {
			
			var $field = $('<input type="file" name="' + data.fieldPathsUpload + '" class="field-upload">').appendTo($toolbar);
			
			$field.change(function(e) {
				
				var imageSelected = $(this).val() ? true : false;
				
				if (imageSelected) {
					// Check for image file (treated as multiple) and render preview
					// TODO: Check for file reader capability
					var files = e.target.files;
					for (var i = 0, f; f = files[i]; i++) {
						if (!f.type.match('image.*')) {
							$field.remove();
							checkQueued();
							alert("Please select image files only.");
							continue;
						}
						var $placeholder = $(imageFieldHTML).appendTo($images);
						$placeholder.find('.btn-cloudinaryimages-undo-upload').click(function() {
							$placeholder.remove();
							$field.remove();
							checkQueued();
						});
						var fileReader = new FileReader();
						fileReader.onload = (function(file) {
							return function(e) {
								$placeholder.find('.img-thumbnail .placeholder').css('background-image', 'url(' + e.target.result + ')').prop( 'title', escape(file.name) );
							};
						})(f);
						fileReader.readAsDataURL(f);
					}
				} else {
					$placeholder.remove();
					$field.remove();
				}
				
				checkQueued();
				
				$(window).trigger('redraw');
				
			});
			
			$field.click();
		
		});
		
	});
	
});
