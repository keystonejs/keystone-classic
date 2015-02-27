var keystone = require('keystone');

module.exports = require('../BuildPkgCloudStorage')('amazon', function() {
	return keystone.get('s3 config');
});
