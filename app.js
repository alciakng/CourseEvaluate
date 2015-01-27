
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path')
  , passport = require('passport')
  , flash = require('connect-flash')
  , task = require('./controllers/task-controller.js');

var app = express();

task.pass(passport);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


//req.flash를 쓰기 위한 설정. 
app.configure(function() {
	app.use(express.cookieParser('keyboard cat'));
	app.use(express.session({ cookie: { maxAge: 3600000}}));
	app.use(flash());
});


app.use(passport.initialize());
app.use(passport.session());


app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));





// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


require('./router.js').route(app,passport);


var httpServer =http.createServer(app).listen(app.get('port'), function(){
  console.log('Socket IO Server has been started');
});


require('./socket.js').socketfunction(httpServer);



