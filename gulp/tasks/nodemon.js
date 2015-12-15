var gulp = require('gulp'),
	nodemon = require('gulp-nodemon');

module.exports = function() {
	nodemon({
		script: 'server.js',
		ext: 'js html',
		ignore: ['./public']
	}).on('start', ['watch-public']);
};