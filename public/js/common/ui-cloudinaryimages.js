jQuery(function($) {
	var supportedTypes = ['image/gif', 'image/png', 'image/jpeg', 'image/bmp', 'image/x-icon', 'application/pdf', 'image/x-tiff', 'image/x-tiff', 'application/postscript', 'image/vnd.adobe.photoshop'];
	
	// Cloudinary Images
	$('.field.type-cloudinaryimages').each(function() {
		
		var $el = $(this),
			data = $el.data();
		
		var $action = $el.find('input.field-action'),
			$order = $el.find('input.field-order'),
			$uploads = $el.find('input.field-uploads'),
			$cloudinary = $el.find('input[type=file].field-upload');
		
		var $images = $el.find('.images-container');
		
		var $imageUpload = $el.find('.image-upload');
		
		var $toolbar = $el.find('.images-toolbar'),
			$uploadBtn = $toolbar.find('.btn-upload'),
			$uploadQueued = $toolbar.find('.upload-queued'),
			$deleteQueued = $toolbar.find('.delete-queued');
		
		var actions = { delete: [], remove: [] },
			uploads = {};
		
		var images = $el.find('.image-field');
		
		var directUploading = $cloudinary.length,
			imagePreviews = window.FileReader;
		
		// Generates the action string that processes deletion and removal of images
		var updateActions = function() {
			$action.val((actions.delete.length ? 'delete:' + actions.delete.toString() : '') + '|' +
				(actions.remove.length ? 'remove:' + actions.remove.toString() : ''));
		};
		
		// Handles live uploads and sets returned data to save
		var processUploads = function() {
			var references = _.map(uploads, function(u) { return u; });
			$uploads.val(JSON.stringify(references));
			checkQueues();
		};
		
		// Displays or hides the queue message if we have pending uploads
		var checkQueues = function() {
			var references = 0;
			_.each($el.find('input[type=file]'), function(f) {
				references+= f.files.length;
			});
			references+= $uploads.val() ? JSON.parse($uploads.val()).length : 0;
			$uploadQueued[( references ? 'show' : 'hide' )]();
			$uploadQueued.find('.alert').html(references + ' image' + ( references > 1 ? 's' : '' ) +  ( directUploading ? ' uploaded - save to confirm' : ' selected - save to upload' ));
			
			var removals = actions.delete.length + actions.remove.length;
			$deleteQueued[( removals ? 'show' : 'hide' )]();
			$deleteQueued.find('.alert').html(removals + ' image' + ( removals > 1 ? 's' : '' ) + ' removed - save to confirm');
		};
		
		// Handle existing images
		images.each(function() {
			var $image = $(this),
				idata = $image.data();
			
			var $preview = $image.find('.image-preview');
			
			var $removeBtn = $image.find('.btn-remove-image'),
				$undoBtn = $image.find('.btn-undo-remove');
			
			var $deletePending = $image.find('.delete-pending');
			
			var action = false;
			
			$removeBtn.click(function(e) {
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
				$deletePending.addClass(action == 'delete' ? 'ion-trash-a' : 'ion-close').show();
				// Remove/Undo
				$removeBtn.hide();
				$undoBtn.show();
				// Messages
				checkQueues();
				// Actions
				updateActions();
			});
			
			$undoBtn.click(function(e) {
				e.preventDefault();
				actions[action].splice(actions[action].indexOf(idata.id), 1);
				// Preview
				$preview.removeClass('removed');
				$deletePending.removeClass('ion-close ion-trash-a').hide();
				// Remove/Undo
				$undoBtn.hide();
				$removeBtn.show();
				// Messages
				checkQueues();
				// Actions
				updateActions();
			});
			
		});
		
		// Popups
		images.find('.image-preview a').fancybox({
			prevEffect: 'none',
			nextEffect: 'none',
			closeBtn: false,
			helpers: {
				titl: {},
				buttons: {}
			}
		});
		
		// Sorting
		$images.html5sortable({
			items: '.image-sortable',
			placeholderClass: 'row col-sm-3 col-md-12',
			placeholderSizing: '.image-preview'
		}).bind('sortupdate', function() {
			var order = _.map($images.find('.image-sortable'), function(image) { return $(image).data().id; });
			$order.val(order.toString());
		});
		
		// Placeholders
		var renderPlaceholder = function() {
			
			var imageFieldHTML = '<div class="image-field row col-sm-3 col-md-12">' +
				'<div class="image-preview"><div class="img-thumbnail placeholder-wrap"><img class="placeholder' + ( !imagePreviews ? ' no-preview' : '' ) + '" /><div class="glyphicon ion-upload img-uploading"></div></div></div>' +
				'<div class="image-details"><a href="javascript:;" class="btn btn-link btn-cancel btn-undo-upload">Cancel</a></div>' +
			'</div>';
			
			return $(imageFieldHTML).insertBefore($imageUpload); // appendTo($images);
			
		};
		
		// File Reader
		var readFiles = function(files, callback) {
			
			var $files = [];
			
			var setupPlaceholder = function(file, e) {
			
				var $placeholder = renderPlaceholder();
				
				if (imagePreviews) {
					$placeholder.find('.img-thumbnail .placeholder').prop('src', e.target.result).prop( 'title', escape(file.name) );
				}
				
				$placeholder.find('.btn-undo-upload').click(function() {
					
					if (directUploading) {
						if ($placeholder.prop('data-id')) {
							delete uploads[$placeholder.prop('data-id')];
							processUploads();
						}
					} else {
						$field.remove();
					}
					
					$placeholder.remove();
					
					checkQueues();
				});
				
				$files.push(_.first($placeholder));
				
				checkQueues();
				$(window).trigger('redraw');
				
				return $placeholder;
			
			};
			
			if (imagePreviews) {
				async.each(files, function(f, next) {
					
					if (!_.contains(supportedTypes, f.type)) {
						$field.remove();
						checkQueues();
						alert("Unsupported file type. Supported formats are: GIF, PNG, JPG, BMP, ICO, PDF, TIFF, EPS, PSD");
						return next();
					}
					
					var fileReader = new FileReader();
					fileReader.onload = (function(file) {
						return function(e) {
							setupPlaceholder(file, e);
							return next();
						};
					})(f);
					fileReader.readAsDataURL(f);
					
				}, function(err) {
					if (callback)
						return callback($files);
				});
			} else {
				setupPlaceholder();
				if (callback)
					return callback($files);
			}
			
		};
		
		// Upload button
		$uploadBtn.click(function() {
			
			if (directUploading) {
				$el.find('input[type=file].field-upload').click(); // Needs to be referenced every time
			} else {
				var $field = $('<input id="' + new Date().getTime() + '" type="file" multiple name="' + data.fieldPathsUpload + '[]" class="field-upload">').appendTo($toolbar);
				$field.change(function(e) {
					var imageSelected = $(this).val() ? true : false;
					if (imageSelected) {
						readFiles(e.target.files);
					} else {
						$field.remove();
						checkQueues();
						$(window).trigger('redraw');
					}
				});
				$field.click();
			}
			
		});
		
		// Direct Uploading
		if (directUploading) {
			
			$imageUpload.click(function() {
				$el.find('input[type=file].field-upload').click(); // Needs to be referenced every time
			});
			
			$cloudinary.cloudinary_fileupload({
				dropZone: $imageUpload,
				pasteZone: null
			});
			
			var updateStatus = function($el, status, icon) {
				$el.find('.btn-undo-upload').html(status);
				$el.find('.img-uploading').removeClass( 'ion-upload ion-checkmark ion-alert-circled').addClass(icon);
			};
			
			$imageUpload.on({
				dragleave: function(e) {
					$imageUpload.removeClass('hover');
				},
				mouseleave: function(e) {
					$imageUpload.removeClass('hover');
				}
			});
			
			$cloudinary.on({
				fileuploaddragover: function() {
					$imageUpload.addClass('hover');
				},
				fileuploadsend: function(e, d) {
					readFiles(d.files, function(file) {
						d.$placeholder = $(file);
						updateStatus(d.$placeholder, '0%', 'ion-upload');
					});
					$imageUpload.removeClass('hover');
				},
				fileuploadprogress: function(e, d) {
					updateStatus(d.$placeholder, Math.round((d.loaded * 100.0) / d.total) + '%', 'ion-upload');
				},
				fileuploaddone: function(e, d) {
					updateStatus(d.$placeholder, 'Remove', 'ion-checkmark');
				},
				fileuploadfail: function(e, d) {
					updateStatus(d.$placeholder, 'Failed', 'ion-alert-circled');
				},
				cloudinarydone: function(e, d) {
					if (!d.$placeholder.is(':visible')) {
						return;
					}
					d.$placeholder.prop('data-id', d.result.public_id);
					uploads[d.result.public_id] = d.result;
					processUploads();
				}
			});
		
		} else {
			$imageUpload.hide();
		}
		
	});
	
});

