var request = require('request');
var async = require('async');
var cheerio = require('cheerio');

var _RESERVOIRGOVURL = 'http://fhy.wra.gov.tw/ReservoirPage_2011/Statistics.aspx';

module.exports = function (callback) {

    async.waterfall([

        /* Request content body of HTML URL */
        function (stream)
        {
            request(_RESERVOIRGOVURL, function (error, response, body)
            {
                if(error)
                    return stream(error);

                stream(null, body);
            });
        },
        
        /* Use cheerio to parse website data, and output formatted json */
        function (html, stream){

            var outputData = [];
            var $ = cheerio.load(html);

            $('.list').find('tr').each(function (i, elem){
                
                if(i > 22 || i < 4)
                    return;
                
                var reservoirName = $(this).find('td').eq(0).find('a').eq(0).text().trim();
                var lastedUpdateTime = $(this).find('td').eq(1).text().trim(); //本日集水區累積降雨量(mm)
                //var daliyRainfall = $(this).find('td').eq(2).text().trim(); //進流量(cms)                
                var immediateLevel = $(this).find('td').eq(4).text().trim();//水位(公尺)
                var immediateStorage = $(this).find('td').eq(6).text().trim();//有效蓄水量(萬立方公尺)
                var immediatePercentage = $(this).find('td').eq(7).text().trim();//蓄水百分比(%)
                
                outputData.push( 
                {
                    reservoirName: reservoirName,
                    lastedUpdateTime: lastedUpdateTime,
                    immediateLevel: immediateLevel,
                    immediateStorage: immediateStorage,
                    immediatePercentage: immediatePercentage
                });
            });

            stream(null, outputData);
        }
    ], function (err, outputData) {

        if (err)
            return callback(err);

        if (!outputData)
            return callback(new Error('outputData not found'));

        callback(null, outputData);
    });
};

