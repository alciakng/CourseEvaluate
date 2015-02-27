/**
 * New node file
 */

//mongoose module
var mongoose = require('mongoose');
//Eval model
var Eval = mongoose.model('Eval');
//User model
var User = mongoose.model('User');
//builtin module(node.js)
var extend = require('util')._extend;


//get each eval by id parameter.
exports.load = function (req, res, next, id){
	  Eval.load(id, function (err, eval) {
	    if (err) return next(err);
	    if (!eval) return next(new Error('not found'));
	    req.eval = eval;
	    next();
	  });
};

//load evaluation list
exports.list = function(req,res){
	//강의 페이지 상단에 강좌-교수 정보를 표시하기 위한 변수
	  var courseId = req.course.id;
	  var page = (req.param('page') > 0 ? req.param('page') : 1) - 1;
	  var perPage = (req.param('perPage')>0? req.param('perPage') : 10);
	  
	  var options = {
	    perPage: perPage,
	    page: page,
	    criteria :{courseId : courseId}
	  };
	  
	  //keyword를 포함하는 title을 검색.
	 if(req.param('keyword')) options.criteria.title=new RegExp(req.param('keyword'), 'i');
	  
	  console.log(options.criteria);
	  
	  Eval.list(options, function (err, evals){
	    if(err) return res.render('500');
	    /*
	   var avgs =Eval.aggregate()
	   				 .group({ _id: null,
     			           avgOfDifficulty: { $avg: "$difficulty"},
       			           avgOfGrades: { $avg: "$satisfactionOfGrades"},
       			           avgOfProf: { $avg: "$satisfactionOfProf"},
       			           avgOfWork: { $avg: "$satisfactionOfWork"}})
       			     .exec(function(err,res){
       			    	 console.log(res[
       			    	 return res;
       			     });
	    
	    console.log(avgs);
	    */
	    Eval.count(options.criteria).exec(function (err, count) {
	      res.render('eval/evals', {
	        title: req.course.subject_nm,
	        courseId:req.course.id,
	        evals: evals,
	        page: page + 1,
	        pages: Math.ceil(count / perPage)
	      });
	    });
	  });
}

//load avg of scores
exports.statistics =function(req,res){
	  
	var criteria ={courseId:mongoose.Types.ObjectId(req.course.id)};
	
	Eval.loadAvgOfScores(criteria,function(err,data){
		res.send(data);
	})
}

//load evaluation
exports.view =function(req,res){
	res.render('eval/view', {
	    title: req.eval.title,
	    eval: req.eval
	  });
};
//comment
exports.comment = function(req,res){
		  var eval = req.eval;
		  //user that adds comment.
		  var user = req.user;
		  var to = req.param('to');
		  var commentId = req.param('commentId');
		  
		  
		 
		  var criteria = {
			  alias : to 
		  };
		  //add comment
		  eval.addComment(user, req.body, function (err,result) {
			//load user who posts eval or comment.  
			User.load(criteria,function(err,originalWriter){
				 /*To notify user who posts eval or comment new comment,
				  call addNotice function.
				 */
				  originalWriter.addNotice(user,"http://localhost:5000/eval/view/"+eval._id+"#"+result.comments.length);
			});
			
		    if (err) return res.render('500');
		    res.redirect('/eval/view/'+ eval.id);
		  });
}

//post eval
exports.post = function(req,res){
	
	console.log(req.body.evaluate_message);
	//console.log(req.body.evaluate_select);
	
	var eval = new Eval(req.body);
	eval.courseId = req.course._id;
	eval.user=req.user._id;
	eval.Save(function(err){
	res.redirect('/eval/'+req.course._id);
	})
}

//edit eval
exports.update = function(req,res){
	var eval= req.eval;
	
	delete req.body.user;
	
	eval = extend(eval,req.body);
	
	eval.save(function(err){
		res.redirect('/eval/view/'+eval.id);
	});
}

//get eval
exports.get = function(req,res){
	var eval = req.eval;
	res.send(eval);
}
