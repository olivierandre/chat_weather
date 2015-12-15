var gulp = require('gulp'),
	sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	sourcemaps = require('gulp-sourcemaps'),
	gutil = require('gulp-util'),
	env = process.env.NODE_ENV || 'dev',
	config = require('../../config/config.json')[env],
	sassOptions = {
		errLogToConsole: true,
		outputStyle: 'compressed'
	};

module.exports = function() {
	return gulp.src(config.sass.inputCss)
		.pipe(sourcemaps.init())
		.pipe(sass(sassOptions).on('error', gutil.log))
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}).on('error', gutil.log))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(config.sass.outputCss));
};