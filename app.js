var express = require('express'),
    bodyParser = require('body-parser'),
    app = express(),
    ejs = require('ejs'),
    favicon = require('serve-favicon'),
    port = 3000;
var routes = require('./lib/routes');



//obsługa JSON z POST
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
var db = require.main.require('./lib/db');
app.db=db;

app.use('/api/', routes.getRouter());

app.use(favicon(__dirname + '/h5client/public/favicon.ico'));
app.set('views', __dirname + '/h5client/');	
app.engine('.html', ejs.__express);
app.set('view engine', 'html');
app.use('/',function(req, res) {
  if(req.url !== '/favicon.ico'){
    res.render('login', { title: 'user login' });
  }
});
app.listen(port, function () {
    console.log('REST API app is listening on port %d!', port);
});
