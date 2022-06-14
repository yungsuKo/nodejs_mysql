var mysql = require('mysql');

var db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '11111111',
    database : 'tomstutorial'
  })
  db.connect();
  module.exports = db;