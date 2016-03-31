module.exports = function (router, bodyParser) {
    var fs = require('fs');
    var path= require('path');
    var jsonParser = bodyParser.json();
   
    fs.readdir(__dirname + '/../model/', function (err, files) {
        if(err) {
           console.error(err);
           return;
        }else {
          var Task = new Array();
          files.forEach(function (file) {
             var filePath = path.normalize(__dirname + '/../model/' + file);
             // console.log('The file is: ' , file);
             fs.stat(filePath, function (err, stat) {
                if(stat.isFile()) {
                   var apipath = file.substr(0,file.length-5);
                   router.route('/'+apipath+'/').get(function (req, res) {
                     var Task = require.main.require("./lib/task.js");
                     var modelpro = JSON.parse(fs.readFileSync(__dirname + '/../model/' + file,'utf-8'));
                     var params = new Array();
                     var j=0;
                     for (var key in modelpro) {
                        params[j]=key;
                        j ++;
                     }
                     Task.getAll(apipath,params,function (err, results) {
                       if (!err) res.send(results);
                       else res.send({"error": "select tasks list failed with error code: "+err.code});
                     });
                   }).post(jsonParser, function (req, res) {
                     if (!req.body) return res.sendStatus(400);
                     var Task = require.main.require("./lib/task.js");
                     Task.create(req.body.name, req.body.is_done, function (err, results) {
                       if (!err) res.send(results);
                       else res.send({"error": "create task failed with error code: "+err.code});
                     });
                   });   

                   router.route('/'+apipath+'/:task_id').get(function (req, res) {
                     var Task = require.main.require("./lib/task.js");
                     Task.getById(req.params.task_id, apipath,function (err, results) {
                       if (!err) res.send(results);
                       else res.send({"error": "select task failed with error code: "+err.code});
                     });
                   }).put(jsonParser, function (req, res) {
                     if (!req.body) return res.sendStatus(400);
                     var params = {};
                     if (req.body.name) params.name = req.body.name;
                     if (req.body.is_done) params.is_done = req.body.is_done;
                     var Task = require.main.require("./lib/task.js");
                     Task.update(req.params.task_id, params, function (err, results) {
                       if (!err) res.send(results);
                       else res.send({"error": "Update task failed with error code: "+err.code});
                     });
                   }).delete(function (req, res) {
                     var Task = require.main.require("./lib/task.js");
                     Task.remove(req.params.task_id, function (err, results) {
                     if (!err)
                        res.send(results);
                     else
                        res.send({"error": "delete task failed with error code: "+err.code});
                     });
                   });                
                }
                if(stat.isDirectory()) {
                   console.log(filePath + ' is: ' + 'dir');
                }

             });
          });


        }
    });
    
};
