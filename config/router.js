/**
 * New node file
 */


var evalController = controllers('evalController.js');
var userController = controllers('userController.js');
var indexController = controllers('indexController.js');
var vallidationController = controllers('vallidationController.js');


module.exports = function(app,passport){

	//index-router
	app.get('/',task.ensureAuthenticated,task.userpage);
	
	app.get('/courseLoad',task.courseLoad);
	
	
	
	
	//login-signup-router
	app.get('/authenticate',task.authenticate);
	app.post('/login',passport.authenticate('local-login',{
	    successRedirect:'/',
	    failureRedirect:'/authenticate',
	    failureFlash:true
	}),task.loginSession);
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
    app.get('/email_validation',task.email_validation);
	app.get('/alias_validation',task.alias_validation);
	
	
	
	//eval-router
	app.param('id', task.load);
	//csnm은 강의명 pfnm은 교수명
	app.get('/eval/:courseDelimiter',task.evalList);
	app.get('/eval/view/:id',task.evalView);
	//rmnm(roomname)은 강의명+교수명
	app.post('/eval/:rmnm',task.evalPost);
	
	

    
    
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
	
	

	//evaluation reply
	app.post('/comment/:id',task.comment);
	
};

