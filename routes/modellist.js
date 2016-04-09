module.exports = function (router, bodyParser) {
  var fs = require('fs');
  var path= require('path');
  var jsonParser = bodyParser.json();
  const uuid = require('uuid');
   
  fs.readdir(__dirname + '/../model/', function (err, files) {
    if(err) {
      console.error(err);
      return;
    }else {
      files.forEach(function (file) {
        var filePath = path.normalize(__dirname + '/../model/' + file);
        // console.log('The file is: ' , file);
        fs.stat(filePath, function (err, stat) {         
          if(stat.isDirectory()) {
            // console.log('The CheckUnique is: ' , '/api/'+file+'/CheckUnique/:id');
            router.route('/'+file+'/CheckUnique/:filter').get(function (req, res) {
              if(file==='lowdbds'){
                var db = require.main.require('./lib/db');
                var table = db.getDatasouce()[file]('users');
                    
                var rt=table.find(req.query);
                    // console.log('rt====', rt);
                res.send(rt);
                    // var table = db.getDatasouce()[file](apipath);
                    // res.send(table.__wrapped__);
              }else{

              }
                     
            });

            fs.readdir(filePath, function (err, files2) {
              files2.forEach(function (file2) {
              var apipath = file2.substr(0,file2.length-5);
              
              router.route('/'+file+'/'+apipath+'/').get(function (req, res) {
                var db = require.main.require('./lib/db');
                // console.log('file==', file);
                // console.log('db.getDatasouce()==', db.getDatasouce()[file]);
                // console.log('db.getDatasouce()==', db.getDatasouce()[file].connector);
                // console.log('db.getDatasouce()==', db.getDatasouce()[file].database(apipath));
                if(db.getDatasouce()[file].connector==='lowdb'){  
                  var table = db.getDatasouce()[file].database(apipath);
                  res.send(table.__wrapped__);
                }else{
                  var Task = require.main.require("./lib/model.js");
                  var modelpro = JSON.parse(fs.readFileSync(filePath +'/'+file2,'utf-8'));
                  var params = new Array();
                  var j=0;
                  for (var key in modelpro) {
                    params[j]=key;
                    j ++;
                  } 
                  Task.getAll(file,apipath,params,function (err, results) {
                    if (!err) res.send(results);
                    else res.send({"error": "select model list failed with error code: "+err.code});
                  });
                }

                  }).post(jsonParser, function (req, res) {
                          var apipath = file2.substr(0,file2.length-5);
                            if(file==='lowdbds'){
                              var db = require.main.require('./lib/db');
                             
                              req.body.id=uuid();
                              console.log('req==', req.body);
                              var table = db.getDatasouce()[file](apipath).push(req.body);
                              // table.find();
                              res.send(req.body);
                            }else{
                              if (!req.body) return res.sendStatus(400);
                              var Task = require.main.require("./lib/model.js");
                              Task.create(req.body.name, req.body.is_done, function (err, results) {
                                if (!err) res.send(results);
                                else res.send({"error": "create model failed with error code: "+err.code});
                              });

                            }
                     
                        });

                        router.route('/'+file+'/'+apipath+'/:filter').post(jsonParser, function (req, res) {
                          var apipath = file2.substr(0,file2.length-5);
                          // router.route('/'+file+'/'+apipath+'/').get(function (req, res) {
                            if(file==='lowdbds'){
                              var db = require.main.require('./lib/db');
                              var table = db.getDatasouce()[file](apipath);
                              var rt=table.find(req.body.filter);
                              res.send(rt);
                            }else{
                              if (!req.body) return res.sendStatus(400);
                              var Task = require.main.require("./lib/model.js");
                              Task.create(req.body.name, req.body.is_done, function (err, results) {
                                if (!err) res.send(results);
                                else res.send({"error": "create model failed with error code: "+err.code});
                              });

                            }
                     
                        });


                        router.route('/'+apipath+'/:task_id').get(function (req, res) {
                          if(file==='lowdbds'){
                            var db = require.main.require('./lib/db');
                            var table = db.getDatasouce()[file](apipath);
                            var rt=table.find(req.body.filter);
                            res.send(rt);
                          }else{
                            var Task = require.main.require("./lib/model.js");
                            Task.getById(req.params.task_id, apipath,function (err, results) {
                              if (!err) res.send(results);
                              else res.send({"error": "select model failed with error code: "+err.code});
                            });
                          }
                        }).put(jsonParser, function (req, res) {
                          console.log('req.body: ' , req.body);
                          if (!req.body) return res.sendStatus(400);
                          var params = {};
                          if (req.body.name) params.name = req.body.name;
                          if (req.body.is_done) params.is_done = req.body.is_done;
                          if(file==='lowdbds'){
                            var db = require.main.require('./lib/db');
                            var table = db.getDatasouce()[file](apipath);
                            var rt=table.find(req.body.filter);
                            res.send(rt);
                          }else{
                            var Task = require.main.require("./lib/model.js");
                            Task.update(req.params.task_id, params, function (err, results) {
                              if (!err) res.send(results);
                              else res.send({"error": "Update model failed with error code: "+err.code});
                            });
                          }
                        }).delete(function (req, res) {
                           var Task = require.main.require("./lib/model.js");
                           Task.remove(req.params.task_id, function (err, results) {
                              if (!err) res.send(results);
                              else res.send({"error": "delete model failed with error code: "+err.code});
                           });
                        });                
                      });
                    });



                }

             });
          });


        }
    });
    
};
