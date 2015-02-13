/**
 * New node file
 */

//evaluate 페이지 로딩 함수.
exports.evalList = function(req,res){
	
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
	      res.render('evalList.ejs', {
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
	
}

//evaluate_post 함수.
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