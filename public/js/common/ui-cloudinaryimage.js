jQuery(function($) {
	var supportedTypes = ['image/gif', 'image/png', 'image/jpeg', 'image/bmp', 'image/x-icon', 'application/pdf', 'image/x-tiff', 'image/x-tiff', 'application/postscript', 'image/vnd.adobe.photoshop'];
	
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
			$deleteQueued = $el.find('.delete-queued'),
			$selectQueued = $el.find('.select-queued');
		
		var $deletePending = $el.find('.delete-pending');
		
		var $image = $el.find('.image-container'),
			$imagePreview = $image.find('.image-preview.current'),
			$imageDetails = $image.find('.image-details'),
			$imageValues = $image.find('.image-values');

		var $select2Input = $el.find('.ui-select2-cloudinary');
		
		var action = false;
		
		var imageFieldHTML = '<div class="image-preview new">' +
				'<div class="img-thumbnail placeholder-wrap"><img class="placeholder' + ( !window.FileReader ? ' no-preview' : '' ) + '" /><div class="ion-upload upload-pending"></div></div></div>'
			'</div>';
		
		var removeNewImage = function() {
			$el.find('.image-preview.new').remove();
		};

		var removeSelectImage = function() {
			$el.find('.image-preview.select').remove();
		};

		var clearSelect = function() {
			$select2Input.siblings('.select2-container').select2('val', '', true);
			// $select2Input.val('');
		};

		var checkExistingImage = function() {
			if (data.fieldValue) {
				// Show it
				$imagePreview.show();
				// If we've got a pending remove/delete
				if (action) {
					// Show the undo button
					$undoBtn.show();
					// Messages
					$deleteQueued.show();
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
		};
		
		$upload.change(function(e) {
			var imageSelected = $(this).val() ? true : false;
			var renderPlaceholder = function() {
				// Cloud selection
				clearSelect();
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
			};
			// Preview
			if (imageSelected) {
				if (window.FileReader) {
					var files = e.target.files;
					for (var i = 0, f; f = files[i]; i++) {
						if (!_.contains(supportedTypes, f.type)) {
							$upload.val('');
							alert("Unsupported file type. Supported formats are: GIF, PNG, JPG, BMP, ICO, PDF, TIFF, EPS, PSD");
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
				$action.val($deleteBtn.data('alt-action'));
				action = $deleteBtn.data('alt-action') === 'delete' ? 'delete' : 'remove';
			} else {
				$action.val($deleteBtn.data('default-action'));
				action = $deleteBtn.data('default-action') === 'delete' ? 'delete' : 'remove';
			}
			// Details
			$imageValues.hide();
			// Image
			$imagePreview.addClass('removed');
			$deletePending.addClass(action == 'delete' ? 'ion-trash-a' : 'ion-close').show();
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
			$deletePending.removeClass('ion-close ion-trash-a').hide();
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
			checkExistingImage();
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

		$select2Input.each(function(i, el) {
			
			el = $(el), query = '';

			var perPage = 10,
				args = {
					context: 'cloudinary',
					list: Keystone.list.path,
					field: el.attr('name'),
					prefix: el.data('prefix'),
				},
				cursors;
			
			if (Keystone.item) {
				args.item = Keystone.item.id;
			}
			
			el.select2({
				placeholder: 'Search for an image from Cloudinary ...',
				allowClear: true,
				multiple: false,
				width: "60%",
				loadMorePadding: 100,
				ajax: { 
					url: '/keystone/api/cloudinary/autocomplete',
					dataType: 'json',
					quietMillis: 500,
					data: function(term, page) {
						query = term;

						if (page == 1) {
							cursors = [ null ]
						};

						return _.extend({
							q: term, //search term
							max: perPage, // page size
							page: page, // page number, tracked by select2, one-based
							next: cursors[page - 1]
						}, args);
					},
					results: function(data, page) {
						var more = !!data.next, items = [];
						if (more) {
							cursors.push(data.next);
						}

						$.each(data.items, function(){
							if(query.length == 0 || this.public_id.toLowerCase().indexOf(query.toLowerCase()) >= 0 ){
								items.push(this);
							}
						});
	 
						return { results: items, more: more };
					}
				},
				id: function(item){ return item.public_id; },
				initSelection: function(element, callback) {
					var id = $(element).val();
					if (id !== '') {
						$.ajax('/keystone/api/cloudinary/get', {
							data: { id: id },
							dataType: 'json'
						}).done(function(result) {
							callback({
								id: result.id,
								text: result.id
							});							
						});
					}
				},
				formatResult: function(item) { return item.public_id; },
				formatSelection: function(item) { return item.public_id; },
				escapeMarkup: function (m) { return m; } // we do not want to escape markup since we are displaying html in results
			});

			el.on('change', function(e) {
				var select2data, imageWrapper, $newImage;

				if (e.val === '') {
					removeSelectImage();
					$selectQueued.hide();
					checkExistingImage();
					return;
				}

				if ($el.find('.image-preview.current').length) {
					// Image
					$imagePreview.hide();
					$imageValues.hide();
					// Messages
					$uploadQueued.hide();
					// Buttons
					$undoBtn.hide();
					$deleteBtn.hide();
					$cancelBtn.hide();
				}

				if ($el.find('.image-preview.new').length) {
					// Image
					removeNewImage();
					// Data
					$upload.val('');
					// Messages
					$uploadQueued.hide();
					$cancelBtn.hide();
				}

				if ($el.find('.image-preview.select').length) {
					removeSelectImage();
				}

				select2data = el.select2('data');
				imageWrapper = '<div class="image-preview select">' +
					'<div class="img-thumbnail placeholder-wrap"></div><div class="ion-cloud upload-pending"></div>' +
					'</div>';
				$newImage = $('<img class="placeholder" />').attr('src', select2data.url);

				$newImage.on('load', function() {
					$(imageWrapper).prependTo($image).find('.img-thumbnail').append($(this));
					$selectQueued.show();
				});

			});

		});
		
	});
	
});
