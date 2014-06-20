jQuery(function($) {

	// Local File
	$('.field.type-localfiles').each(function() {

		var $el = $(this),
		data = $el.data();

		var $action = $el.find('.field-action'),
		$order = $el.find('input.field-order')
		$upload = $el.find('.field-upload');

		var $uploadBtn = $el.find('.btn-upload'),
		$deleteBtn = $el.find('.btn-delete-file'),
		$cancelBtn = $el.find('.btn-cancel-file'),
		$undoBtn = $el.find('.btn-undo-file');

		var $uploadQueued = $el.find('.upload-queued'),
		$deleteQueued = $el.find('.delete-queued');


		var $files = $el.find('.files-container'),
		$filePreview = $files.find('.file-preview.current'),
		$fileDetails = $files.find('.file-details'),
		$fileValues = $files.find('.file-values');

		
		var actions = { delete: [], remove: [] }, uploads = {};
		var files = $el.find('.file-field');

		// Generates the action string that processes deletion and removal of images
		var updateActions = function() {
			$action.val((actions.delete.length ? 'delete:' + actions.delete.toString() : '') + '|' +
				(actions.remove.length ? 'remove:' + actions.remove.toString() : ''));
		};

		// Handle existing files
		files.each(function() {

			var $file = $(this),
			idata = $file.data();

			var $removeBtn = $file.find('.btn-remove-file'),
			$undoBtn = $file.find('.btn-undo-remove');

			var action = false;

			var $preview = $file.find('.file-preview');
			var $deletePending = $file.find('.delete-pending');

			$removeBtn.click(function(e) {
				e.preventDefault();
				actions.delete.push(idata.id);
				action = 'delete';
				// Preview
				$preview.addClass('remove');
				$deletePending.show();
				// Remove/Undo
				$removeBtn.hide();
				$undoBtn.show();
				// Actions
				updateActions();
			});
			
			$undoBtn.click(function(e) {
				e.preventDefault();
				actions[action].splice(actions[action].indexOf(idata.id), 1);
				// Preview
				$preview.removeClass('remove');
				$deletePending.hide();
				// Remove/Undo
				$undoBtn.hide();
				$removeBtn.show();
				// Actions
				updateActions();
			});

		}); // @end of Handle existing files

		$files.html5sortable({
			items: '.file-sortable',
			placeholderClass: 'row col-sm-3 col-md-12',
			placeholderSizing: '.file-preview'
		}).bind('sortupdate', function(){
			var order = _.map($files.find('.file-sortable'), function(file) { return $(file).data().id; });
			$order.val(order.toString());
		});

		$upload.change(function(e) {
			var fileSelected = $(this).val() ? true : false;
			var renderPlaceholder = function() {
				// Messages
				$uploadQueued[fileSelected ? 'show' : 'hide']();
				// Buttons
				$cancelBtn.show();
				$uploadBtn.text('Change Files');
			};
			// Preview
			if (fileSelected) {
				if (window.FileReader) {
					var files = e.target.files;
					$uploadQueued.find('.files-list').html('');
					if(files.length > 0)
						$uploadQueued.find('.number-of-files').html(files.length+' files');
					else
						$uploadQueued.find('.number-of-files').html('One file');
					for (var i = 0, f; f = files[i]; i++) {
						var fileReader = new FileReader();
						fileReader.onload = (function(file) {
							return function(e) {
								renderPlaceholder();
								$uploadQueued.find('.files-list').append( $('<p>' + file.name + '</p>') );
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


		// Cancel Upload
		$cancelBtn.click(function(e) {
			e.preventDefault();
			// Erase selected file
			$upload.val('');
			$uploadBtn.html('Upload Files');
			// Hide the cancel upload button
			$upload.wrap('<form>').closest('form').get(0).reset();
			$upload.unwrap();
			$cancelBtn.hide();
			// Hide queued upload message
			$uploadQueued.hide();
			$uploadQueued.find('.files-list').html('');
			// Redraw
			$(window).trigger('redraw');
		});

	});

});
