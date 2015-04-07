var cloudinary = require('cloudinary'),
	keystone = require('../../');

exports = module.exports = {

	upload: function(req, res) {
		if(req.files && req.files.file){
			var options = {};

			if (keystone.get('wysiwyg cloudinary images filenameAsPublicID')) {
				options.public_id = req.files.file.originalname.substring(0, req.files.file.originalname.lastIndexOf('.'));
			}

			cloudinary.uploader.upload(req.files.file.path, function(result) {
				if (result.error) {
					res.json({ error: { message: result.error.message } });
				} else {
					res.json({ image: { url: result.url } });
				}
			}, options);
		} else {
			res.json({ error: { message: 'No image selected' } });
		}
	},

	autocomplete: function(req, res) {
		var max = req.query.max || 10,
			prefix = req.query.prefix || '',
			next = req.query.next || null;

		cloudinary.api.resources(function(result) {
			if (result.error) {
				res.json({ error: { message: result.error.message } });
			} else {
				res.json({
					next: result.next_cursor,
					items: result.resources
				});
			}
		}, { 
			type: 'upload',
			prefix: prefix,
			max_results: max,
			next_cursor: next
		});
	},

	get: function(req, res) {
		cloudinary.api.resource(req.query.id, function(result) {
			if (result.error) {
				res.json({ error: { message: result.error.message } });
			} else {
				res.json({ item: result });	
			}
		});
	}
};
