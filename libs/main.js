/* Merge statistic data of resevoir.js with real-time data of reservoir_today.js*/
var reservoir = require('./reservoir'),
    reservoirNow = require('./reservoir_today');
var jsonQuery = require('json-query');

module.exports = function (callback) {
    reservoir(function (err, reservoirData) {
        if (err)
            callback(err, null);

        reservoirNow(function (err, immediateData) {
            if (err)
                callback(err, null);

            immediateData.forEach(function (element, index, array) {
                var key = jsonQuery('reserv[reservoirName=' + element.reservoirName + ']', {
                    data: {
                        reserv: reservoirData
                    }
                }).key;
                
                if (key !== null) {
                    if (reservoirData[key]) {
                        reservoirData[key].immediateTime = element.immediateTime;
                        reservoirData[key].immediateLevel = element.immediateLevel;
                        reservoirData[key].immediateStorage = element.immediateStorage;
                        reservoirData[key].immediatePercentage = element.immediatePercentage;
                    }
                }

            });

            callback(null, reservoirData);
        });
    });
};