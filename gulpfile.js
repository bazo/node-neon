'use strict';
var gulp = require('gulp');
var typescript = require('gulp-tsc');
var mocha = require('gulp-mocha');
var growl = require('gulp-notify-growl');

var notify = growl();

var paths = {
	typescript: ['src/**/*.ts'],
	test: ['test/**/*.js'],
	dest: 'lib'
};

function compile() {
	gulp.src(paths.typescript)
		.pipe(typescript({sourcemap: true, emitError: false}))
		.pipe(gulp.dest(paths.dest))
		.on("error", notify.onError({
			message: "Error: <%= error.message %>",
			title: "Error compiling typescript"
		}));
}

function test(){
	gulp.src(paths.test)
		.pipe(mocha({reporter: 'spec'}))
		.on("error", notify.onError({
			message: "Error: <%= error.message %>",
			title: "Error running tests"
		}));
}

gulp.task('compile', function() {
	compile();
});

gulp.task('test', function () {
	test();
});

gulp.task('compileAndTest', function() {
	compile();
	test();
});

// Rerun the task when a file changes
gulp.task('watch', function() {
	gulp.watch(paths.typescript, ['compileAndTest']);
	gulp.watch(paths.test, ['test']);
});

gulp.task('default', ['compileAndTest', 'watch']);
