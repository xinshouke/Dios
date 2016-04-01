var fs = require('fs');
var config=JSON.parse(fs.readFileSync(__dirname+'/../config/datasources.json','utf-8'));
var mysql = require('mysql'),
    db = new Array();
for (var key in config) {
    db[key]= mysql.createPool({
        connectionLimit: 100,
        host: config[key].host,
        user: config[key].username,
        password: config[key].password,
        database: config[key].database
    });
}
exports.getDatasouce = function () {
    return db;
};
