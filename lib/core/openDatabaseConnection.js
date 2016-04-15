var debug = require('debug')('keystone:core:openDatabaseConnection');

module.exports = function openDatabaseConnection (callback) {

	var keystone = this;
	var mongoConnectionOpen = false;

	// support replica sets for mongoose
	if (keystone.get('mongo replica set')) {

		if (keystone.get('logger')) {
			console.log('\nWarning: using the `mongo replica set` option has been deprecated and will be removed in'
				+ ' a future version.\nInstead set the `mongo` connection string with your host details, e.g.'
				+ ' mongodb://username:password@host:port,host:port,host:port/database and set any replica set options'
				+ ' in `mongo options`.\n\nRefer to https://mongodb.github.io/node-mongodb-native/driver-articles/mongoclient.html'
				+ ' for more details on the connection settings.');
		}

		debug('setting up mongo replica set');
		var replicaData = keystone.get('mongo replica set');
		var replica = '';

		var credentials = (replicaData.username && replicaData.password) ? replicaData.username + ':' + replicaData.password + '@' : '';

		replicaData.db.servers.forEach(function (server) {
			replica += 'mongodb://' + credentials + server.host + ':' + server.port + '/' + replicaData.db.name + ',';
		});

		var options = {
			auth: { authSource: replicaData.authSource },
			replset: {
				rs_name: replicaData.db.replicaSetOptions.rs_name,
				readPreference: replicaData.db.replicaSetOptions.readPreference,
			},
		};

		debug('connecting to replicate set');
		keystone.mongoose.connect(replica, options);

	} else {
		debug('connecting to mongo');
		keystone.mongoose.connect(keystone.get('mongo'), keystone.get('mongo options'));
	}

	keystone.mongoose.connection.on('error', function (err) {

		if (keystone.get('logger')) {
			console.log('------------------------------------------------');
			console.log('Mongo Error:\n');
			console.log(err);
		}

		if (mongoConnectionOpen) {
			if (err.name === 'ValidationError') return;
			throw err;
		} else {
			throw new Error('KeystoneJS (' + keystone.get('name') + ') failed to start - Check that you are running `mongod` in a separate process.');
		}

	}).on('open', function () {

		debug('mongo connection open');
		mongoConnectionOpen = true;

		var connected = function () {
			if (keystone.get('auto update')) {
				debug('applying auto update');
				keystone.applyUpdates(callback);
			} else {
				callback();
			}
		};

		if (keystone.sessionStorePromise) {
			keystone.sessionStorePromise.then(connected);
		} else {
			connected();
		}

	});

	return this;
};
