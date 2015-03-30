var _ = require('underscore'),
	gulp = require('gulp'),
	gutil = require('gulp-util'),
	watch = require('gulp-watch'),
	browserify = require('browserify'),
	shimify = require('browserify-shim'),
	uglify = require('gulp-uglify'),
	watchify = require('watchify'),
	reactify = require('reactify'),
	source = require('vinyl-source-stream'),
	chalk = require('chalk'),
	del = require('del'),
	streamify = require('gulp-streamify');

/**
 * Build Tasks
 */

// build scripts with browserify and react / jsx transforms
gulp.task('build-scripts', function() {
	return browserify({
			standalone: 'App'
		})
		.add('./admin/src/app.js')
		.transform(reactify)
		.transform(shimify)
		.bundle()
		.on('error', function(e) {
			gutil.log('Browserify Error', e);
		})
		.pipe(source('app.js'))
		.pipe(streamify(uglify()))
		.pipe(gulp.dest('./public/build/js'));
});

// watch scripts & build with debug features
gulp.task('watch-scripts', function() {

	var b = browserify(_.defaults({
			standalone: 'App',
			debug: true
		}, watchify.args))
		.add('./admin/src/app.js')
		.transform(reactify)
		.transform(shimify);
	
	var w = watchify(b)
		.on('update', function (scriptIds) {
			scriptIds = scriptIds
				.filter(function(i) { return i.substr(0,2) !== './'; })
				.map(function(i) { return chalk.blue(i.replace(__dirname, '')); });
			if (scriptIds.length > 1) {
				gutil.log(scriptIds.length + ' Scripts updated:\n* ' + scriptIds.join('\n* ') + '\nrebuilding...');
			} else {
				gutil.log(scriptIds[0] + ' updated, rebuilding...');
			}
			rebundle();
		})
		.on('time', function (time) {
			gutil.log(chalk.green('Scripts built in ' + (Math.round(time / 10) / 100) + 's'));
		});
	
	function rebundle() {
		w.bundle()
			.on('error', function(e) {
				gutil.log('Browserify Error', e);
			})
			.pipe(source('app.js'))
			.pipe(gulp.dest('./public/build/js'));
	}
	
	return rebundle();
	
});
