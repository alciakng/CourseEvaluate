/**
 * New node file
 */
//mongoose 정의
var mongoose = require('mongoose');
//User모델 정의
var User = mongoose.model('User');

//authenticate 페이지 Get함수.
exports.user = function(req,res){
  res.render("user/user",{loginMessage:req.flash('loginMessage'),signupMessage:req.flash('signupMessage')});
}

//login시 세션설정 함수.
exports.loginSession = function(req,res){
  var thirtyDays = 30*24*60*60*1000;
  req.session.cookie.expires = new Date(Date.now() + thirtyDays);
  req.session.cookie.maxAge = thirtyDays;
}
