var gulp = require('gulp'),
	cover = require('gulp-coverage'),
	jshint = require('gulp-jshint'),
	rimraf = require('gulp-rimraf'),
	mocha = require('gulp-mocha'),
	watch = require('gulp-watch'),
	chalk = require('chalk');

// Common project paths
var paths = {
	'src':['./index.js', './lib/**/*.js','./routes/**/*.js'],
	'tests':['./test/**/*.js']
};

// An error handler for the tests during gulp-watch
// Otherwise the gulp-watch will terminate
var handleError = function(err){
	console.log(chalk.red(err.name + ': ' + err.plugin + ' - ' + err.message));
	return;
};

/**
 * Gulp Tasks
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
