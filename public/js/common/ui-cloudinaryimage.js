jQuery(function($) {
	
	/*
	$('.btn-upload').click(function() {
		$(this).closest('.field').find('.field-upload').click();
	});
	
	$('.field-upload').change(function() {
		var imageSelected = $(this).val() ? true : false,
			$field = $(this).closest('.field');
		$field.find('.upload-queued')[imageSelected ? 'show' : 'hide']();
		$field.find('.btn-upload').text(imageSelected ? 'Upload a different image' : 'Upload image');
		$(window).trigger('redraw');
	});
	
	$('.btn-delete-image').click(function(e) {
		
		var $field = $(this).closest('.field');
		
		if (e.altKey) {
			if (!confirm("Are you sure you want to delete the image?\n\n"))
				return;
			$field.find('.field-action').val('delete');
		} else {
			$field.find('.field-action').val('reset');
		}
		
		$field.find('.has-image').removeClass('has-image');
		$field.find('.image-preview').remove();
		$field.find('.image-details').remove();
		
		$(this).remove();
		
		$(window).trigger('redraw');
		
	});
	*/
	
	// Cloudinary Image
	$('.field.type-cloudinaryimage').each(function() {
	
		var $el = $(this),
			data = $el.data();
		
		var $action = $el.find('.field-action');
		
		var $uploadBtn = $el.find('.btn-upload'),
			$uploadField = $el.find('.field-upload'),
			$uploadQueued = $el.find('.upload-queued');
		
		var $deleteBtn = $el.find('.btn-delete-image');
		
		var $image = $el.find('.image-container'),
			$imageDetails = $image.find('.image-details');
		
		var imageFieldHTML = '<div class="image-preview">' +
				'<div class="img-thumbnail placeholder-wrap"><img class="placeholder' + ( !window.FileReader ? ' no-preview' : '' ) + '" /><div class="glyphicon glyphicon-open upload-pending"></div></div></div>'
			'</div>' +
			'<div class="image-details">' +
				'<div class="field-value"></div>' +
				'<div class="field-value"></div>' +
			'</div>';
		
		$uploadBtn.click(function() {
			$uploadField.click();
		});
		
		$uploadField.change(function(e) {
			
			var imageSelected = $(this).val() ? true : false,
				$field = $(this).closest('.field');
			
			if (imageSelected) {
				$el.find('.image-preview').remove(); // Remove any existing preview
				if (window.FileReader) {
					var files = e.target.files;
					for (var i = 0, f; f = files[i]; i++) {
						if (!f.type.match('image.*')) {
							$field.remove();
							checkQueues();
							alert("Please select image files only.");
							continue;
						}
						var $placeholder = $(imageFieldHTML).appendTo($image);
						
						$imageDetails.hide();
						
						/*
						$placeholder.find('.btn-undo-upload').click(function() {
							$placeholder.remove();
							$field.remove();
							checkQueues();
						});
						*/
						var fileReader = new FileReader();
						fileReader.onload = (function(file) {
							return function(e) {
								$placeholder.find('.img-thumbnail .placeholder').prop('src', e.target.result).prop( 'title', escape(file.name) );
							};
						})(f);
						fileReader.readAsDataURL(f);
					}
				} else {
					/*
					var $placeholder = $(imageFieldHTML).appendTo($image);
					$placeholder.find('.btn-cloudinaryimages-undo-upload').click(function() {
						$placeholder.remove();
						$field.remove();
						checkQueues();
					});
					*/
				}
			}
			
			$uploadQueued[imageSelected ? 'show' : 'hide']();
			$uploadBtn.text(imageSelected ? 'Change image' : 'Upload image');
			
			$(window).trigger('redraw');
		
		});
		
		$deleteBtn.click(function(e) {
		
			if (e.altKey) {
				if (!confirm("Are you sure you want to delete the image?\n\n"))
					return;
				$action.val('delete');
			} else {
				$action.val('reset');
			}
			
			$el.find('.has-image').removeClass('has-image');
			$el.find('.image-preview').remove();
			$el.find('.image-details').remove();
			
			$(this).remove();
			
			$(window).trigger('redraw');
		
		});
		
	});
	
	// Cloudinary Image
	/*
	$('.field.type-cloudinaryimage').each(function() {
		
		var $el = $(this),
			data = $el.data();
		
		var $action = $el.find('input.field-action');
			// $order = $el.find('input.field-order');
		
		var $images = $el.find('.images-container');
		
		var $toolbar = $el.find('.images-toolbar'),
			$upload = $toolbar.find('.btn-cloudinaryimages-upload'),
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
			var uploads = $el.find('input[type=file]').length;
			$uploadQueued[( uploads ? 'show' : 'hide' )]();
			$uploadQueued.find('.alert').html(uploads + ' image' + ( uploads > 1 ? 's' : '' ) + ' selected - save to upload');
			
			var deletes = actions.delete.length + actions.remove.length;
			$deleteQueued[( deletes ? 'show' : 'hide' )]();
			$deleteQueued.find('.alert').html(deletes + ' image' + ( deletes > 1 ? 's' : '' ) + ' removed - save to confirm');
		}
		
		// Handle existing images
		images.each(function() {
			
			var $image = $(this),
				idata = $image.data();
			
			var $preview = $image.find('.image-preview');
			
			var $remove = $image.find('.btn-cloudinaryimages-remove-image'),
				$undo = $image.find('.btn-cloudinaryimages-undo-remove');
			
			var $deletePending = $image.find('.delete-pending');
			
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
				$deletePending.addClass(action == 'delete' ? 'glyphicon-trash' : 'glyphicon-remove').show();
				
				$remove.hide();
				$undo.show();
				
				checkQueues();
				updateActions();
				
			});
			
			$undo.click(function(e) {
				e.preventDefault();
				actions[action].splice(actions[action].indexOf(idata.id), 1);
				
				$preview.removeClass('removed');
				$deletePending.removeClass('glyphicon-remove glyphicon-trash').hide();
				
				$undo.hide();
				$remove.show();
				
				checkQueues();
				updateActions();
			
			});
			
		});
		
		images.find('.image-preview a').touchTouch();
		
		// Handle uploads
		var imageFieldHTML = '<div class="image-field row col-sm-3 col-md-12">' +
			'<div class="image-preview"><div class="img-thumbnail placeholder-wrap"><img class="placeholder' + ( !window.FileReader ? ' no-preview' : '' ) + '" /><div class="glyphicon glyphicon-open upload-pending"></div></div></div>' +
			'<div class="image-details"><a href="javascript:;" class="btn btn-link btn-cancel btn-cloudinaryimages-undo-upload">Cancel</a></div>' +
		'</div>';
		
		$upload.click(function() {
			
			var $field = $('<input type="file" name="' + data.fieldPathsUpload + '" class="field-upload">').appendTo($toolbar);
			
			$field.change(function(e) {
				
				var imageSelected = $(this).val() ? true : false;
				
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
							var $placeholder = $(imageFieldHTML).appendTo($images);
							$placeholder.find('.btn-cloudinaryimages-undo-upload').click(function() {
								$placeholder.remove();
								$field.remove();
								checkQueues();
							});
							var fileReader = new FileReader();
							fileReader.onload = (function(file) {
								return function(e) {
									$placeholder.find('.img-thumbnail .placeholder').prop('src', e.target.result).prop( 'title', escape(file.name) );
								};
							})(f);
							fileReader.readAsDataURL(f);
						}
					} else {
						var $placeholder = $(imageFieldHTML).appendTo($images);
						$placeholder.find('.btn-cloudinaryimages-undo-upload').click(function() {
							$placeholder.remove();
							$field.remove();
							checkQueues();
						});
					}
				} else {
					$placeholder.remove();
					$field.remove();
				}
				
				checkQueues();
				
				$(window).trigger('redraw');
				
			});
			
			$field.click();
		
		});
		
	});
	*/
	
});
