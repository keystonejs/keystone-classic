var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var streamify = require('gulp-streamify');
var uglify = require('gulp-uglify');

/**
 * Build Tasks
 */

gulp.task('build-packages', function () {
	var packages = require('./admin/client/packages');
	var b = browserify();
	packages.forEach(function (i) { b.require(i); });
	b = b.bundle().pipe(source('packages.js'));
	if (process.env.NODE_ENV === 'production') {
		b.pipe(streamify(uglify()));
	}
	return b.pipe(gulp.dest('./admin/public/js'));
});
