//**New node file**//

//request 모듈.학교 api 받아오기 위해 사용.
var request = require('request');

//xml-to-json 모듈
var xm = require('xml-mapping');

//인코딩 모듈
var Iconv  = require('iconv').Iconv;
var euckr2utf8 = new Iconv('EUC-KR', 'UTF-8');

//로그인 모듈
var LocalStrategy = require('passport-local').Strategy;

//암호화 모듈
var bcrypt = require('bcrypt-nodejs');

//db 모듈(custom 모듈)
var db = require('../db.js');



//로그인이 되어있는지 확인하는 함수.
exports.ensureAuthenticated= function(req, res, next) {
    // 로그인이 되어 있으면, 다음 파이프라인으로 진행
    if (req.isAuthenticated()) { return next(); }
    // 로그인이 안되어 있으면 index Load
	db.getConnection(function(err,connection){
        connection.query("SELECT *,DATE_FORMAT(evaluationTime,'%Y-%m-%d %h:%i %p') as evalTime FROM evaluation ORDER BY evaluationTime DESC LIMIT 2", function(err, rows) {
        	connection.release();
        	res.render("index",{
        		recentEval:rows
        	});
        	
        });
	});
    
}

//index init 함수
exports.init = function(req,res){
	 
}

//userpage loading 함수
exports.userpage = function(req,res){
	//userpage Load
	db.getConnection(function(err,connection){
        connection.query("SELECT *,DATE_FORMAT(evaluationTime,'%Y-%m-%d %h:%i %p') as evalTime FROM evaluation ORDER BY evaluationTime DESC LIMIT 2", function(err, rows) {
        	connection.release();
        	res.render("user",{
        		recentEval:rows
        	});
        	
        });
	});
}


//강의 로딩 함수(나중에 init이랑 합쳐져야함)
exports.courseLoad = function(req,res){

	
	var headers = {
		    'User-Agent':       'Super Agent/0.0.1',
		    'Content-Type':     "application/xml"	
	}
	
	 //api get options.옵션 content-type,encoding 아직 이해하지 못했음..
	 var options = {
			 url : 'http://wise.uos.ac.kr/uosdoc/api.ApiUcrCultTimeInq.oapi',
			 method:'GET',
			 headers:headers,
			 encoding:'binary',
			 qs: {'apiKey': '201501195EQW98965','year':'2014','term':'A10','subjectDiv':'""'}
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
	    	var course_array = xm.load(data_utf8).root.mainlist.list;
	    	var dataSet= new Array();
			
	    	//받아온 데이터를 테이블 형식에 맞게  Array형식으로 변환.
			for(var i=0;i<course_array.length;i++){
				 var data= new Object(); 
				 data['majorDiv']=course_array[i].sub_dept.$cd;
				 data['curriculumDiv']=course_array[i].subject_div.$cd;
				 data['courseName']=course_array[i].subject_nm.$cd;
				 data['professorName']=course_array[i].prof_nm.$cd;
				 data['evaluation']='<a href="/evaluate/'+course_array[i].subject_nm.$cd+"/"+course_array[i].prof_nm.$cd+'" class="btn btn-danger btn-xs" data-title="evaluate"><span class="glyphicon glyphicon-pencil"> 평가하기</span></a>'
				 dataSet.push(data);
			};
	    	console.log(dataSet);
	    	
	    	//Array를  클라이언트로 전송.
			res.send(dataSet);
	    
	    }
	});
};

//evaluate 페이지 로딩 함수.
exports.evaluate = function(req,res){
	
	//강의 페이지 상단에 강좌-교수 정보를 표시하기 위한 객체.
	var course_data=[];
	var course_name = req.params.csnm+req.params.pfnm;
	
	
	//url을 parsing하여 객체에 추가.
	course_data.push(req.params.csnm);
	course_data.push(req.params.pfnm);
	console.log(course_name);
	
	//db에서 평가정보를 받아온다.
	db.getConnection(function(err,connection){
        connection.query("SELECT *,DATE_FORMAT(evaluationTime,'%Y-%m-%d %h:%i %p') as evalTime FROM evaluation WHERE courseName =?",[course_name], function(err, rows) {
        	connection.release();
        	//console.log(rows);
        	//evaluate page로 전송.
        	res.render("evaluate.ejs",
        			{
        	            data : course_data,
        	            nickname : req.user.alias,
        	            evalData : rows
        			});
        	
        	
        });
	});
	
	//console.log(evalDatas);
	
}

//evaluationLoad
exports.evalView =function(req,res){
	
	var evalNo = req.params.evalNo;
	var evalData;
	var replyData;
	
	//db에서 평가정보를 받아온다.
	db.getConnection(function(err,connection){
        connection.query("SELECT *,DATE_FORMAT(evaluationTime,'%Y-%m-%d %h:%i %p') as evalTime FROM evaluation WHERE evalNo =?",[evalNo], function(err, evalData) {
        	//배열복사
        	connection.query("SELECT *,DATE_FORMAT(replyTime,'%Y-%m-%d %h:%i %p') as replyTime FROM reply WHERE evalNo =?",[evalNo], function(err, replyData) {
            	//배열복사
            	console.log(replyData);
            		 res.render("evalView",{
            	        	evalData : evalData,
            	        	replyData : replyData
            	        })
            });  
        	
        });  

        connection.release();
     });
};

//evaluationReply
exports.reply = function(req,res){
	
	var evaluationNo = req.params.evaluationNo;
	var replyText = req.body.replyText;
	
	db.getConnection(function(err,connection){
	   	 connection.query("insert into reply(userNo,userAlias,evalNo,replyText) values(?,?,?,?)",[req.user.userNo,req.user.alias,evaluationNo,replyText], function(err, rows){
	   		 connection.release();
	   		 if(err) alert("에러발생");
	   		 else
	   		 res.redirect('/evalView/'+evaluationNo);
	   		 
			});
	   	});
}

//evaluate_post 함수.
exports.evaluationPost = function(req,res){
	
	console.log(req.body.evaluate_message);
	//console.log(req.body.evaluate_select);
	
	var evaluation=req.body.evaluate_message;
	//파라미터로 전송한 rmnm(기본키:강의명+교수명)을 파싱해서 받아온다.
	var courseName = req.params.rmnm;
	var title = req.body.title;
	var difficulty = req.body.difficulty;
	var satisfaction = req.body.satisfaction;
	var totalScore = req.body.totalScore;
	

	console.log(courseName);
	console.log(difficulty);
	console.log(satisfaction);
	console.log(totalScore);
	
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
	
}

//authenticate 페이지 Get함수.
exports.authenticatepage = function(req,res){
    res.render("authenticate",{loginMessage:req.flash('loginMessage'),signupMessage:req.flash('signupMessage')});
}

//login시 세션설정 함수.
exports.loginSession = function(req,res){
    var thirtyDays = 30*24*60*60*1000;
    req.session.cookie.expires = new Date(Date.now() + thirtyDays);
    req.session.cookie.maxAge = thirtyDays;
}

//passport configuration
exports.pass = function(passport){

	passport.serializeUser(function(user,done){
	    console.log('serialize');
		done(null,user);
	});
	
	passport.deserializeUser(function(user,done){
		console.log('deserialize');
		done(null,user);
	})
	
	//login

	 passport.use('local-login', 
	 new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'emailinput',
        passwordField : 'passwordinput',
        passReqToCallback : true 
    },
    function(req,emailinput, passwordinput, done) { // callback with email and password from our form
    	console.log(emailinput);
    	console.log(passwordinput);
    	db.getConnection(function(err,connection){
    	 
    	 connection.query("SELECT * FROM user WHERE email = ?",[emailinput], function(err, rows){
    		 connection.release();
            // if (err)
            //     return done(err);
             if (!rows.length) {
                 return done(null, false,req.flash('loginMessage', '일치하는 이메일을 찾을 수 없습니다.')); // req.flash is the way to set flashdata using connect-flash
             }
            // if the user is found but the password is wrong
            if (!bcrypt.compareSync(passwordinput, rows[0].password))
                return done(null, false,req.flash('loginMessage', '비밀번호를 잘못 입력하셨습니다.')); // create the loginMessage and save it to session as flashdata

			// if the user is found but the password is wrong
            // all is well, return successful user
            console.log("로그인성공!");
            return done(null, rows[0],req.flash('loginMessage', rows[0].alias+"님 환영합니다!"));			
		
		});
    	});
		
    }));
	
	
	
	//signup
	
	passport.use(
	        'local-signup',
	        new LocalStrategy({
	            // by default, local strategy uses username and password, we will override with email
	            usernameField : 'email',
	            passwordField : 'password',
	            passReqToCallback : true // allows us to pass back the entire request to the callback
	        },
	        function(req, email, password, done) {
	            // find a user whose email is the same as the forms email
	            // we are checking to see if the user trying to login already exists
	        	db.getConnection(function(err,connection){
	            connection.query("SELECT * FROM user WHERE email = ?",[email], function(err, rows) {
	            	connection.release();
	                if (err)
	                    return done(err);
	                if (rows.length) {
	                    return done(null, false);
	                }else {
	                
	                    // if there is no user with that username
	                    // create the user
	                	
	                	console.log(req.body.major + req.body.alias);
	                	
	                    var newUserMysql = {
	                        email: email,
	                        password: bcrypt.hashSync(password, null, null),
	                        major : req.body.major,
                            alias: req.body.alias,
                            introduction : req.body.introduction
                         };

                        var insertQuery = "INSERT INTO user(email, password,major,alias,introduction) values (?,?,?,?,?)";

                            connection.query(insertQuery,[newUserMysql.email, newUserMysql.password,newUserMysql.major,newUserMysql.alias,newUserMysql.introduction],function(err, rows) {
                            
                            return done(
                            		null, newUserMysql,req.flash('signupMessage', '회원가입 성공!'));
                     });
                   }
                });
              });
            })
           );
         };
         
//이메일 중복확인         
exports.email_validation = function(req,res){
	console.log(req.param("value"));
	
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
};

//별칭 중복확인
exports.alias_validation = function(req,res){		
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











