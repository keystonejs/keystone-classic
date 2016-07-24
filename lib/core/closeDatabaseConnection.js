var debug = require('debug')('keystone:core:closeDatabaseConnection');

module.exports = function closeDatabaseConnection (callback) {
	this.mongoose.disconnect(function () {
		debug('mongo connection closed');
		callback && callback();
	});
	return this;
};
