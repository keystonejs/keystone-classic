/*
TODO: Needs Review and Spec
*/
var sanitize = require('sanitize-filename');
var trimSupportedFileExtensions = require('../../../fields/utils/trimSupportedFileExtensions');

module.exports = {
	upload: function (req, res) {
		var cloudinary = require('cloudinary');
		var keystone = req.keystone;

		if (req.files && req.files.file) {
			var options = {};

			if (keystone.get('wysiwyg cloudinary images filenameAsPublicID')) {
				let filename = req.files.file.originalname;
				filename = sanitize(filename);
				filename = trimSupportedFileExtensions(filename);
				options.public_id = filename;
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
		const cloudinary = require('cloudinary');
		const max = req.query.max || 10;
		const prefix = req.query.prefix || '';
		const resources = [];
		let next = req.query.next || null;

		function getResources () {
			cloudinary.api.resources(function (result) {
				if (result.error) {
					res.json({ error: { message: result.error.message } });
				} else {
					const options = { width: 100, height: 50, crop: 'pad', format: 'jpg' };
					result.resources = result.resources.reduce((existing, resource) => {
						if (!resource.placeholder) {
							resource.thumbnail = cloudinary.url(resource.public_id, options);
							existing.push(resource);
						}
						return existing;
					}, []);
					resources.push(...result.resources);
					if (result.next_cursor) {
						next = result.next_cursor;
						getResources();
						return;
					}
					res.json({
						next: result.next_cursor,
						items: resources,
					});
				}
			}, {
				type: 'upload',
				prefix: prefix,
				max_results: max,
				next_cursor: next,
				context: true,
			});
		};
		getResources();
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
