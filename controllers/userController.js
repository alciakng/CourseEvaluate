/**
 * New node file
 */




//authenticate 페이지 Get함수.
exports.authenticate = function(req,res){
  res.render("authenticate",{loginMessage:req.flash('loginMessage'),signupMessage:req.flash('signupMessage')});
  
}

//login시 세션설정 함수.
exports.loginSession = function(req,res){
  var thirtyDays = 30*24*60*60*1000;
  req.session.cookie.expires = new Date(Date.now() + thirtyDays);
  req.session.cookie.maxAge = thirtyDays;
}
