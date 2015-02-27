var moment = require('moment');

function StorageAdapter(options) {
	this.options = options;
}

StorageAdapter.prototype.normaliseFilename = function (filename) {
	if (this.options.datePrefix) {
		return moment().format(this.options.datePrefix) + '-' + filename;
	} else {
		return filename;
	}
};

module.exports = StorageAdapter;
