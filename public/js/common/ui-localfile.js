jQuery(function($) {

	// Local File
	$('.field.type-localfile').each(function() {

		var $el = $(this),
			data = $el.data();

		var $action = $el.find('.field-action'),
			$upload = $el.find('.field-upload');

		var $uploadBtn = $el.find('.btn-upload-file'),
			$deleteBtn = $el.find('.btn-delete-file'),
			$cancelBtn = $el.find('.btn-cancel-file'),
			$undoBtn = $el.find('.btn-undo-file');

		var $uploadQueued = $el.find('.upload-queued'),
			$deleteQueued = $el.find('.delete-queued');

		var $deletePending = $el.find('.delete-pending');

		var $file = $el.find('.file-container'),
			$filePreview = $file.find('.file-preview.current'),
			$fileDetails = $file.find('.file-details'),
			$fileValues = $file.find('.file-values');

		var action = false;

		var removeNewFile = function() {
			$el.find('.file-preview.new').remove();
		}

		$upload.change(function(e) {
			var fileSelected = $(this).val() ? true : false;
			var renderPlaceholder = function() {
				// File
				$filePreview.hide();
				$fileValues.hide();
				// Messages
				$uploadQueued[fileSelected ? 'show' : 'hide']();
				// Buttons
				$undoBtn.hide();
				$deleteBtn.hide();
				$cancelBtn.show();
				$uploadBtn.text(fileSelected ? 'Change File' : 'Upload File');
				// Preview
				removeNewFile();
			};
			// Preview
			if (fileSelected) {
				if (window.FileReader) {
					var files = e.target.files;
					for (var i = 0, f; f = files[i]; i++) {
						var fileReader = new FileReader();
						fileReader.onload = (function(file) {
							return function(e) {
								renderPlaceholder();
								$uploadQueued.find('.file-name').html("'" + file.name + "' ");
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

		// Upload File
		$uploadBtn.click(function() {
			$upload.click();
		});

		// Delete/Remove File
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
			$fileValues.hide();
			// File
			$filePreview.addClass('removed');
			$deletePending.addClass(action == 'delete' ? 'ion-trash-a' : 'ion-close').show();
			// Buttons
			$deleteBtn.hide();
			$undoBtn.html('Undo ' + ( action == 'delete' ? 'Delete' : 'Remove')).show();
			$cancelBtn.hide();
			$uploadBtn.html('Upload File');
			// Messages
			$deleteQueued.show();
			$deleteQueued.find('.alert').html('File '+ ( action == 'delete' ? 'deleted' : 'removed') + ' - save to confirm');
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
			$fileValues.show();
			// File
			$filePreview.removeClass('removed');
			$deletePending.removeClass('ion-close ion-trash-a').hide();
			// Buttons
			$undoBtn.hide();
			$cancelBtn.hide();
			$deleteBtn.show();
			$uploadBtn.html('Change File');
			// Messages
			$deleteQueued.hide();
			// Redraw
			$(window).trigger('redraw');
		});

		// Cancel Upload
		$cancelBtn.click(function(e) {
			e.preventDefault();
			// Remove new file preview
			removeNewFile();
			// Erase selected file
			$upload.val('');
			// If we have an file already
			if (data.fieldValue) {
				// Show it
				$filePreview.show();
				// If we've got a pending remove/delete
				if (action) {
					// Show the undo button
					$undoBtn.show();
				} else {
					// Make sure the undo button is hidden
					$undoBtn.hide();
					// Show delete button
					$deleteBtn.show();
					// Show file values
					$fileValues.show();
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
				// Make sure upload button references no current file
				$uploadBtn.html('Upload File');
			}
			// Hide the cancel upload button
			$cancelBtn.hide();
			// Hide queued upload message
			$uploadQueued.hide();
			// Redraw
			$(window).trigger('redraw');
		});

	});

});
