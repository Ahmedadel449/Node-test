var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');


var indexRouter   = require('./routes/index');
var usersRouter   = require('./routes/users');
var productRouter = require('./routes/products');
var orderRouter   = require('./routes/order');

var app = express();

app.use(cors());
app.use(logger('dev'));

mongoose.set('strictQuery', true)
mongoose.connect('mongodb://127.0.0.1/shopping-ApI',{useNewUrlParser : true}, (err)=>{
  if(err){
    console.log(err)
    return
  }else{
    console.log('connect to database')
  }
})

app.use(express.urlencoded({extended : true }));
app.use(express.json());

app.use(express.static(path.join(__dirname  ,'productImage' )));
app.use('/', indexRouter);
app.use('/products',productRouter);
app.use('/users', usersRouter);
app.use('/order', orderRouter);

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
  res.json({
    message : err.message
  });
});

module.exports = app;
