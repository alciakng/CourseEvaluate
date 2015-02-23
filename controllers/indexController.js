/**
 * New node file
 */

//mongoose와 eval 모델 정의
var mongoose = require('mongoose');

var Eval = mongoose.model('Eval');


//로그인이 되어있는지 확인하는 함수.
exports.ensureAuthenticated= function(req, res, next) {
    // 로그인이 되어 있으면, 다음 파이프라인으로 진행
    if (req.isAuthenticated()) { return next(); }
    // 로그인이 안되어 있으면 index Load
    res.redirect('/');
}

//indexpage loading
exports.index =function(req,res){
	
	  var user = req.user || {notices:{}};
	  
	  Eval.recentList(function(err,rows){
	    	res.render("index/index",
	    	{
	    		recentLists:rows
	    	})
	    });
}

