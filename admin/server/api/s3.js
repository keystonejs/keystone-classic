var keystone = require('../../../');
var Types = keystone.Field.Types;

module.exports = {

	upload: function (req, res) {
		var knox = require('knox');

		if (!keystone.security.csrf.validate(req, req.body.authenticity_token)) {
			return res.status(403).send({ error: { message: 'invalid csrf' } });
		}

		if (req.files && req.files.file) {

			var s3Config = keystone.get('s3 config');

			var file = req.files.file;
			var path = s3Config.s3path ? s3Config.s3path + '/' : '';

			var headers = Types.S3File.prototype.generateHeaders.call({ s3config: s3Config, options: {} }, null, file);

			var s3Client = knox.createClient(s3Config);

			s3Client.putFile(file.path, path + file.name, headers, function (err, s3Response) {
				var sendResult = function () {
					if (err) {
						return res.send({ error: { message: err.message } });
					}

					if (s3Response) {
						if (s3Response.statusCode !== 200) {
							return res.send({ error: { message: 'Amazon returned Http Code: ' + s3Response.statusCode } });
						} else {
							return res.send({ image: { url: 'https://s3.amazonaws.com/' + s3Config.bucket + '/' + file.name } });
						}
					}
				};

				res.format({
					html: sendResult,
					json: sendResult,
				});
			});

		} else {
			res.json({ error: { message: 'No image selected' } });
		}
	},
};
