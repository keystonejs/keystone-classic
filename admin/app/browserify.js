var babelify = require('babelify');
var browserify = require('browserify');
var chalk = require('chalk');
var crypto = require('crypto');
var moment = require('moment');
var packages = require('../packages');
var path = require('path');
var stream = require('stream');
var watchify = require('watchify');

var basedir = path.resolve(__dirname + '/../src/');
var devMode = process.env.KEYSTONE_DEV === 'true';

function ts() {
	return chalk.gray(moment().format('YYYY-MM-DD HH:MM '));
}

function logError(file, err) {
	console.log(ts() + chalk.red('error building ' + chalk.underline(file) + ':') + '\n' + err.message);
}

function logRebuild(file) {
	console.log(ts() + chalk.green('rebuilt ' + chalk.underline(file)));
}

module.exports = function(file, name) {

	var queue = [];
	var ready;
	var src;
	function build() {
		var opts = { basedir: basedir };
		if (name) {
			opts.standalone = name;
		}
		if (devMode) {
			console.log(chalk.grey('Watching ' + chalk.black.underline(file) + ' for changes...'));
			opts.cache = {};
			opts.packageCache = {};
		}
		var b = browserify(file, opts);
		b.transform(babelify.configure({
			ignore: ['**/lib/**'],
			plugins: [require('babel-plugin-object-assign')]
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
			queue.forEach(function(i) {
				send.apply(null, i);
			});
		});
		b.on('update', function (ids) {
			b.bundle(function(err, buff) {
				if (err) return logError(file, err);
				else logRebuild(file);
				src = buff;
			});
		});
	}
	function serve(req, res, next) {
		if (!ready) {
			build();
			queue.push([req, res, next]);
			return;
		}
		send(req, res, next);
	}
	function send(req, res, next) {
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
}
