var request = require('request');
var async = require('async');
var cheerio = require('cheerio');

var reservoirGovUrl = 'http://fhy.wra.gov.tw/ReservoirPage_2011/StorageCapacity.aspx';


module.exports = function (callback) {

	async.waterfall([

        /*
         * 得到目前網頁資料的 html
         */
        function (cb){
            request(reservoirGovUrl, function (error, response, body) {

                if(error){
                    return cb(error);
                }

                cb(null, body);
            });
        },

        /*
         * 解析網頁資料，做成新的 json
         */
        function (html, cb){

            var outputData = [];

            var $ = cheerio.load(html);

            $('.list').find('tr').each(function (i, elem){

                if(i > 22 || i < 2){
                    return;
                }

                var reservoirName = $(this).find('td').eq(0).text().trim().replace(/(\r\n|\n|\r|\s)/g,'');
                var baseAvailable = $(this).find('td').eq(1).text().trim().replace(/(\r\n|\n|\r|\s)/g,'');
                var daliyTime = $(this).find('td').eq(2).text().trim().replace(/(\r\n|\n|\r|\s)/g,'');
                var daliyRainfall = $(this).find('td').eq(3).text().trim().replace(/(\r\n|\n|\r|\s)/g,'');
                var daliyInflow = $(this).find('td').eq(4).text().trim().replace(/(\r\n|\n|\r|\s)/g,'');
                var daliyOverflow = $(this).find('td').eq(5).text().trim().replace(/(\r\n|\n|\r|\s)/g,'');
                var daliyDetector = $(this).find('td').eq(6).text().trim().replace(/(\r\n|\n|\r|\s)/g,'');
                var concentration = $(this).find('td').eq(7).text().trim().replace(/(\r\n|\n|\r|\s)/g,'');
                var immediateTime = $(this).find('td').eq(8).text().trim().replace(/(\r\n|\n|\r|\s)/g,'');
                var immediateLevel = $(this).find('td').eq(9).text().trim().replace(/(\r\n|\n|\r|\s)/g,'');
                var immediateStorage = $(this).find('td').eq(10).text().trim().replace(/(\r\n|\n|\r|\s)/g,'');
                var immediatePercentage = $(this).find('td').eq(11).text().trim().replace(/(\r\n|\n|\r|\s)/g,'');

                outputData.push({
                    reservoirName: reservoirName,
                    baseAvailable: baseAvailable,
                    daliyTime: daliyTime,
                    daliyRainfall: daliyRainfall,
                    daliyInflow: daliyInflow,
                    daliyOverflow: daliyOverflow,
                    daliyDetector: daliyDetector,
                    concentration: concentration,
                    immediateTime: immediateTime,
                    immediateLevel: immediateLevel,
                    immediateStorage: immediateStorage,
                    immediatePercentage: immediatePercentage,
                });
            });

            cb(null, outputData);
        }
    ], function (err, outputData) {

        if (err) {
            return callback(err);
        }

        if (!outputData || outputData.length === 0) {
            return callback(new Error('outputData not found'));
        }


        callback(null, outputData);
    });
};

