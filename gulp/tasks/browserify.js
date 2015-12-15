var gulp = require('gulp'),
	browserify = require('browserify'),
	source = require('vinyl-source-stream'),
	env = process.env.NODE_ENV || 'dev',
	config = require('../../config/config.json')[env],
	reactify = require('reactify');

module.exports = function() {
	var bundler = browserify(config.js.inputJs + 'main.js', {});
	bundler.transform(reactify, {
		"es6": true
	});
	return bundler.bundle()
		.pipe(source('bundle.js'))
		.pipe(gulp.dest(config.js.outputJs));
};