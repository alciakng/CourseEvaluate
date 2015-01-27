/**
 * New node file
 */


var task = require('./controllers/task-controller.js')

exports.route = function(app,passport){

	app.get('/',task.init);
	app.get('/user/:alias',task.userpage);
	app.get('/courseLoad',task.courseLoad);
	app.get('/evaluate/:csnm/:pfnm',task.evaluate);
	app.post('/evaluation_post',task.evaluation_post);
	
	
	app.get('/authenticatepage',task.authenticatepage);
	//app.get('/login',task.login);
	//app.get('/signup',task.signup);
	
	app.post('/login',passport.authenticate('local-login',{
	    successRedirect:'/',
	    failureRedirect:'/authenticatepage',
	    failureFlash:true
	}),task.loginSession);
	
	app.post('/signup',passport.authenticate('local-signup',{
        successRedirect:'/',
        failureRedirect:'/signup',
        failureFlash:true
    }))
	
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
    app.get('/logout', function(req, res){
	    req.logout();
	    res.redirect('/');
	});
	
	
	app.get('/email_validation',task.email_validation);
	app.get('/alias_validation',task.alias_validation);
};

