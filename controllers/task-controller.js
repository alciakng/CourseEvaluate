/**
 * New node file
 */
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

//index init 함수
exports.init = function(req,res){
	  //index Load
	  res.render("index");
}

//userpage loading 함수
exports.userpage = function(req,res){
  res.render("authenticate",{message:req.params.alias});
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
	    	var dataSet= new Array(course_array.length);
			
	    	//받아온 데이터를 테이블 형식에 맞게  Array형식으로 변환.
			for(var i=0;i<course_array.length;i++){
				 dataSet[i]= new Array(4); 
				 dataSet[i][0]=course_array[i].sub_dept.$cd;
				 dataSet[i][1]=course_array[i].subject_div.$cd;
				 dataSet[i][2]=course_array[i].subject_nm.$cd;
				 dataSet[i][3]=course_array[i].prof_nm.$cd;
				 dataSet[i][4]=course_array[i].class_nm.$cd;
				 dataSet[i][5]='<a href="/evaluate/'+course_array[i].subject_nm.$cd+"/"+course_array[i].prof_nm.$cd+'" class="btn btn-primary btn-xs" data-title="evaluate"><span class="glyphicon glyphicon-pencil"> 평가하기</span></a>'
			};
	    	
	    	
	    	//Array를  클라이언트로 전송.
			res.send(dataSet);
	    
	    }
	});
};

//evaluate 페이지 로딩 함수.
exports.evaluate = function(req,res){
	
	//강의 페이지 상단에 강좌-교수 정보를 표시하기 위한 객체.
	var course_data=[];
	
	console.log(req.params.csnm);
	console.log(req.user);
	
	//url을 parsing하여 객체에 추가.
	course_data.push(req.params.csnm);
	course_data.push(req.params.pfnm);
	
	//evaluate page로 전송.
	res.render("evaluate.ejs",
			{
	            data : course_data,
	            nickname : req.user.alias
			});
}

//evaluate_post 함수.
exports.evaluation_post = function(req,res){
	
	console.log(req.body.evaluate_message);
	//console.log(req.body.evaluate_select);
	
	var evaluation=req.body.evaluate;
	//파라미터로 전송한 rmnm(기본키:강의명+교수명)을 파싱해서 받아온다.
	var courseName = req.params.rmnm;
	var difficulty = req.body.evaluate_select[0];
	var satisfaction = req.body.evaluate_select[1];
	var totalScore = req.body.evaluate_select[2];

	console.log(coursename);
	console.log(difficulty);
	console.log(satisfaction);
	console.log(totalScore);
	
	db.getConnection(function(err,connection){
   	 
   	 connection.query("insert into evaluation values(?,?,?,?,?,?)",[courseName,req.user.email,evaluation,difficulty,satisfaction,totalScore], function(err, rows){
   		 connection.release();
   		 //오류가 발생한 경우.
            if (err){
                res.send({message:"error"});
            }
          	res.send({message:"success"});
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
                            alias: req.body.alias
                         };

                        var insertQuery = "INSERT INTO user(email, password,major,alias) values (?,?,?,?)";

                            connection.query(insertQuery,[newUserMysql.email, newUserMysql.password,newUserMysql.major,newUserMysql.alias],function(err, rows) {
                            
                            return done(null, newUserMysql,req.flash('signupMessage', '회원가입 성공!'));
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


