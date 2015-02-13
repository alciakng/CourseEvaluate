//**New node file**//



//mongoose 모듈 
var mongoose = require('mongoose');
//User모델 정의
var User = mongoose.model('User');
var Eval = mongoose.model('Eval');




	/*
	db.getConnection(function(err,connection){
   	 connection.query("insert into evaluation(userNo,userAlias,courseName,title,evaluation,difficulty,satisfaction,totalScore,evaluationTime) values(?,?,?,?,?,?,?,?,now());",[req.user.userNo,req.user.alias,courseName,title,evaluation,difficulty,satisfaction,totalScore], function(err, rows){
   		 connection.release();
   		 //오류가 발생한 경우.
            if (err){
            	console.log("강의평 db에 삽입오류.");
                res.send({message:"error"});
            }else{
            console.log("강의평 db에 정상적으로 삽입");
          	res.send({message:"success"});
            }
		});
   	});
   	*/
	
}













