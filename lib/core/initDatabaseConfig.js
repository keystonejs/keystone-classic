var utils = require('keystone-utils');

module.exports = function initDatabaseConfig () {
	if (!this.get('mongo')) {
		var dbName = this.get('db name')
			|| utils.slug(this.get('name'));
		var dbUrl = process.env.MONGO_URI
			|| process.env.MONGODB_URI
			|| process.env.MONGO_URL
			|| process.env.MONGODB_URL
			|| process.env.MONGOLAB_URI
			|| process.env.MONGOLAB_URL
			|| (process.env.OPENSHIFT_MONGODB_DB_URL
			|| 'mongodb://localhost/') + dbName;
		this.set('mongo', dbUrl);
	}
	return this;
};
