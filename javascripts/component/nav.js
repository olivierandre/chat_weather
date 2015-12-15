var React = require('react'),
	ReactDOM = require('react-dom'),
	ReactBootstrap = require('react-bootstrap'),
	Navbar = ReactBootstrap.Navbar,
	NavBoot = ReactBootstrap.Nav,
	NavItem = ReactBootstrap.NavItem,
	Badge = ReactBootstrap.Badge,
	Button = ReactBootstrap.Button,
	socket = io.connect('http://172.20.1.87:1337'),
	NameAction = require('../action/NameAction'),
    NavStore = require('../store/NavStore'),
	Name = require('../component/Name');

var Nav = React.createClass({
	getInitialState: function() {
        return {
            usersConnected: 0,
			user: NavStore.getName(),
			render: false
        };
    },
	componentDidMount: function() {
        NavStore.addChangeListener(this._onChange);
    },
    componentWillUnmount: function() {
        NavStore.removeChangeListener(this._onChange);
    },
	_onChange: function() {
		setTimeout(function() {
			this.setState({
	    		user: NavStore.getName()
	  		});
		}.bind(this));
	},
	changeUser: function() {
		NameAction.saveUser('');
		ReactDOM.render(
		    <Name />, document.getElementById('name')
		);
	},
	render: function() {
		var usersConnected;
		socket.on('users', function(users) {
			this.setState({
				usersConnected: users,
				render: true
			});
		}.bind(this));
		return (
			<Navbar inverse>
				<Navbar.Header>
					<Navbar.Brand>
						<a href="#">Chat Weather </a>
					</Navbar.Brand>
				</Navbar.Header>
				<NavBoot pullRight>
			    	<NavItem>
						{
							this.state.user.length > 0 ?
							<span>Bonjour { this.state.user } | </span>
							: '' } Nombres d'utilisateurs connectés <Badge>{ this.state.usersConnected }</Badge>

					</NavItem>
					<NavItem>
						{
							this.state.user.length > 0 ? <Button bsStyle="danger" onClick={ this.changeUser }>Change user</Button> : ''
						}
					</NavItem>
			     </NavBoot>
			</Navbar>
		);
	}
});


module.exports = Nav;
