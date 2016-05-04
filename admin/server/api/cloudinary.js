var keystone = require('../../../');

module.exports = {
	upload: function (req, res) {
		var cloudinary = require('cloudinary');
		if (req.files && req.files.file) {
			var options = {};

			if (keystone.get('wysiwyg cloudinary images filenameAsPublicID')) {
				options.public_id = req.files.file.originalname.substring(0, req.files.file.originalname.lastIndexOf('.'));
			}

			cloudinary.uploader.upload(req.files.file.path, function (result) {
				var sendResult = function () {
					if (result.error) {
						res.send({ error: { message: result.error.message } });
					} else {
						res.send({ image: { url: (keystone.get('cloudinary secure') === true) ? result.secure_url : result.url } });
					}
				};

				// TinyMCE upload plugin uses the iframe transport technique
				// so the response type must be text/html
				res.format({
					html: sendResult,
					json: sendResult,
				});
			}, options);
		} else {
			res.json({ error: { message: 'No image selected' } });
		}
	},
	autocomplete: function (req, res) {
		var cloudinary = require('cloudinary');
		var type = req.params.type;
		var max = req.query.max || 100;
		var prefix = req.query.prefix || '';
		var next = req.query.next || null;

		cloudinary.api.resources(function (result) {
			if (result.error) {
				res.json({ error: { message: result.error.message } });
			} else {
				res.json({
					next: result.next_cursor,
					items: result.resources,
				});
			};
		}, {
			resource_type: type,
			type: 'upload',
			prefix: prefix,
			max_results: max,
			next_cursor: next,
		});
	},
	autocompletemedia: function (req, res) {
		var cloudinary = require('cloudinary');
		var imageResult;

		var max = req.query.max || 100;
		var prefix = req.query.prefix || '';
		var next = req.query.next || null;

		cloudinary.api.resources(function (imgResult) {
			if (imgResult.error) {
				res.json({ error: { message: imgResult.error.message } });
			} else {
				imageResult = imgResult.resources;
				cloudinary.api.resources(function (videoResult) {
					if (videoResult.error) {
						res.json({ error: { message: videoResult.error.message } });
					} else {
						var combinedResult = imageResult.concat(videoResult.resources);
						res.json({
							next: videoResult.next_cursor,
							items: combinedResult,
						});
					}
				}, {
					resource_type: 'video',
					type: 'upload',
					prefix: prefix,
					max_results: max,
					next_cursor: next,
				});
			};
		}, {
			resource_type: 'image',
			type: 'upload',
			prefix: prefix,
			max_results: max,
			next_cursor: next,
		});
	},
	get: function (req, res) {
		var cloudinary = require('cloudinary');
		cloudinary.api.resource(req.query.id, function (result) {
			if (result.error) {
				res.json({ error: { message: result.error.message } });
			} else {
				res.json({ item: result });
			}
		});
	},
};
