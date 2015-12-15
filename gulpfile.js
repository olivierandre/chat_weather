(function() {

	"use strict";

	var gulp = require('./gulp')(['browserify', 'sass', 'nodemon', 'bump', 'wiredep']),
		env = process.env.NODE_ENV || 'dev',
		config = require('./config/config.json')[env];

	gulp.task('default', ['sass']);

	gulp.task('server', ['sass', 'browserify', 'bump', 'nodemon', 'watch-public']);

	gulp.task('watch-public', function() {
		gulp.watch(config.js.inputJsWatch, ['browserify']);
		gulp.watch(config.sass.inputCss, ['sass']);
	});

	//gulp.task('prod', ['header', 'server', 'bump-prod']);

}());