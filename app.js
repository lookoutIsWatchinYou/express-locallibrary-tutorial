var createError = require('http-errors');
var express = require('express');
//Set up mongoose connection
var mongoose = require('mongoose');
var dev_db_url ='mongodb+srv://themat7:Madassif12345@cluster0-6jqdr.mongodb.net/local_library?retryWrites=true&w=majority';
var mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB, { useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var catalogRouter = require('./routes/catalog');  //Import routes for "catalog" area of site

var notusersRouter = require('./routes/notusers');//testing routes
var coolRouter = require('./routes/users');//this is just the module (not path for url)
var wikiRouter = require('./routes/wiki');
var aboutRouter = require('./routes/wiki');
var compression = require('compression');
var helmet = require('helmet');

//create the express app object
var app = express();

app.use(helmet());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression()); //Compress all routes
app.use(express.static(path.join(__dirname, 'public')));
//routes

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/notusers',notusersRouter);
app.use('/cool',coolRouter);//module and path
app.use('/wiki', wikiRouter);
app.use('/about', aboutRouter);
app.use('/catalog', catalogRouter);  // Add catalog routes to middleware chain.

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
console.log("hey whats "  )
module.exports = app;
