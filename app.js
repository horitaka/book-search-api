var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors')
const Boom = require('@hapi/boom');

var indexRouter = require('./routes/index');
var librariesRouter = require('./routes/libraries');
var booksRouter = require('./routes/books');
const booksStocksRouter = require('./routes/books-stocks')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())

app.use('/', indexRouter);
app.use('/libraries', librariesRouter);
app.use('/books', booksRouter);
app.use('/books-stocks', booksStocksRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // console.log(err)

  // // set locals, only providing error in development
  // res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};

  // // render the error page
  // res.status(err.status || 500);
  // res.render('error'); 

  console.log(err)
  if (err.isBoom) {
    res.status(err.output.statusCode)
    const errorRespons = {
      ...err.output.payload,
      data: err.data,
    }
    res.json(errorRespons)
  } else {
    res.status(500)
    res.json(Boom.internal('Internal server error').output.payload);
  }

});

module.exports = app;
