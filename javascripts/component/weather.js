var React = require('react'),
    ReactDOM = require('react-dom'),
    socket = io.connect('http://172.20.1.87:1337'),
    ReactBootstrap = require('react-bootstrap'),
    Button = ReactBootstrap.Button,
    Alert = ReactBootstrap.Alert,
    Fade = ReactBootstrap.Fade,
    Col = ReactBootstrap.Col,
    Label = ReactBootstrap.Label,
    Badge = ReactBootstrap.Badge,
    ListGroup = ReactBootstrap.ListGroup,
    ListGroupItem = ReactBootstrap.ListGroupItem,
    Panel = ReactBootstrap.Panel,
    Tooltip = ReactBootstrap.Tooltip,
    OverlayTrigger = ReactBootstrap.OverlayTrigger,
    ReactCSSTransitionGroup = require('react-addons-css-transition-group'),
    WeatherAction = require('../action/WeatherAction'),
    NameStore = require('../store/NameStore'),
    WeatherStore = require('../store/WeatherStore');

var Weather = React.createClass({
    render: function() {
        return (
            <div className="weather row">
                {/* <IncrementBox count={ this.props.count }></IncrementBox> */}
                <WeatherBox url="http://api.openweathermap.org/data/2.5/weather?"/>
            </div>
        );
    }
});

var IncrementBox = React.createClass({
    getInitialState: function() {
        return {
            count: null
        };
    },
    increment: function() {
        this.setState({
            count: parseInt(this.state.count += 1)}
        );
    },
    componentDidMount: function() {
        this.setState({
            count: parseInt(this.props.count)}
        );
    },
    render: function() {
        return (
            <div className="incrementBox">{this.state.count}
                <div className="col-xs-12 col-sm-6 col-sm-offset-3">
                    <Button bsStyle="primary" bsSize="small" onClick={this.increment}>+1</Button>
                </div>
            </div>
        );
    }
});

var WeatherBox = React.createClass({
    getInitialState: function() {
        return {
            data: WeatherStore.getData(),
            url: '',
            getWeather: false,
            city: '',
            apiId: '&appid=2de143494c0b295cca9337e1e96b00e0',
            wrongTown: '',
            showAlert: false,
            alertMessage: '',
            disabledButton: false,
            style: {
                marginLeft: 20
            },
            towns: [],
            show: NameStore.getName().length > 0,
            src: ''
        };
    },
    componentDidMount: function() {
        this.setState({
            url: this.props.url
        });
        WeatherStore.addChangeListener(this._onChange);
        WeatherStore.addHideListener(this._onHide);
        socket.on('town', function(towns) {
            this.setState({
                towns: towns
            });
        }.bind(this));
    },
    componentWillUnmount: function() {
        WeatherStore.removeChangeListener(this._onChange);
        WeatherStore.removeHideListener(this._onHide);
    },

    getCity: function(e) {
        this.setState({
            city: e.target.value,
            getWeather: false
        });
    },
    getWeather: function(e) {
        e.preventDefault();
        this.setState({
            disabledButton: true
        });
        WeatherAction.searchTown(this.state.city, this.state.url, this.state.apiId);
    },
    resetCity: function() {
        this.setState({
            city: '',
            getWeather: false
        });
    },
    resetTab: function() {
        socket.emit('resetAll');
    },
    handleAlertDismiss: function() {
        this.setState({
            showAlert: false, alertMessage: ''
        });
    },
    render: function() {
        var labelStyle = {
            marginTop: 20
        };
        var badgeLabel = {
            backgroundColor: 'rgb(209, 164, 205)'
        };
        var divStyle = {
            display: this.state.show ? 'block' : 'none'
        };

        var badge = <Badge style={ badgeLabel }>{ this.state.towns.length }</Badge>;
        var title = 'Historique de tous les utilisateurs - ' + this.state.towns.length;
        var tooltipReset = <Tooltip id="tooltipReset">Uniquement pour l'input...</Tooltip>;
        var tooltipDanger = <Tooltip id="tooltipDanger">Autoriser à vider l'historique à partir de 5 lignes</Tooltip>;

        return (
            <div style={ divStyle } className="weather">
                {
                    this.state.showAlert ?
                    <Alert bsStyle="warning" onDismiss={this.handleAlertDismiss} dismissAfter={2000}>{this.state.alertMessage}</Alert>
                    :
                    ''
                }
                <form onSubmit={ this.getWeather }>
                    <Col className="form-group" xs={12} sm={6}>
                        <label>Choix de la ville</label>
                        <input className="form-control" type="text" value={this.state.city} onChange={this.getCity}/>
                        <div style={ labelStyle }>
                            <Button type="submit" bsStyle="success" disabled={ this.state.disabledButton || this.state.city.length === 0 }>Get Weather</Button>
                            <OverlayTrigger placement="top" overlay={ tooltipReset }>
                                <Button bsStyle="warning" style={ this.state.style } disabled={ this.state.disabledButton } onClick={ this.resetCity }>Reset</Button>
                            </OverlayTrigger>
                            <OverlayTrigger placement="top" overlay={ tooltipDanger }>
                                <Button bsStyle="danger" style={ this.state.style } disabled={ this.state.towns.length < 5 } onClick={ this.resetTab }>Vider l'historique :-o</Button>
                            </OverlayTrigger>

                        </div>
                    </Col>
                </form>
                <Col xs={12} sm={6}>
                    {
                        this.state.getWeather ?
                            <ReactCSSTransitionGroup transitionName="example" transitionEnterTimeout={1500} transitionLeaveTimeout={300}>
                                <div>
                                    {this.state.city}<img src={ this.state.src }/>
                                </div>
                            </ReactCSSTransitionGroup>
                        :
                        <ReactCSSTransitionGroup transitionName="example" transitionEnterTimeout={1500} transitionLeaveTimeout={300}>
                            {this.state.wrongTown}
                        </ReactCSSTransitionGroup>
                    }
                </Col>

                <Col xs={12} style={ labelStyle }>
                    <Panel collapsible defaultExpanded={true} header={ title }>
                        <ListGroup style={ labelStyle }>
                            {
                                this.state.towns.map(function(town) {
                                    return <TownItemWrapper key={ town.id } data={ town } />;
                                })
                        }
                        </ListGroup>
                    </Panel>
                </Col>

            </div>
        );
    },
    _onChange: function() {
        if(WeatherStore.isFail()) {
            this.setState({
                disabledButton: false,
                alertMessage: WeatherStore.getMessageFail(),
                showAlert: true
            });
        } else {
            this.setState({
                data: WeatherStore.getData(),
                getWeather: true,
                city: WeatherStore.getCity(),
                showAlert: false,
                disabledButton: false,
                src: WeatherStore.getSrc(),

            });

            socket.emit('town', {
                city: this.state.city,
                weather: this.state.data,
                name: NameStore.getName()
            });
        }
    },
    _onHide: function() {
        this.setState({
            show: NameStore.getName().length > 0,
            city: '',
            data: [],
            src: ''
        });
    }
});

var TownItemWrapper = React.createClass({
  render: function() {
      var href = 'http://openweathermap.org/img/w/' + this.props.data.weather.weather[0].icon + '.png';
      var img = <img src={href} />;
    return <ListGroupItem>{ this.props.data.town } | IP { this.props.data.address } | By { this.props.data.name } | { img }</ListGroupItem>;
  }
});

module.exports = Weather;
