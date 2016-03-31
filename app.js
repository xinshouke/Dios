var express = require('express'),
    bodyParser = require('body-parser'),
    app = express(),
    port = 3000;
var routes = require('./lib/routes');

app.use('/api/', routes.getRouter());

//obsługa JSON z POST
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


app.listen(port, function () {
    console.log('REST API app is listening on port %d!', port);
});