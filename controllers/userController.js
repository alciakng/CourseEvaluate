/**
 * New node file
 */
//mongoose 정의
var mongoose = require('mongoose');
//User모델 정의
var User = mongoose.model('User');


//user 페이지 Get함수.
exports.user = function(req,res){
  res.render("user/user",{loginMessage:req.flash('loginMessage'),signupMessage:req.flash('signupMessage')});
}

//get notices
exports.notice = function(req,res){
	  res.render("user/notice",{
		  //arrange array in time.
		  notices:req.user.notices.reverse()
	  });	
}

//delete Notice
exports.deleteNotice = function(req,res){
	  req.user.removeNotice(req.param('noticeId'),function (err) {
		if (err) req.flash('noticeMessage',"오류로 인해 삭제되지 않았습니다!");
		console.log('the sub-doc was removed');
		res.redirect('/user/notice');
	  });
}


//login시 세션설정 함수.
exports.loginSession = function(req,res){
  var thirtyDays = 30*24*60*60*1000;
  req.session.cookie.expires = new Date(Date.now() + thirtyDays);
  req.session.cookie.maxAge = thirtyDays;
}
