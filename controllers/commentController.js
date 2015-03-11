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
	  Comment.load(id, function (err, eval) {
	    if (err) return next(err);
	    if (!eval) return next(new Error('not found'));
	    req.comment = comment;
	    next();
	  });
};
//comment to eval
exports.commentToEval = function(req,res){
		  var eval = req.eval;
		  //user that adds comment.
		  var user = req.user;
		  
		  var comment = new Comment(req.body);
		  comment.evalId = eval._id;
		  comment.user = user._id;
		  comment.Save(function(err){
			  if (err) return res.render('500');
			  res.redirect('/eval/view/'+ eval.id);
		  });
		 
}

exprots.commentToComment = function(req,res){
		var comment = req.comment;
		//user that adds comment.
		var user =req.user;
		//user receiving comment.
		var to =req.param('to');
		
		var options ={
				user : user ,
				to : to
		}	
		
		comment.addComment(options,req.body,function(err,result){
			
		    if (err) return res.render('500');
		    res.redirect('/eval/view/'+ comment.evalId);
		});
}
