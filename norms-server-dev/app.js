require('dotenv').config();
let createError = require('http-errors');
let express = require('express');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
const cors = require('cors');

let indexRouter = require('./routes/index');
let responseUtil = require('./util/response')
const log = require('./winston/logger').logger('AppJS');
const systemConf = require('./conf/systemConf');
let {handlerOverView} = require('./util/interval')

let app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


const corsOptions = {
  origin: (origin, callback) => {
    console.log("origin",origin)
    if (!origin||systemConf.whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}

app.use(cors(corsOptions));

app.use('/', indexRouter);

app.use('/favicon.ico', (req, res) => {
  res.status(204).end(); // 204 No Content
});

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
  return responseUtil.error(res, 'Server error.')
});

process.on('uncaughtException', function (e) {
	log.error(`uncaughtException`)
	log.error(e)
});
process.on('unhandledRejection', function (err, promise) {
  throw new Error(`Unhandled rejection at: ${promise} reason: ${err}`);
})

setInterval(function() {
  handlerOverView();
}, 1000*60*5);
// }, 1000*10);


module.exports = app;
