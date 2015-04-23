var request = require('request');
var async = require('async');
var cheerio = require('cheerio');
var moment = require('moment');

var _RESERVOIRGOVURL = 'http://fhy.wra.gov.tw/ReservoirPage_2011/StorageCapacity.aspx';

module.exports = function (callback) {

    async.waterfall([

        /*
         * 得到目前網頁資料的 html
         */
        function (cb){
            request(_RESERVOIRGOVURL, function (error, response, body) {

                if(error){
                    return cb(error);
                }

                cb(null, body);
            });
        },

        /*
         * 解析第一次網頁資料，取得 form data 後 POST
         */
        function (html, cb){

            var now = moment();
            var $ = cheerio.load(html);

            var form = $('#form1');
            // 選擇今天日期
            form.find('select#cphMain_ucDate_cboYear').val(now.year());
            form.find('select#cphMain_ucDate_cboMonth').val(now.month() + 1);
            form.find('select#cphMain_ucDate_cboDay').val(now.date());
            
            // 先填入固定的欄位
            var data = {
              'ctl00$ctl02': 'ctl00$cphMain$ctl00|ctl00$cphMain$btnQuery',
              '__EVENTTARGET': 'ctl00$cphMain$btnQuery',
              '__EVENTARGUMENT': '',
              '__LASTFOCUS': '',
              '__ASYNCPOST': true
            };
            // 把剩下的欄位補上
            var arr = form.serializeArray();
            for (var i in arr) {
                data[arr[i].name] = arr[i].value;
            }
            // 處理 ctl02_HiddenField 欄位
            var script = $('script[src]').filter(function (i, s) {
              return $(this).attr('src').match('ctl02_HiddenField');
            });
            var ctl02_value = decodeURIComponent(script.attr('src')).match(/;;AjaxControlToolkit.*/)[0];
            data['ctl02_HiddenField'] = ctl02_value;

            request.post({
              url: _RESERVOIRGOVURL,
              headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.89 Safari/537.36',
                'Referer': 'http://fhy.wra.gov.tw/ReservoirPage_2011/StorageCapacity.aspx',
                'X-MicrosoftAjax': 'Delta=true',
                'X-Requested-With': 'XMLHttpRequest'
              },
              form: data
            }, function(error, response, body){
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

            var lastedUpdateTime = moment().format('YYYY-MM-DD HH:mm:ss');

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
                    lastedUpdateTime: lastedUpdateTime
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

