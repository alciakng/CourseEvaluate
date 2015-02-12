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


//mongoose 모듈 
var mongoose = require('mongoose');
//User모델 정의
var User = mongoose.model('User');
var Eval = mongoose.model('Eval');

//로그인이 되어있는지 확인하는 함수.
exports.ensureAuthenticated= function(req, res, next) {
    // 로그인이 되어 있으면, 다음 파이프라인으로 진행
    if (req.isAuthenticated()) { return next(); }
    // 로그인이 안되어 있으면 index Load
    Eval.recentList(function(err,rows){
    	res.render("index",{recentLists:rows})
    });
}

//index init 함수
exports.init = function(req,res){
	 
}

//userpage loading 함수
exports.userpage = function(req,res){
	//userpage Load
	 Eval.recentList(function(err,rows){
		    	res.render("user",{recentLists:rows})
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
				 data['evaluation']='<a href="/evaluate/'+course_array[i].subject_nm.$cd+"("+course_array[i].prof_nm.$cd+")"+'" class="btn btn-danger btn-xs" data-title="evaluate"><span class="glyphicon glyphicon-pencil"> 평가하기</span></a>'
				 dataSet.push(data);
			};
	    	
	    	//Array를  클라이언트로 전송.
			res.send(dataSet);
	    
	    }
	});
};

//evaluate 페이지 로딩 함수.
exports.evaluate = function(req,res){
	
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
	      res.render('evaluate.ejs', {
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
	/*
	db.getConnection(function(err,connection){
	   	 connection.query("insert into reply(userNo,userAlias,evalNo,replyText) values(?,?,?,?)",[req.user.userNo,req.user.alias,evaluationNo,replyText], function(err, rows){
	   		 connection.release();
	   		 if(err) alert("에러발생");
	   		 else
	   		 res.redirect('/evalView/'+evaluationNo);
	   		 
			});
	   	});
	 */
}

//evaluate_post 함수.
exports.evaluationPost = function(req,res){
	
	console.log(req.body.evaluate_message);
	//console.log(req.body.evaluate_select);
	
	var eval = new Eval(req.body);
	eval.courseDelimiter = req.params.rmnm;
	eval.user=req.user._id;
	eval.Save(function(err){
		 req.flash('evalMessage', '성공적으로 강의평을 게시했습니다.');
	     return res.redirect('/evalView/'+eval._id);
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

//passport configuration
exports.pass = function(passport){

	passport.serializeUser(function(user,done){
	    console.log('serialize');
		done(null,user);
	});
	
	passport.deserializeUser(function(user,done){
		console.log('deserialize');
		done(null,user);
	});
	
	//login
	 passport.use('local-login', 
	 new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'emailinput',
        passwordField : 'passwordinput',
        passReqToCallback : true 
    },
    function(req,email, password, done) { // callback with email and password from our form
    	
    	User.findOne({email:email},function(err,user){
    		 if (err) { return done(err); }
    	     if (!user) {
    	        return done(null, false, req.flash('loginMessage', '이메일을 잘못 입력하셨습니다.'));
    	     }
    	     if(!user.authenticate(password)){
    	    	 return done(null,false,req.flash('loginMessage', '비밀번호를 잘못 입력하셨습니다.'))
    	     }
    	     return done(null,user);
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
	        	
	        	User.findOne({email:email},function(err,user){
	        		if(err) return done(err,req.flash('signupMessage','인터넷 연결을 확인하세요'));
	        		if(user) return done(null,null,req.flash('signupMessage','이미 존재하는 아이디 입니다..'));
	        		else{
	        			
	        			/*req.body 의 field를 알아서 찾아서 mapping됨.
	        			 password field는 virtual로 정의되어 
	        			 setter를 통해 자동으로 hashed_password로 변환됨.
	        			*/
	        			var pushUser = new User(req.body);
	        			pushUser.save(function(err){
	        				if(err){
	        					return done(null,null,req.flash('signupMessage','db점검 중 입니다..'));
	        				}
	        			     req.login(user, function(err) {
	        	    	    	  if (err) return req.flash('loginMessage',"로그인하는데 실패하였습니다.");
	        	    	    	  return res.redirect('/');
	        	    	    });
	        				
	        			})
	        		}
	        		
	        	})
            })
           );
     };
         
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











