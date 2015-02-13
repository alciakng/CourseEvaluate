//**New node file**//

//request 모듈.학교 api 받아오기 위해 사용.
var request = require('request');

//xml-to-json 모듈
var xm = require('xml-mapping');

//인코딩 모듈
var Iconv  = require('iconv').Iconv;

var euckr2utf8 = new Iconv('EUC-KR', 'UTF-8');


//암호화 모듈
var bcrypt = require('bcrypt-nodejs');


//mongoose 모듈 
var mongoose = require('mongoose');
//User모델 정의
var User = mongoose.model('User');
var Eval = mongoose.model('Eval');




//evaluate 페이지 로딩 함수.
exports.evalList = function(req,res){
	
	//강의 페이지 상단에 강좌-교수 정보를 표시하기 위한 변수
	  var courseDelimiter = req.params.courseDelimiter;
	  var page = (req.param('page') > 0 ? req.param('page') : 1) - 1;
	  var perPage = 20;
	  
	 
	  var options = {
	    perPage: perPage,
	    page: page,
	    criteria :{courseDelimiter : courseDelimiter}
	  };
	
	  Eval.list(options, function (err, evals){
	    if(err) return res.render('500');
	    Eval.count({courseDelimiter:courseDelimiter}).exec(function (err, count) {
	      res.render('evalList.ejs', {
	        title: courseDelimiter,
	        evals: evals,
	        page: page + 1,
	        pages: Math.ceil(count / perPage)
	      });
	    });
	  });
}

exports.load = function (req, res, next, id){

	  Eval.load(id, function (err, eval) {
	    if (err) return next(err);
	    if (!eval) return next(new Error('not found'));
	    req.eval = eval;
	    next();
	  });
};

//evaluationLoad
exports.evalView =function(req,res){
	res.render('evalView', {
	    title: req.eval.title,
	    eval: req.eval
	  });
};

//evaluationReply
exports.reply = function(req,res){
	
	var evaluationNo = req.params.evaluationNo;
	var replyText = req.body.replyText;
	
}

//evaluate_post 함수.
exports.evalPost = function(req,res){
	
	console.log(req.body.evaluate_message);
	//console.log(req.body.evaluate_select);
	
	var eval = new Eval(req.body);
	eval.courseDelimiter = req.params.rmnm;
	eval.user=req.user._id;
	eval.Save(function(err){
		 req.flash('evalMessage', '성공적으로 강의평을 게시했습니다.');
	     return res.redirect('/evalList/'+courseDelimiter);
	})
	
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





//authenticate 페이지 Get함수.
exports.authenticate = function(req,res){
    res.render("authenticate",{loginMessage:req.flash('loginMessage'),signupMessage:req.flash('signupMessage')});
    
}

//login시 세션설정 함수.
exports.loginSession = function(req,res){
    var thirtyDays = 30*24*60*60*1000;
    req.session.cookie.expires = new Date(Date.now() + thirtyDays);
    req.session.cookie.maxAge = thirtyDays;
}







         
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

//autocomplete
exports.courseSearch = function(req,res){
	//input에 입력된 keyword
	var keyword = req.body.term;
	
	console.log(keyword);
	
	var headers = {
		    'User-Agent':       'Super Agent/0.0.1',
		    'Content-Type':     "application/xml"	
	}
	
	 //api get options.옵션 content-type,encoding 아직 이해하지 못했음..
	 var options = {
			 url : 'http://wise.uos.ac.kr/uosdoc/api.ApiApiSubjectList.oapi',
			 method:'GET',
			 headers:headers,
			 encoding:'binary',
			 qs: {'apiKey': '201501195EQW98965','year':'2014','term':'A10','subjectNm':keyword}
	 };
	
	console.log("Let's Start courseLoad");
	//request 동작. 
	
	request(options, function (error, response, body) {
	    if(error) console.log("에러에러(wise 점검 및 인터넷 연결 안됨)");
	    if (!error && response.statusCode == 200) {
	    	
	    	//받아온 데이터의 euc-kr 형식을 ut8로 변환
	    	var data = new Buffer(body, 'binary');
	    	
	    	var data_utf8 = euckr2utf8.convert(data).toString();
	    
	    	//받아온 강의 데이터 xml 형식을 json으로 변환.
	    	var courseData = xm.load(data_utf8).root.mainlist.list;
	    	
	    	//Array를  클라이언트로 전송.
			res.send(courseData);
	    }
	});
}











