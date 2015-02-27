/**
 * New node file
 */

//controllers
var evalController = controllers('evalController.js');
var userController = controllers('userController.js');
var indexController = controllers('indexController.js');
var courseController = controllers('courseController.js');
var validationController = controllers('validationController.js');


//auth-middleware
var auth = require('./middlewares/auth.js');

module.exports = function(app,passport){

	//index-router
		app.get('/',indexController.index);
		
		
    //course-router		
		//load course information
		app.param('courseId',courseController.load);
		//load course list
		app.post('/course',courseController.list);
		// autocomplete
		app.get('/course',courseController.autocomplete);
	
	//user-router
		
		//load login/signup page
		app.get('/user',userController.user);
		//load notification page
		app.get('/user/notice',userController.notice);
		//delete notification
		app.delete('/user/notice/:noticeId',userController.deleteNotice);
		//login
		app.post('/login',passport.authenticate('local-login',{
		    successRedirect:'/',
		    failureRedirect:'/user',
		    failureFlash:true
		}),userController.loginSession);
		//logout
		app.get('/logout', function(req, res){
			  req.logout();
			  res.redirect('/');
			});
		//signup
		app.post('/signup',passport.authenticate('local-signup',{
	        successRedirect:'/',
	        failureRedirect:'/user#signup',
	        failureFlash:true
	    }))
    
    
    
    //Validation Router
	  //  app.get('/emailValidation',validationController.emailValidation);
	  //  app.get('/aliasValidation',validationController.aliasValidation);
		
	
	//eval-router
		app.param('id',auth.requiresLogin,evalController.load);
	
		// loading evaluation list and course.
		app.get('/eval/:courseId',auth.requiresLogin,evalController.list);
		// loading evaluation. 
		app.get('/eval/view/:id',auth.requiresLogin,evalController.view);
		// eval Edit
		app.get('/eval/edit/:id',auth.requiresLogin,evalController.get);
		app.put('/eval/edit/:id',auth.requiresLogin,evalController.edit)
		// evaluate
		app.post('/eval/:courseId',auth.requiresLogin,evalController.post);
		// comment
		app.post('/eval/:id/comment',auth.requiresLogin,evalController.comment);
	    //load average of scores
		app.get('/eval/statistics/:courseId',evalController.statistics);
	

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

