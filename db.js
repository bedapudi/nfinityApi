var mysql = require('mysql');
var pool  = mysql.createPool({
  host     : 'localhost',
  user     : 'root',
  password : 'demo123',
  database:"helpdesk"
});

module.exports = pool