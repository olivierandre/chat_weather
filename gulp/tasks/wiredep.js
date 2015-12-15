var gulp = require('gulp'),
	wiredep = require('wiredep').stream;

module.exports = function() {
	return gulp.src('./public/index.html')
		.pipe(wiredep({
			optional: 'configuration',
			goes: 'here'
		}))
		.pipe(gulp.dest('./public'));
};