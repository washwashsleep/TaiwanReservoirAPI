var express = require('express');
var app = express();

var reservoir = require('./libs/reservoir');

app.get('/', function (req, res) {

    reservoir(function (err, reservoirData) {
        if (err) { 
            return res.jsonp({ err: err.toString() }); 
        }

        return res.jsonp({ data: reservoirData });
    });
    
});

app.listen(10080);