(function() {
	'use strict';

	// set up ========================
	var express = require('express');
	var app = express();
	var mongoose = require('mongoose');
	var morgan = require('morgan');
	var bodyParser = require('body-parser');
	var methodOverride = require('method-override');
	var router = express.Router();
	var server = require('http').createServer(app);
	var browserSync = require('browser-sync');
	var io = require('socket.io')(server);
	var towns = [];
	var users = [];

	// configuration =================
	var port = process.env.PORT || 3000;

	app.use(express.static(__dirname + '/public'));
	app.use(morgan(process.env.NODE_ENV));
	app.use(bodyParser.urlencoded({
		'extended': 'true'
	}));
	app.use(bodyParser.json());
	app.use(bodyParser.json({
		type: 'application/vnd.api+json'
	}));
	app.use(methodOverride('X-HTTP-Method-Override'));

	// all of our routes will be prefixed with /api
	app.use('/api', router);
	app.use('/api/secure', router);

	// routes ======================================================================
	require('./server/index.js')(app);
	require('./server/web/demo.js')(router);

	// REGISTER OUR ROUTES -------------------------------

	// listen (start app with node server.js) ======================================
	server.listen(port, listening);
	console.log("App listening on port " + port);

	function listening() {
		browserSync({
			proxy: 'localhost:' + port,
			files: ['public/**/*.{html,js,css}']
		});
	}

	function addUsers(ip) {
		var index = users.indexOf(ip);
		if (index === -1) {
			users.push(ip);
		}
	}

	function removeUsers(ip) {
		var index = users.indexOf(ip);
		users.splice(index, 1);
	}

	io.on('connection', function(socket) {
		var ip = socket.handshake.address;
		addUsers(ip);
		io.emit('users', users.length);
		io.emit('town', towns);
		socket.on('town', function(town) {
			var address = ip;
			towns.push({
				id: towns.length + 1,
				town: town.city,
				address: address,
				weather: town.weather,
				name: town.name
			});
			io.emit('town', towns);
		});
		socket.on('message', function(data) {
			io.emit('message', data);
		});
		socket.on('closeWindow', function() {
			removeUsers(ip);
			io.emit('isConnected');
			io.emit('users', users.length);
		});
		socket.on('connected', function() {
			addUsers(ip);
			io.emit('users', users.length);
		});
		socket.on('resetAll', function() {
			towns = [];
			io.emit('town', towns);
		});
	});
}());