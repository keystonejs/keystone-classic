var _ = require('underscore'),
	express = require('express');

function mountMongo(keystone,callback) {
	// Connect to database
	
	var mongoConnectionOpen = false;
	
	// support replica sets for mongoose
	if (keystone.get('mongo replica set')){
		
		var replicaData = keystone.get('mongo replica set');
		var replica = "";
		
		var credentials = (replicaData.username && replicaData.password) ? replicaData.username +":"+replicaData.password+"@" : '';
		
		replicaData.db.servers.forEach(function (server) {
			replica += "mongodb://"+credentials+server["host"]+":"+server["port"]+"/"+replicaData.db.name+",";
		});
		
		var options = {
			auth: { authSource: replicaData.authSource },
			replset: {
				rs_name: replicaData.db.replicaSetOptions.rs_name,
				readPreference: replicaData.db.replicaSetOptions.readPreference
			}
		};
		
		keystone.mongoose.connect(replica, options);
		
	} else {
		
		keystone.mongoose.connect(keystone.get('mongo'));
		
	}
	
	keystone.mongoose.connection.on('error', function(err) {
		
		if (keystone.get('logger')) {
			console.log('------------------------------------------------');
			console.log('Mongo Error:\n');
			console.log(err);
		}
		
		if (mongoConnectionOpen) {
			throw new Error('Mongo Error');
		} else {
			throw new Error('KeystoneJS (' + keystone.get('name') + ') failed to start');
		}
		
	}).on('open', function() {
		
		mongoConnectionOpen = true;
		
		// app is mounted and db connection acquired, time to call back
		
		callback();
		
	});
}

module.exports = mountMongo;
