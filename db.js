/**
 * New node file
 */


var mysql = require('mysql');

var pool = mysql.createPool({
	host :'127.0.0.1',
	user : 'JH',
	password :'aa156574',
	database : 'CourseEstimate',
	connectionLimit : 20
});

exports.getConnection = function(callback) {   
    pool.getConnection(function(err, connection) {
        callback(err, connection);
    });
};

