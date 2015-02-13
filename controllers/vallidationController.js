/**
 * New node file
 */





         
//이메일 중복확인         
exports.email_validation = function(req,res){
	console.log(req.param("value"));
	/*
	db.getConnection(function(err,connection){

		connection.query("SELECT * FROM user WHERE email = ?",[req.param("value")], function(err, rows){
			connection.release();
			if (rows.length) {
				console.log("등록된 이메일");
				res.writeHead(200, {'content-type': 'text/json' });
				res.write( JSON.stringify({
					"value" : req.param("value"),
					"valid" : 0,
					"message" : "이미 등록된 이메일 입니다."
				}));
				res.end('\n');
			}
			else{
				console.log("등록되지 않은 이메일");
				res.writeHead(200, {'content-type': 'text/json' });
				res.write( JSON.stringify({
					"value" : req.param("value"),
					"valid" : 1,
					"message" : "사용가능한 이메일 입니다."
				}) );
				res.end('\n');
			}
		});
	});
	*/
};

//별칭 중복확인
exports.alias_validation = function(req,res){	
	/*
	db.getConnection(function(err,connection){
		
		console.log(req.param("value"));

		connection.query("SELECT * FROM user WHERE alias = ?",[req.param("value")], function(err, rows){
			connection.release();
			if (rows.length) {
				console.log("등록된 닉네임");
				res.writeHead(200, {'content-type': 'text/json' });
				res.write( JSON.stringify({
					"value" : req.param("value"),
					"valid" : 0,
					"message" : "이미 등록된 닉네임 입니다."
				}));
				res.end('\n');
			}
			else{
				console.log("등록되지 않은 닉네임");
				res.writeHead(200, {'content-type': 'text/json' });
				res.write( JSON.stringify({
					"value" : req.param("value"),
					"valid" : 1,
					"message" : "사용가능한 닉네임 입니다."
				}) );
				res.end('\n');
			}
		});
	});
	*/
};






