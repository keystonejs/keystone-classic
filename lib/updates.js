var _ = require('lodash');
var async = require('async');
var fs = require('fs');
var keystone = require('../');
var mongoose = keystone.mongoose;
var path = require('path');
var semver = require('semver');
var utils = require('keystone-utils');

var _dashes_ = '------------------------------------------------';

// Update Schema - automatically created and managed by Keystone when updates are used
var UpdateModel = new mongoose.Schema({
	key: { type: String, index: true },
	appliedOn: { type: Date, default: Date.now },
}, {
	collection: keystone.prefixModel('App_Update'),
});
mongoose.model('App_Update', UpdateModel);

// Apply method - loads the available updates and applies any that haven't been, in order
exports.apply = function (callback) {

	var Update = mongoose.model('App_Update');
	var updateCount = 0;
	var deferCount = 0;
	var skipCount = 0;

	var updatesPath = keystone.getPath('updates', 'updates');

	// logError is used to log errors before the process exits since it is more synchronous than console.error.  Using
	// console.error gets into race condition issues with process.exit, which has higher priority.
	var logError = function () {
		for (var i = 0, len = arguments.length; i < len; ++i) {
			process.stderr.write(arguments[i] + '\n');
		}
	};

	var applyUpdate = function (file, done) {
		Update.findOne({ key: file }, function (err, updateRecord) {
			if (err) {
				console.error('Error searching database for update ' + file + ':');
				console.dir(err);
				done(err);
			} else if (!updateRecord) {
				var update = require(path.join(updatesPath, file));
				// skip updates that export a falsy value
				if (!update) {
					skipCount++;
					return done();
				}
				// auto-wrap create scripts for a friendlier shorthand syntax
				if (_.isObject(update.create)) {
					var items = update.create;
					var ops = update.options || {};
					var background_mode = update.__background__ ? ' (background mode) ' : '';

					update = function (done) {
						keystone.createItems(items, ops, function (err, stats) {
							if (!err) {
								var statsMsg = stats ? stats.message : '';

								console.log('\n' + _dashes_,
									'\n' + keystone.get('name') + ': Successfully applied update ' + file + background_mode + '.',
									'\n' + statsMsg,
									'\n');
								done(null);
							}
							else {
								logError('\n' + _dashes_,
									'\n' + keystone.get('name') + ': Update ' + file + background_mode + ' failed with errors:',
									'\n' + err,
									'\n');

								// give the logging some time to finish
								process.nextTick(function () {
									done(err);
								});
							}
						});
					};
				}
				// ensure type
				if (typeof update !== 'function') {
					console.log('\nError in update file ./updates/' + file + '.js\nUpdate files must export a function\n');
					process.exit();
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
				if (update.__background__) {
					updateCount++;
					update(function (err) {
						if (!err) {
							if (update.__commit__ !== false) {
								new Update({ key: file }).save();
							}
						} else {
							done(err);
						}
					});
					done();
				} else {
					update(function (err) {
						if (!err) {
							updateCount++;
							if (update.__commit__ === false) {
								done();
							} else {
								new Update({ key: file }).save(done);
							}
						} else {
							done(err);
						}
					});
				}
			} else {
				done();
			}
		});
	};

	if (!fs.existsSync(updatesPath)) {
		console.log('\nKeystoneJS Update Error:\n\n'
			+ 'An updates folder must exist in your project root to use automatic updates.\n'
			+ 'If you want to use a custom path for your updates, set the `updates` option.\n'
			+ 'If you don\'t want to use updates, set the `auto update` option to `false`.\n'
			+ 'See http://keystonejs.com/docs/configuration/#updates for more information.\n');
		process.exit();
	}

	var updates = fs.readdirSync(updatesPath)
		.map(function (i) {
			// exclude non-javascript or coffee files in the updates folder
			return (path.extname(i) !== '.js' && path.extname(i) !== '.coffee') ? false : path.basename(i, '.js');
		}).filter(function (i) {
			// exclude falsy values and filenames that without a valid semver
			return i && semver.valid(i.split('-')[0]);
		}).sort(function (a, b) {
			// exclude anything after a hyphen from the version number
			return semver.compare(a.split('-')[0], b.split('-')[0]);
		});

	async.eachSeries(updates, applyUpdate, function (err) {
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
			var errmsg = 'An error occurred applying updates, bailing on Keystone init.\n\nError details:';
			if (!(updateCount || deferCount || skipCount)) {
				errmsg = _dashes_ + '\n' + errmsg;
			}
			logError(errmsg);
			logError(err);
			// wait till nextTick to exit so the trace completes.
			process.nextTick(function () {
				process.exit(1);
			});
			return;
		}
		callback && callback();// eslint-disable-line no-unused-expressions
	});
};
