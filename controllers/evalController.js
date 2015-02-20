/**
 * New node file
 */

//mongoose 모듈 
var mongoose = require('mongoose');
//Eval모듈정의
var Eval = mongoose.model('Eval');
//User모듈 정의
var User = mongoose.model('User');
//pagination-module
var evalPage = require('pagination');


//param 함수 load 하여 next router로 넘겨준다.
exports.load = function (req, res, next, id){

	  Eval.load(id, function (err, eval) {
	    if (err) return next(err);
	    if (!eval) return next(new Error('not found'));
	    req.eval = eval;
	    next();
	  });
};

//evaluate 페이지 로딩 함수.
exports.evalList = function(req,res){
	//강의 페이지 상단에 강좌-교수 정보를 표시하기 위한 변수
	  var courseDelimiter = req.params.courseDelimiter;
	  var page = (req.param('page') > 0 ? req.param('page') : 1) - 1;
	  var perPage = 20;
	  var searchKeyword = req.param('keyword') || {}; 
	  
	  var options = {
	    perPage: perPage,
	    page: page,
	    criteria :{courseDelimiter : courseDelimiter}
	  };
	  
	  Eval.list(options, function (err, evals){
	    if(err) return res.render('500');
	    Eval.count({courseDelimiter:courseDelimiter}).exec(function (err, count) {
	      res.render('eval/evals', {
	        title: courseDelimiter,
	        evals: evals,
	        page: page + 1,
	        pages: Math.ceil(count / perPage)
	      });
	    });
	  });
}

//evaluationLoad
exports.evalView =function(req,res){
	res.render('eval/view', {
	    title: req.eval.title,
	    eval: req.eval
	  });
};
//evaluationReply
exports.comment = function(req,res){
		  var eval = req.eval;
		  //user that adds comment.
		  var user = req.user;
		  var to = req.param('to');
		  var commentId = req.param('commentId');
		  
		  
		 
		  var options = {
			 criteria: { alias : to }
		  };
		  //add comment
		  eval.addComment(user, req.body, function (err,result) {
			//load user who posts eval or comment.  
			User.load(options,function(err,preUser){
				 /*To notify user who posts eval or comment new comment,
				  call addNotice function.
				 */
				  preUser.addNotice(user,"http://localhost:3000/eval/view/"+eval._id+"#"+result.comments.length);
			});
			
		    if (err) return res.render('500');
		    res.redirect('/eval/view/'+ eval.id);
		  });
}

//evaluate_post 함수.
//evalPost
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
}