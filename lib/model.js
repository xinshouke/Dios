var db = require.main.require('./lib/db');

module.exports = {
    create: function (name, is_done, callback) {
        db.getDatasouce().getConnection(function (err, connection) {
            var sql = "INSERT INTO `" + db.getTableName("task_table") + "`( `name`, `is_done`) VALUES ('" + name + "', " + is_done + ")";
            connection.query(sql, callback);
            connection.release();
        });
    },
    getAll: function (rdas,tablename,params,callback) {
        if(rdas==='lowdbds'){
          // callback('');
        }else{
          var szsql='';
          var szparm='';
          if(params.length>0){
            for(var i=0;i<params.length;i++){
              if(i<params.length-1) szparm+=params[i]+',';
              else szparm+=params[i];
            }
            szsql='select '+szparm+' from ';
          }else{
            szsql="select * from ";
          }
          db.getDatasouce()[rdas].getConnection(function (err, connection) {
            if(typeof(connection) == "undefined"){
               callback(err);             
            }else{
               connection.query(szsql + tablename, callback);
               connection.release();
            }

          });

        }

    },
    getById: function (id, tablename,callback) {
        db.getDatasouce().getConnection(function (err, connection) {
            connection.query("select * from " + tablename+ " where id=" + id, callback);
            connection.release();
        });
    },
    update: function (id, params, callback) {
        var sql = "UPDATE `" + db.getTableName("task_table") + "` SET ";
        //Generate SQL with updated params
        Object.keys(params).forEach(function (key, idx) {
            if (idx !== 0) {
                sql += ", ";
            }
            sql += "`" + key + "`='" + params[key] + "' ";
        });

        sql += " WHERE `task_id` = " + id;
        console.log(sql);
        db.getDatasouce().getConnection(function (err, connection) {
            console.log('connection==', connection);
            connection.query(sql, callback);
            connection.release();
        });
    },
    remove: function (id, callback) {
        db.getDatasouce().getConnection(function (err, connection) {

            connection.query("delete from " + db.getTableName("task_table") + " where task_id=" + id, callback);
            connection.release();
        });
    }

};
