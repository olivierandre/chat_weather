var React = require('react'),
	ReactDOM = require('react-dom'),
	Nav = require('./component/nav'),
	Name = require('./component/name'),
	socket = io.connect('http://172.20.1.87:1337');

window.addEventListener('beforeunload', function() {
	socket.emit('closeWindow');
});

socket.on('isConnected', function() {
	socket.emit('connected');
});

ReactDOM.render(
	<Nav /> ,document.getElementById('navbar'));

ReactDOM.render(
    <Name />, document.getElementById('name')
);
