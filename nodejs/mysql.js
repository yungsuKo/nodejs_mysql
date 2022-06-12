var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '11111111',
  database : 'tomstutorial'
});
 
connection.connect();
 
connection.query('SELECT * FROM topic', function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results);
});
 
connection.end();