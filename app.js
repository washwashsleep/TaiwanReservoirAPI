
// Node.js modules
var express = require('express');
var app = express();
var schedule = require('node-schedule');


// Defined output data
var outputData;


// Library
var reservoir = require('./libs/reservoir');


// Cron job for update output data
var updateData = schedule.scheduleJob('* */30 * * *', function(){
    reservoir(function (err, reservoirData){

        if (err) {
            console.log('---------------- ERROR ----------------');
            console.log(err.toString());
            console.log('---------------- ERROR ----------------');
        }

        outputData = reservoirData;
        console.log('---------------- SUCCESS ----------------');
        console.log('UPDATE OUTPUT DATA SUCCESS');
        console.log('---------------- SUCCESS ----------------');
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

app.listen(10080);