var _ = require('underscore');
var browserify = require('browserify');
var chalk = require('chalk');
var del = require('del');
var git = require('gulp-git');
var gulp = require('gulp');
var gutil = require('gulp-util');
var reactify = require('reactify');
var shimify = require('browserify-shim');
var source = require('vinyl-source-stream');
var streamify = require('gulp-streamify');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');
var watchify = require('watchify');

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

