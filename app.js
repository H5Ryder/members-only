const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
var passport = require('passport');
var routes = require('./routes');
const connection = require('./config/database');
var favicon = require('serve-favicon')
require('dotenv').config();
const compression = require("compression");



console.log(process.env) // remove this after you've confirmed it is working


const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');


// Create the Express application
const app = express();


// Set up rate limiter: maximum of twenty requests per minute
const RateLimit = require("express-rate-limit");
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 50,
});
// Apply rate limiter to all requests
app.use(limiter);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(compression()); // Compress all routes








// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


/**
 * -------------- SESSION SETUP ----------------
 */


  app.use(session({
  secret: 'SECRET_KEY',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: connection._connectionString,
    collectionName: 'sessions' // Specify the collection name here
  }),
  cookie: { maxAge: 86400000 } // Equals 1 day
}));

app.use(passport.initialize());
app.use(passport.session());

app.use((req,res,next) => {
  console.log(req.session);
  console.log(req.user);
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

module.exports = app;
