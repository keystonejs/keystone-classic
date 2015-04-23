var moment = require('moment');

function StorageAdapter(options) {
	this.options = options;
}

StorageAdapter.prototype.normaliseFilename = function (item, file, options) {
	var filename;
	if('function' === typeof options.filename){
		filename = options.filename(item, file);
	}
	if (options.datePrefix) {
		filename = moment().format(options.datePrefix) + '-' + (filename || file.originalname);
	}
	
	return filename || file.name;
};

module.exports = StorageAdapter;
