//var AppDispatcher = require('../dispatchers/AppDispatcher');
var EventEmitter = require('events').EventEmitter,
	assign = require('object-assign'),
	WeatherDispatcher = require('../dispatcher/WeatherDispatcher');

var CHANGE_EVENT = 'change',
	HIDE_EVENT = 'hide';
var _data = [],
	_url = '',
	_city = '',
	_fail = false,
	_failMessage = '',
	_src;

var WeatherStore = assign({}, EventEmitter.prototype, {
	getData: function() {
		return _data;
	},
	setSrc: function(icon) {
		var src = 'http://openweathermap.org/img/w/';
		_src = src + icon + '.png';
	},
	getSrc: function() {
		return _src;
	},
	getWeather: function() {
		return new Promise(function(resolve, reject) {
			var httpRequest = new XMLHttpRequest();
			httpRequest.overrideMimeType("application/json");
			httpRequest.onreadystatechange = function() {
				if ((httpRequest.readyState === 4) && (httpRequest.status === 200)) {
					_data = JSON.parse(httpRequest.responseText);
					resolve(_data.weather[0].icon);
				} else if ((httpRequest.readyState === 4) && (httpRequest.status === 404)) {
					reject('Erreur de communication');
				}
			};
			httpRequest.open('GET', _url, true);
			httpRequest.send(null);
		});
	},

	getCity: function() {
		return _city;
	},

	isExist: function(city, url, apiId) {
		var promise = new Promise(function(resolve, reject) {
			new google.maps.Geocoder().geocode({
				'address': city
			}, function(results, status) {
				if (status === google.maps.GeocoderStatus.OK) {
					var lat = results[0].geometry.location.lat();
					var lng = results[0].geometry.location.lng();
					_url = url + 'lat=' + lat + '&lon=' + lng + apiId;
					_city = results[0].formatted_address;
					resolve('OK');
				} else {
					reject('Ville inconnue');
				}
			});
		});

		return promise;
	},

	isFail: function() {
		return _fail;
	},
	hasFail: function(value) {
		_fail = value;
	},
	getMessageFail: function() {
		return _failMessage;
	},
	setMessageFail: function(message) {
		_failMessage = message;
	},
	emitChange: function() {
		this.emit(CHANGE_EVENT);
	},
	/**
	 * @param {function} callback
	 */
	addChangeListener: function(callback) {
		this.on(CHANGE_EVENT, callback);
	},
	/**
	 * @param {function} callback
	 */
	removeChangeListener: function(callback) {
		this.removeListener(CHANGE_EVENT, callback);
	},
	emitHide: function() {
		this.emit(HIDE_EVENT);
	},
	addHideListener: function(callback) {
		this.on(HIDE_EVENT, callback);
	},

	/**
	 * @param {function} callback
	 */
	removeHideListener: function(callback) {
		this.removeListener(HIDE_EVENT, callback);
	},
	dispatcherIndex: WeatherDispatcher.register(function(payload) {
		var action = payload.action;

		if (action.actionType === 'SEARCH_TOWN') {
			WeatherStore.isExist(action.city, action.url, action.apiId).then(function(resolve) {
				WeatherStore.getWeather().then(function(data) {
					WeatherStore.hasFail(false);
					WeatherStore.setSrc(data);
					WeatherStore.emitChange();
				});
			}).catch(function(reject) {
				WeatherStore.setMessageFail(reject);
				WeatherStore.hasFail(true);
				WeatherStore.emitChange();
			});
		}

		return true;


	})


});

module.exports = WeatherStore;