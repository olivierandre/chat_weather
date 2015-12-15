var WeatherDispatcher = require('../dispatcher/WeatherDispatcher');

var WeatherActions = {

	/**
	 * @param  {string} city
	 * @param  {string} url
	 * @param  {string} apiId
	 */
	searchTown: function(city, url, apiId) {
		WeatherDispatcher.handleViewAction({
			actionType: 'SEARCH_TOWN',
			city: city,
			url: url,
			apiId: apiId
		});
	}

};

module.exports = WeatherActions;
