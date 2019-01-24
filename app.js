var createError  = require('http-errors');
var express      = require('express');
var path         = require('path');
var cookieParser = require('cookie-parser');
var logger       = require('morgan');
var session      = require('express-session');
var connectMongo = require('connect-mongo');
const MongoStore = connectMongo(session);
var passport     = require('passport');
var mongoose     = require('mongoose');


mongoose.connect('mongodb://localhost/blog', {useNewUrlParser: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('KeithEmersonIsTheBestKeyb0ardistOfTheWholeProgressiveRockHistory'));
app.use(express.static(path.join(__dirname, 'public')));
app.set('trust proxy', 1) // trust first proxy
// app.use(app.router);

app.use(passport.initialize());
app.use(session({
  secret: 'KeithEmersonIsTheBestKeyb0ardistOfTheWholeProgressiveRockHistory',
  resave: false,
  saveUninitialized: true,
  // cookie: { secure: true }
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}))


app.use('/', indexRouter);
app.use('/users', usersRouter);

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

module.exports = app;
