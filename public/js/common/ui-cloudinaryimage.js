jQuery(function($) {
	
	// Cloudinary Image
	$('.field.type-cloudinaryimage').each(function() {
	
		var $el = $(this),
			data = $el.data();
		
		var $action = $el.find('.field-action'),
			$upload = $el.find('.field-upload');
		
		var $uploadBtn = $el.find('.btn-upload-image'),
			$deleteBtn = $el.find('.btn-delete-image'),
			$cancelBtn = $el.find('.btn-cancel-image'),
			$undoBtn = $el.find('.btn-undo-image');
			
		var $uploadQueued = $el.find('.upload-queued'),
			$deleteQueued = $el.find('.delete-queued');
		
		var $deletePending = $el.find('.delete-pending');
		
		var $image = $el.find('.image-container'),
			$imagePreview = $image.find('.image-preview.current'),
			$imageDetails = $image.find('.image-details'),
			$imageValues = $image.find('.image-values');
		
		var action = false;
		
		var imageFieldHTML = '<div class="image-preview new">' +
				'<div class="img-thumbnail placeholder-wrap"><img class="placeholder' + ( !window.FileReader ? ' no-preview' : '' ) + '" /><div class="glyphicon glyphicon-open upload-pending"></div></div></div>'
			'</div>';
		
		var removeNewImage = function() {
			$el.find('.image-preview.new').remove();
		}
		
		$upload.change(function(e) {
			var imageSelected = $(this).val() ? true : false;
			var renderPlaceholder = function() {
				// Image
				$imagePreview.hide();
				$imageValues.hide();
				// Messages
				$uploadQueued[imageSelected ? 'show' : 'hide']();
				// Buttons
				$undoBtn.hide();
				$deleteBtn.hide();
				$cancelBtn.show();
				$uploadBtn.text(imageSelected ? 'Change Image' : 'Upload Image');
				// Preview
				removeNewImage();
				// Render HTML
				return $(imageFieldHTML).prependTo($image);
			}
			// Preview
			if (imageSelected) {
				if (window.FileReader) {
					var files = e.target.files;
					for (var i = 0, f; f = files[i]; i++) {
						if (!f.type.match('image.*')) {
							$upload.val('');
							alert("Please select image files only.");
							continue;
						}
						var fileReader = new FileReader();
						fileReader.onload = (function(file) {
							return function(e) {
								renderPlaceholder().find('.img-thumbnail .placeholder').prop('src', e.target.result).prop( 'title', escape(file.name) );
								$(window).trigger('redraw');
							};
						})(f);
						fileReader.readAsDataURL(f);
					}
				} else {
					return renderPlaceholder();
				}
			}
		});
		
		// Upload Image
		$uploadBtn.click(function() {
			$upload.click();
		});
		
		// Delete/Remove Image
		$deleteBtn.click(function(e) {
			e.preventDefault();
			// Action
			if (e.altKey) {
				$action.val('delete');
				action = 'delete';
			} else {
				$action.val('reset');
				action = 'remove';
			}
			// Details
			$imageValues.hide();
			// Image
			$imagePreview.addClass('removed');
			$deletePending.addClass(action == 'delete' ? 'glyphicon-trash' : 'glyphicon-remove').show();
			// Buttons
			$deleteBtn.hide();
			$undoBtn.html('Undo ' + ( action == 'delete' ? 'Delete' : 'Remove')).show();
			$cancelBtn.hide();
			$uploadBtn.html('Upload Image');
			// Messages
			$deleteQueued.show();
			$deleteQueued.find('.alert').html('Image '+ ( action == 'delete' ? 'deleted' : 'removed') + ' - save to confirm');
			// Redraw
			$(window).trigger('redraw');
		});
		
		// Undo Delete/Remove
		$undoBtn.click(function(e) {
			e.preventDefault();
			// Action
			$action.val('');
			action = false;
			// Details
			$imageValues.show();
			// Image
			$imagePreview.removeClass('removed');
			$deletePending.removeClass('glyphicon-remove glyphicon-trash').hide();
			// Buttons
			$undoBtn.hide();
			$cancelBtn.hide();
			$deleteBtn.show();
			$uploadBtn.html('Change Image');
			// Messages
			$deleteQueued.hide();
			// Redraw
			$(window).trigger('redraw');
		});
		
		// Cancel Upload
		$cancelBtn.click(function(e) {
			e.preventDefault();
			// Remove new image preview
			removeNewImage();
			// Erase selected image
			$upload.val('');
			// If we have an image already
			if (data.fieldValue) {
				// Show it
				$imagePreview.show();
				// If we've got a pending remove/delete
				if (action) {
					// Show the undo button
					$undoBtn.show();
				} else {
					// Make sure the undo button is hidden
					$undoBtn.hide();
					// Show delete button
					$deleteBtn.show();
					// Show image values
					$imageValues.show();
				}
			} else {
				// Otherwise if we aren't deleting anything yet
				if (!action) {
					// Hide the delete button
					$deleteBtn.hide();
				} else {
					// Or make sure it's visiboe
					$deleteBtn.show();
				}
				// Make sure upload button references no current image
				$uploadBtn.html('Upload Image');
			}
			// Hide the cancel upload button
			$cancelBtn.hide();
			// Hide queued upload message
			$uploadQueued.hide();
			// Redraw
			$(window).trigger('redraw');
		});
		
		// Image popup
		if ( data.fieldValue ) {
			$imagePreview.find('a').fancybox({
				prevEffect: 'none',
				nextEffect: 'none',
				closeBtn: false,
				helpers: {
					title: {},
					buttons: {}
				}
			});
		}
		
	});
	
});
