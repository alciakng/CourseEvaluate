/**
 * New node file
 */

//controllers
var evalController = controllers('evalController.js');
var userController = controllers('userController.js');
var indexController = controllers('indexController.js');
var validationController = controllers('validationController.js');

//auth-middleware
var auth = require('./middlewares/auth.js');

module.exports = function(app,passport){

	//index-router
		app.get('/',indexController.index);
		app.get('/courseLoad',indexController.courseLoad);
	
	
	
	//login-signup-router
		app.get('/user',userController.user);
		app.post('/login',passport.authenticate('local-login',{
		    successRedirect:'/',
		    failureRedirect:'/authenticate',
		    failureFlash:true
		}),userController.loginSession);
		
		app.get('/logout', function(req, res){
			  req.logout();
			  res.redirect('/');
			});
		
		app.post('/signup',passport.authenticate('local-signup',{
	        successRedirect:'/',
	        failureRedirect:'/authenticate#signup',
	        failureFlash:true
	    }))
    
    
    
    //validation-router
	    app.get('/email_validation',validationController.email_validation);
		app.get('/alias_validation',validationController.alias_validation);
		
	
	
	
	//eval-router
		app.param('id',auth.requiresLogin,evalController.load);
		//csnm은 강의명 pfnm은 교수명
		app.get('/eval/:courseDelimiter',auth.requiresLogin,evalController.evalList);
		app.get('/eval/view/:id',auth.requiresLogin,evalController.evalView);
		//rmnm(roomname)은 강의명+교수명
		app.post('/eval/:rmnm',auth.requiresLogin,evalController.evalPost);
	
		//evaluation comment
		app.post('/eval/:id/comment',auth.requiresLogin,evalController.comment);
	
	

    
    
	//modal 방식으로 로그인 구현한 예제
	/*
	app.post('/login',function(req, res, next) {
	    passport.authenticate('local-login',function(err,user,info){
	        if(err){return res.send({message:req.flash('loginMessage')});}
	        if(!user){return res.send({message:req.flash('loginMessage')})}
	        req.login(user,function(err){
	            if(err){return res.send({message:req.flash('loginMessage')})}
	            res.redirect('/user/'+user.alias);
	        })
	    })(req, res, next);
	});
	
	app.post('/signup',function(req, res, next) {
        passport.authenticate('local-signup',function(err,user,info){
            if(err){return res.send({message:req.flash('signupMessage')});}
            if(!user){return res.send({message:req.flash('signupMessage')})}
            req.login(user,function(err){
                if(err){return res.send({message:req.flash('signupMessage')})}
                return res.send({message:req.flash('signupMessage')});
            })
        })(req, res, next);
    });
	*/
	
	

};

