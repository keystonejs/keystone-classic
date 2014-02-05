var _ = require('underscore'),
	fs = require('fs'),
	path = require('path'),
	async = require('async'),
	semver = require('semver'),
	keystone = require('../'),
	mongoose = keystone.mongoose,
	utils = require('keystone-utils');

var _dashes_ = '------------------------------------------------';

// Update Schema - defined here rather than in main models for portability
var UpdateModel = new mongoose.Schema({
	key: { type: String, index: true },
	appliedOn: { type: Date, default: Date.now }
});
mongoose.model('App_Update', UpdateModel);

// Apply method - loads the available updates and applies any that haven't been, in order
exports.apply = function(callback) {
	
	var Update = mongoose.model('App_Update');
		updateCount = 0,
		deferCount = 0,
		skipCount = 0;
	
	var applyUpdate = function(file, done) {
		Update.findOne({ key: file }, function(err, updateRecord) {
			if (err) {
				console.error('Error searching database for update ' + file + ':');
				console.dir(err);
				done(err);
			} else if (!updateRecord) {
				var update = require(process.cwd() + '/updates/' + file);
				// skip updates that export null
				if (!update) {
					skipCount++;
					return done();
				}
				// if an update is deferred, don't process it
				if (update.__defer__) {
					deferCount++;
					return done();
				}
				// if there are deferred updates, don't process any subsequent ones
				if (deferCount) {
					skipCount++;
					return done();
				}
				console.log(_dashes_ + '\nApplying update ' + file + '...');
				// ensure type
				if ('function' != typeof update) {
					throw new Error("Update files must export a single function.")
				}
				if (update.__background__) {
					updateCount++;
					update(function(err) {
						if (err) {
							console.log(_dashes_ + '\nUpdate ' + file + ' (background mode) failed with error:');
							console.log(err);
						} else {
							console.log(_dashes_ + '\nSuccessfully applied update ' + file + ' (in background).');
							new Update({key: file}).save();
						}
					});
					done();
				} else {
					update(function(err) {
						if (err) {
							console.log(_dashes_ + '\nUpdate ' + file + 'failed with error:');
							console.log(err);
							return done(err);
						} else {
							updateCount++;
							console.log(_dashes_ + '\nSuccessfully applied update ' + file + '.');
							return new Update({key: file}).save(done);
						}
					});
				}
			} else {
				done();
			}
		});
	};
	
	if (!fs.existsSync(process.cwd() + '/updates')) {
		throw new Error("KeystoneJS Update Error:\n\nAn ./updates folder must exist in your project root to use updates.\n\n");
	}
	
	var updates = fs.readdirSync(process.cwd() + '/updates').map(function(i) { return path.basename(i, '.js'); }).sort(function(a, b) {
		// exclude anything after a hyphen from the version number
		return semver.compare(a.split('-')[0], b.split('-')[0]);
	});
	
	async.eachSeries(updates, applyUpdate, function(err) {
		if (updateCount || deferCount || skipCount) {
			var status = '';
			if (updateCount) {
				status += 'Successfully applied ' + utils.plural(updateCount, '* update');
				if (skipCount || deferCount) {
					status += ', ';
				}
			}
			if (deferCount) {
				status += 'Deferred ' + utils.plural(deferCount, '* update');
				if (skipCount) {
					status += ', ';
				}
			}
			if (skipCount) {
				status += 'Skipped ' + utils.plural(skipCount, '* update');
			}
			status += '.';
			console.log(_dashes_ + '\n' + status + '\n' + _dashes_);
		}
		if (err) {
			var errmsg = 'An error occurred applying updates, bailing on Keystone init.';
			if (!(updateCount || deferCount || skipCount)) {
				errmsg = _dashes_ + '\n' + errmsg;
			}
			console.log(errmsg);
			process.exit();
		}
		callback();
	});
}
