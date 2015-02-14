/**
 * New node file
 */

//로그인 모듈
var LocalStrategy = require('passport-local').Strategy;
//mongoose 모듈 
var mongoose = require('mongoose');
//User model
var User = mongoose.model('User');

//passport configuration
module.exports = function(passport){

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
    	     return done(null,user,req.flash('loginMessage',user.alias+'님 환영합니다.'));
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