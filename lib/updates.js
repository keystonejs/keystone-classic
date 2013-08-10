var _ = require('underscore'),
	fs = require('fs'),
	path = require('path'),
	async = require('async'),
	semver = require('semver'),
	keystone = require('../'),
	mongoose = keystone.mongoose,
	utils = require('./utils');


// Update Schema - defined here rather than in main models for portability
var UpdateModel = new mongoose.Schema({
	key: { type: String, index: true },
	appliedOn: { type: Date, default: Date.now }
});
mongoose.model('App_Update', UpdateModel);

// Apply method - loads the available updates and applies any that haven't been, in order
exports.apply = function(callback) {
	
	var Update = mongoose.model('App_Update');
		updateCount = 0;
	
	var applyUpdate = function(file, done) {
		Update.findOne({ key: file }, function(err, updateRecord) {
			if (err) {
				console.error('Error searching database for update ' + file + ':');
				console.dir(err);
				done();
			} else if (!updateRecord) {
				updateCount++;
				console.log('Applying update ' + file + '...');
				var update = require(process.cwd() + '/updates/' + file);
				if ('function' != typeof update) {
					throw new Error("Update files must export a single function.")
				}
				update(function() {
					console.log('Successfully applied update ' + file + '.');
					new Update({key: file}).save(done);
				});
			} else {
				done();
			}
		});
	};
	
	if (!fs.existsSync(process.cwd() + '/updates')) {
		throw new Error("Keystone.applyUpdates() requires an updates folder to exist in the current working directory.");
	}
	
	var updates = fs.readdirSync(process.cwd() + '/updates').map(function(i) { return path.basename(i, '.js'); }).sort(function(a, b) {
		// exclude anything after a hyphen from the version number
		return semver.compare(a.split('-')[0], b.split('-')[0]);
	});
	
	async.forEachSeries(updates, applyUpdate, function() {
		if (updateCount) {
			console.log('Successfully applied ' + utils.plural(updateCount, '* update') + '.');
		}
		callback();
	});
}
