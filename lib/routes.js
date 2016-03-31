var express = require('express'),
    router = express.Router(),
    bodyParser = require('body-parser'),
    tasklist = require.main.require('./routes/tasklist')(router, bodyParser);
        
router.use(function (req, res, next) {
    next(); // make sure we go to the next routes and don't stop here
});

exports.getRouter = function () {
    return router;
};   