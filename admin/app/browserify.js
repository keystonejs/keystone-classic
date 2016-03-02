var babelify = require('babelify');
var browserify = require('browserify');
var chalk = require('chalk');
var crypto = require('crypto');
var moment = require('moment');
var packages = require('../packages');
var path = require('path');
var watchify = require('watchify');

var basedir = path.resolve(__dirname + '/../src/');
var devMode = process.env.KEYSTONE_DEV === 'true';

function ts() {
	return chalk.gray(moment().format('YYYY-MM-DD HH:MM:SS '));
}

function logInit(file) {
	console.log(chalk.grey('Watching ' + chalk.black.underline('keystone/admin/src/' + file) + ' for changes...'));
}

function logRebuild(file) {
	console.log(ts() + chalk.green('rebuilt ' + chalk.underline(file)));
}

function logError(file, err) {
	console.log(ts() + chalk.red('error building ' + chalk.underline(file) + ':') + '\n' + err.message);
}

module.exports = function(file, name) {
	var b;
	var building = false;
	var queue = [];
	var ready;
	var src;
	function build() {
		if (building) return;
		building = true;
		var opts = { basedir: basedir };
		if (devMode) {
			logInit(file);
			opts.cache = {};
			opts.packageCache = {};
		}
		if (name) {
			b = browserify(opts);
			b.require('./' + file, { expose: name });
		} else {
			b = browserify('./' + file, opts);
		}
		b.transform(babelify.configure({
			ignore: ['**/lib/**']
		}));
		b.exclude('FieldTypes');
		packages.forEach(function(i) {
			b.exclude(i);
		});
		if (devMode) {
			b = watchify(b);
		}
		b.bundle(function(err, buff) {
			if (err) return logError(file, err);
			src = buff;
			ready = true;
			queue.forEach(function(reqres) {
				send.apply(null, reqres);
			});
		});
		b.on('update', function() {
			b.bundle(function(err, buff) {
				if (err) return logError(file, err);
				else logRebuild(file);
				src = buff;
			});
		});
	}
	function serve(req, res) {
		if (!ready) {
			build();
			queue.push([req, res]);
			return;
		}
		send(req, res);
	}
	function send(req, res) {
		res.setHeader('Content-Type', 'application/javascript');
		var etag = crypto.createHash('md5').update(src).digest('hex').slice(0, 6);
		if (req.get && (etag === req.get('If-None-Match'))) {
			res.status(304);
			res.end();
		}
		else {
			res.setHeader('ETag', etag);
			res.setHeader('Vary', 'Accept-Encoding');
			res.send(src);
		}
	}
	return {
		serve: serve,
		build: build
	};
};
