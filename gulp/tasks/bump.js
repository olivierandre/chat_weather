var gulp = require('gulp'),
	bump = require('gulp-bump');

module.exports = function() {
	gulp.src('./package.json')
		.pipe(bump({
			type: 'patch',
		}))
		.pipe(gulp.dest('./'));
};