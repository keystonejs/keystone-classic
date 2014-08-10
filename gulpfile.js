var _ = require('underscore'),
	gulp = require('gulp'),
	cover = require('gulp-coverage'),
	jshint = require('gulp-jshint'),
	rimraf = require('gulp-rimraf'),
	mocha = require('gulp-mocha'),
	gutil = require('gulp-util'),
	watch = require('gulp-watch'),
	browserify = require('browserify'),
	watchify = require('watchify'),
	reactify = require('reactify'),
	source = require('vinyl-source-stream'),
	chalk = require('chalk');

// Common project paths
var paths = {
	'src': ['./index.js', './lib/**/*.js','./routes/**/*.js'],
	'tests': ['./test/**/*.js']
};

// An error handler for the tests during gulp-watch
// Otherwise the gulp-watch will terminate
var handleError = function(err) {
	console.log(chalk.red(err.name + ': ' + err.plugin + ' - ' + err.message));
	return;
};

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
		.bundle()
		.on('error', function(e) {
			gutil.log('Browserify Error', e);
		})
		.pipe(source('app.js'))
		.pipe(gulp.dest('./public/build/js'));
});

// watch scripts & build with debug features
gulp.task('watch-scripts', function() {
	
	var b = browserify(_.defaults({
			standalone: 'App'
		}, watchify.args))
		.add('./admin/src/app.js')
		.transform(reactify);
	
	var w = watchify(b)
		.on('update', function (scriptIds) {
			scriptIds = scriptIds
				.filter(function(i) { return i.substr(0,2) !== './' })
				.map(function(i) { return chalk.blue(i.replace(__dirname, '')) });
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
 * Testing & Linting Tasks
 */

// lint source with jshint
gulp.task('lint', function(){
	return gulp.src(paths.src)
		.pipe(jshint())
		.pipe(jshint.reporter('default'));

});

// run the mocha tests with the default dot reporter
gulp.task('test', function(){
	return gulp.src(paths.tests)
		.pipe(mocha({
			reporter: 'dot'
		}))
		.on('error', handleError);

});

// run the mocha tests with the spec reporter
gulp.task('spec', function(){
	return gulp.src(paths.tests)
		.pipe(mocha({
			reporter: 'spec'
		}))
		.on('error', handleError);
});

// generate a coverage report
gulp.task('coverage', function(){
	return gulp.src(paths.tests)
		.pipe(cover.instrument({
			pattern: paths.src,
			debugDirectory: '.coverdebug'
		}))
		.pipe(mocha({
			reporter: 'spec'
		}))
		.pipe(cover.report({
			outFile: 'coverage.html'
		}))
		.on('error', handleError);
});

// delete the coverage report
gulp.task('clean-coverage', function(){
	return gulp.src(['.coverdebug', '.coverdata', '.coverrun', 'coverage.html'], { read: false })
		.pipe(rimraf())
});


/*
 * auto/watch gulp tasks that will trigger the tests on
 * file changes
 */

gulp.task('autotest', function(){
	gulp.watch(paths.src.concat(paths.tests), ['test']);
});
