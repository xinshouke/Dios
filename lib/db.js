var fs = require('fs');
var config=JSON.parse(fs.readFileSync(__dirname+'/../config/datasources.json','utf-8'));

var mysql = require('mysql'),
    db = mysql.createPool({
        connectionLimit: 100,
        host: config.cduserds.host,
        user: config.cduserds.username,
        password: config.cduserds.password,
        database: config.cduserds.database
    });
exports.getDatasouce = function () {
    return db;
};
