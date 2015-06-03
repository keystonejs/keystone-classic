var browserify = require('browserify');
var git = require('gulp-git');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var streamify = require('gulp-streamify');
var uglify = require('gulp-uglify');

/**
 * Build Tasks
 */

gulp.task('build-packages', function() {
	var packages = require('./admin/packages');
	var b = browserify();
	packages.forEach(function(i) { b.require(i); });
	b = b.bundle().pipe(source('packages.js'));
	if (process.env.NODE_ENV === 'production') {
		b.pipe(streamify(uglify()));
	}
	return b.pipe(gulp.dest('./admin/public/js'));
});

/**
 * Release Tasks
 */

gulp.task('publish:tag', function(done) {
	var pkg = JSON.parse(require('fs').readFileSync('./package.json'));
	var v = 'v' + pkg.version;
	var message = 'Release ' + v;

	git.tag(v, message, function (err) {
		if (err) throw err;
		git.push('origin', v, function (err) {
			if (err) throw err;
			done();
		});
	});
});

gulp.task('publish:npm', function(done) {
	require('child_process')
		.spawn('npm', ['publish'], { stdio: 'inherit' })
		.on('close', done);
});

gulp.task('release', ['publish:tag', 'publish:npm']);

