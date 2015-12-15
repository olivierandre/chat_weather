var React = require('react'),
	ReactDOM = require('react-dom'),
	ReactBootstrap = require('react-bootstrap'),
	Input = ReactBootstrap.Input,
	Button = ReactBootstrap.Button,
	NameAction = require('../action/NameAction'),
	NameStore = require('../store/NameStore'),
	Weather = require('../component/weather');

var Name = React.createClass({
	getInitialState: function() {
		var nameUser = localStorage.getItem('user') === null ? '' : localStorage.getItem('user');
		NameAction.getUserOnLoad(nameUser);

		return {
			disabledButton: false,
			nameUser: nameUser,
			showForm: !nameUser ? true : false
		};
	},
	componentDidMount: function() {
		NameStore.addChangeListener(this._onChange);
	},
	componentWillUnmount: function() {
		NameStore.removeChangeListener(this._onChange);
	},
	getName: function(e) {
		this.setState({
			nameUser: e.target.value
		});
	},
	saveUser: function() {
		NameAction.saveUser(this.state.nameUser);
		var name = document.getElementById('name');
		ReactDOM.unmountComponentAtNode(name);
	},
	_onChange: function() {
		this.setState({
			nameUser: localStorage.getItem('user')
		});
		if (this.state.nameUser.length > 0) {
			ReactDOM.render(<Weather count="0" /> , document.getElementById('weather'));
		} else {
			this.setState({
				showForm: true
			});
		}

	},
	render: function() {
		return ( < div > {
			this.state.showForm ?
				< form >
				< Input label = "Votre prénom"
			className = "form-control"
			type = "text"
			value = {
				this.state.nameUser
			}
			onChange = {
				this.getName
			}
			/> < Button bsStyle = "success"
			disabled = {
				this.state.disabledButton || this.state.nameUser.length === 0
			}
			onClick = {
					this.saveUser
				} > OK < /Button> < /form>:
				''
		} < /div>);
	}
});

module.exports = Name;
