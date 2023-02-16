var mysql = require('mysql');
// var db = mysql.createConnection({
//     host: 'localhost',
//     user: 'smart',
//     password: 'yNNbZXYBxCdnwPG6',
//     database: 'smart'
// });
var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'newsmartconcrm'
});
db.connect(); 
module.exports = db;