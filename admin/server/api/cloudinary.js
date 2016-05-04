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
		var type = req.params.type || 'image';
		var max = req.query.max || 50;
		var prefix = req.query.prefix || '';

		var collection = []
		iterateCloudinary(collection, type, max, prefix, null,
			function(error, callbackResult) {
				if (error) {
					res.json(error)
				} else {
					res.json({
						items: callbackResult.sort(sortById)
					});
				}
		})
	},
	autocompletemedia: function (req, res) {
		var cloudinary = require('cloudinary');
		var async = require('async');

		var type = req.params.type || 'image';
		var max = req.query.max || 50;
		var prefix = req.query.prefix || '';
		var next = req.query.next || null;

		var collection = []

		async.parallel([
			function(callback) { iterateCloudinary(collection, 'image', max, prefix, null, callback) },
			function(callback) { iterateCloudinary(collection, 'video', max, prefix, null, callback) }
		],
		function(error, results){
			if (error) {
				res.json(error)
			} else {
				results[0].sort(sortById)
				results[1].sort(sortById)

				res.json({
					items: results[0].concat(results[1])
				});
			}
		})
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

function iterateCloudinary(collection, type, max, prefix, next, callback) {
	var cloudinary = require('cloudinary')
	cloudinary.api.resources(function (result) {
		if (result.error) {
			callback({ error: { message: result.error.message } }, null)
		} else {
			if (collection.length === 0) {
				collection = result.resources
			} else {
				collection = collection.concat(result.resources)
			}
			if (result.next_cursor) {
				iterateCloudinary(collection, type, max, prefix, result.next_cursor, callback)
			} else {
				callback(null, collection)
			}
		};
	}, {
		resource_type: type,
		type: 'upload',
		prefix: prefix,
		max_results: max,
		next_cursor: next,
	});
}

function sortById(a,b) {
  if (a.public_id < b.public_id)
    return -1;
  else if (a.public_id > b.public_id)
    return 1;
  else 
    return 0;
}

