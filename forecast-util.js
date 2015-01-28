var Forecast = require('forecast');
var config = require('./config');

var forecast = new Forecast({
    service: 'forecast.io',
    key: config.values.forecast_api_key,
    units: 'celcius', // Only the first letter is parsed
    cache: true,      // Cache API requests?
    ttl: {            // How long to cache requests. Uses syntax from moment.js: http://momentjs.com/docs/#/durations/creating/
        minutes: 27,
        seconds: 45
    }
});

exports.forecast = forecast;