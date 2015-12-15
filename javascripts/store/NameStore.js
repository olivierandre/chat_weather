var EventEmitter = require('events').EventEmitter,
	assign = require('object-assign'),
	React = require('react'),
	ReactDOM = require('react-dom'),
	NameDispatcher = require('../dispatcher/NameDispatcher'),
	WeatherStore = require('../store/WeatherStore'),
	NavStore = require('../store/NavStore');

var CHANGE_EVENT = 'change';
var _name = '';

var NameStore = assign({}, EventEmitter.prototype, {
	getName: function() {
		return _name;
	},
	setName: function(name) {
		_name = name;
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
	dispatcherIndex: NameDispatcher.register(function(payload) {
		var action = payload.action;
		if (action.actionType === 'SAVE_NAME' || action.actionType === 'GET_USER_ON_LOAD') {
			var promise = new Promise(function(resolve, reject) {
				NameStore.setName(action.name);
				localStorage.setItem('user', action.name);
				NavStore.setName(NameStore.getName());
				resolve(action.name);
			});

			promise.then(function(resolve) {
				NavStore.emitChange();
				return 'ok';
			}).then(function(value) {
				NameStore.emitChange();
				return 'ok';
			}).then(function(value) {
				WeatherStore.emitHide();
				return 'ok';
			});

		}

		return true;

	})
});

module.exports = NameStore;
