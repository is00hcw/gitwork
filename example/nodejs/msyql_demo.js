/**
 * Created by Administrator on 2015/10/16.
 */

var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'mysql'
});

connection.connect();

connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
    if (err) throw err;

    console.log('The solution is: ', rows[0].solution);
});

connection.query('SELECT * FROM user', function(err, rows, fields) {
    if (err) throw err;

    console.log('row is: ', rows.length);
});

connection.end();


var pool  = mysql.createPool({
    connectionLimit : 10,
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'mysql'
});

pool.query('SELECT * FROM user', function(err, rows, fields) {
    if (err) throw err;

    console.log('pool res: ', rows.length);
});
