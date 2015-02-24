
/**
 * Module dependencies.
 */

//module path setting by global function
global.controllers = function(name) {
    return require(__dirname + '/controllers/' + name);
}
global.models = function(name) {
    return require(__dirname + '/models/' + name);
}
global.config = function(name) {
    return require(__dirname + '/config/' + name);
}
	
var express = require('express')
  , http = require('http')
  , path = require('path')
  , passport = require('passport')
  , flash = require('connect-flash')
  , user = models('user.js')
  , eval = models('eval.js')
  , course =models('course.js')
  , fs =require('fs')
  , mongoose =require('mongoose')
  , swig = require('swig')
  , viewHelper = require('view-helpers')
  , uriUtil =require('mongodb-uri');


//express 함수
var app = express();

//development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
//db연결.
var uristring = process.env.MONGOLAB_URI;
var options = { server: { socketOptions: { keepAlive: 1 } }};
mongoose.connect(mongooseUri, options);


mongoose.connection.on('error', console.log);
mongoose.connection.on('disconnected', connect);


// all environments
app.set('port', process.env.PORT || 5000);
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

app.configure(function() {
	app.use(express.cookieParser('keyboard cat'));
	app.use(express.session({ cookie: { maxAge: 36000000}}));
	app.use(flash());
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.static(path.join(__dirname, 'public')));
	app.use(viewHelper());
});

//passport set
config('passport.js')(passport);
//router set
config('router.js')(app,passport)


var httpServer =http.createServer(app).listen(app.get('port'), function(){
  console.log('Socket IO Server has been started');
});
//socket set
config('socket.js').socketfunction(httpServer);




