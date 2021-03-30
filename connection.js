const mysql = require('mysql');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'securechat'
});

connection.connect(function(err) {
    if(err){
        console.log(err.code);
        console.log(err.fatal);
    }
});

module.exports = connection;