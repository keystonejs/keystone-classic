jQuery(function($) {
	
	// Cloudinary Image
	$('.field.type-cloudinaryimage').each(function() {
	
		var $el = $(this),
			data = $el.data();
		
		var $action = $el.find('.field-action');
		
		var $uploadBtn = $el.find('.btn-upload'),
			$uploadField = $el.find('.field-upload'),
			$uploadQueued = $el.find('.upload-queued');
		
		var $deleteBtn = $el.find('.btn-delete-image'),
			$deleteQueued = $el.find('.delete-queued');
		
		var $cancelBtn = $el.find('.btn-cancel-image');
		
		var $deletePending = $el.find('.delete-pending');
		
		var $undoBtn = $el.find('.btn-undo-delete');
		
		var $image = $el.find('.image-container'),
			$imagePreview = $image.find('.image-preview.current'),
			$imageDetails = $image.find('.image-details');
		
		var imageFieldHTML = '<div class="image-preview new">' +
				'<div class="img-thumbnail placeholder-wrap"><img class="placeholder' + ( !window.FileReader ? ' no-preview' : '' ) + '" /><div class="glyphicon glyphicon-open upload-pending"></div></div></div>'
			'</div>' +
			'<div class="image-details">' +
				'<div class="field-value"></div>' +
				'<div class="field-value"></div>' +
			'</div>';
		
		$uploadField.change(function(e) {
			
			var imageSelected = $(this).val() ? true : false,
				$field = $(this).closest('.field');
			
			// Image
			$imagePreview.hide(); // Hide current image
			$deletePending.removeClass('glyphicon-remove glyphicon-trash').hide();
			$el.find('.image-preview.new').remove(); // Remove any new images
			
			// Preview
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
						var $placeholder = $(imageFieldHTML).prependTo($image);
						
						$imageDetails.find('.field-value').hide();
						var fileReader = new FileReader();
						fileReader.onload = (function(file) {
							return function(e) {
								$placeholder.find('.img-thumbnail .placeholder').prop('src', e.target.result).prop( 'title', escape(file.name) );
							};
						})(f);
						fileReader.readAsDataURL(f);
					}
				}
				
				// Action
				$action.val('');
			}
			
			// Messages
			$deleteQueued.hide();
			$uploadQueued[imageSelected ? 'show' : 'hide']();
			
			// Buttons
			$undoBtn.hide();
			$deleteBtn.hide();
			$cancelBtn.show();
			$uploadBtn.text(imageSelected ? 'Change Image' : 'Upload Image');
			
			// Redraw
			$(window).trigger('redraw');
		
		});
		
		// Upload
		$uploadBtn.click(function() {
			$uploadField.click();
		});
		
		// Delete/Remove
		var action = false;
		
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
			$imageDetails.find('.field-value').hide();
			
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
			
			// Details
			$imageDetails.find('.field-value').show();
			
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
			
			$uploadField.val('');
			
			$el.find('.image-preview.new').remove();
			
			// Image
			if ( $imagePreview.length ) {
				$imagePreview.removeClass('removed').show();
				$imageDetails.find('.field-value').show();
			}
			
			// Buttons
			$cancelBtn.hide();
			
			if ( $imagePreview.length ) {
				$deleteBtn.show();
			} else {
				$deleteBtn.hide();
				$uploadBtn.html('Upload Image');
			}
			
			// Messages
			$uploadQueued.hide();
			
			// Redraw
			$(window).trigger('redraw');
		});
		
	});
	
});
