var browserify = require('browserify');

function bundlePackages () {
	var packages = require('./admin/client/packages');
	var b = browserify();
	packages.forEach(function (i) { b.require(i); });
	b.bundle().pipe(process.stdout);
}

bundlePackages();
