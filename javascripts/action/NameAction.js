var NameDispatcher = require('../dispatcher/NameDispatcher');

var NameAction = {

	/**
	 * @param  {string} city
	 * @param  {string} url
	 * @param  {string} apiId
	 */
	getUserOnLoad: function(name) {
		NameDispatcher.handleViewAction({
			actionType: 'GET_USER_ON_LOAD',
			name: name
		});
	},
    saveUser: function(name) {
		NameDispatcher.handleViewAction({
			actionType: 'SAVE_NAME',
			name: name
		});
	}

};

module.exports = NameAction;
