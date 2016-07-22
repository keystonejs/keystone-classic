var debug = require('debug')('keystone:core:closeDatabaseConnection');

module.exports = function closeDatabaseConnection (callback) {
	var keystone = this;
	keystone.closeDatabaseConnection = function () {
		keystone.mongoose.disconnect(() => {
			debug('mongo connection closed');
			callback();
		});
	};
	return this;
};
