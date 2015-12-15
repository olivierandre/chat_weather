module.exports = function(router) {

	router.get('/toto', function(req, res) {
		console.log(req.headers['x-forwarded-for'] || req.connection.remoteAddress);
		res.json({
			message: 'yo',
			name: 'Olivier'
		});
	});

};