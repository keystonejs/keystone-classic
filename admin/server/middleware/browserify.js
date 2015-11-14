var babelify = require('babelify');
var browserify = require('browserify');
var chalk = require('chalk');
var crypto = require('crypto');
var fs = require('fs-extra');
var moment = require('moment');
var packages = require('../../client/packages');
var path = require('path');
var watchify = require('watchify');

var basedir = path.resolve(__dirname + '/../../client/');
var devMode = process.env.KEYSTONE_DEV === 'true';
var devWriteBundles = process.env.KEYSTONE_WRITE_BUNDLES === 'true';
var devWriteDisc = process.env.KEYSTONE_WRITE_DISC === 'true';

function ts() {
	return chalk.gray(moment().format('YYYY-MM-DD HH:MM:SS '));
}

function logInit(file) {
	console.log(chalk.grey('Watching ') + chalk.underline('keystone/admin/src/' + file) + chalk.grey(' for changes...'));
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
	function writeBundle(buff) {
		if (devWriteBundles) {
			fs.outputFile(path.resolve(path.join(__dirname, '../../bundles/js', file)), buff, 'utf8');
		}
		if (devWriteDisc) {
			var discFile = file.replace('.js', '.html');
			require('disc').bundle(buff, function(err, html) {
				if (err) {
					logError(discFile, err);
				} else {
					fs.outputFile(path.resolve(path.join(__dirname, '../../bundles/disc', discFile)), html, 'utf8');
					console.log(ts() + chalk.green('wrote disc for ' + chalk.underline(file)));
				}
			});
		}
	}
	function build() {
		if (building) return;
		building = true;
		var opts = { basedir: basedir };
		if (devMode) {
			logInit(file);
			opts.debug = true;
			opts.cache = {};
			opts.packageCache = {};
			opts.fullPaths = true;
		}
		if (name) {
			b = browserify(opts);
			b.require('./' + file, { expose: name });
		} else {
			b = browserify('./' + file, opts);
		}
		b.transform(babelify.configure({
			plugins: [require('babel-plugin-transform-object-rest-spread'), require('babel-plugin-transform-object-assign')],
			presets: [require('babel-preset-es2015'), require('babel-preset-react')],
		}));
		b.exclude('FieldTypes');
		packages.forEach(function(i) {
			b.exclude(i);
		});
		if (devMode) {
			b = watchify(b, { poll: 500 });
		}
		b.bundle(function(err, buff) {
			if (err) return logError(file, err);
			src = buff;
			ready = true;
			queue.forEach(function(reqres) {
				send.apply(null, reqres);
			});
			writeBundle(buff);
		});
		b.on('update', function() {
			b.bundle(function(err, buff) {
				if (err) return logError(file, err);
				else logRebuild(file);
				src = buff;
				writeBundle(buff);
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
