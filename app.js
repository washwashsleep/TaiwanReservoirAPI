
// Node.js modules
var express = require('express');
var app = express();
var schedule = require('node-schedule');
var debug = require('debug')('reservoir');


// Defined output data
var outputData;


// Library
var reservoir = require('./libs/reservoir');
var reservoir_today = require('./libs/reservoir_today');


// Cron job for update output data
var updateData = schedule.scheduleJob('*/30 * * * 1-5', function(){
    reservoir(function (err, reservoirData){

        if (err) {
            debug('---------------- ERROR ----------------');
            debug(err.toString());
            debug('---------------- ERROR ----------------');
        }

        outputData = reservoirData;
        debug('---------------- SUCCESS ----------------');
        debug('UPDATE OUTPUT DATA SUCCESS');
        debug('---------------- SUCCESS ----------------');
        return;
    });
});


// Api router
app.get('/', function(req, res) {

    if(outputData){
        return res.jsonp({
            data: outputData
        });
    }

    reservoir(function (err, reservoirData) {

        if (err) {
            return res.jsonp({
                err: err.toString()
            });
        }

        outputData = reservoirData;

        return res.jsonp({
            data: outputData
        });
    });

});

app.get('/today', function(req, res) {

    reservoir_today(function (err, reservoirData) {

        if (err) {
            return res.jsonp({
                err: err.toString()
            });
        }

        return res.jsonp({
            data: reservoirData
        });
    });

});

app.set('port', process.env.PORT || 10080);

var server = app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + server.address().port);
});
