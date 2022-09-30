var express = require('express'),
  app = express(),
  port = process.env.PORT || 5000,
  mongoose = require('mongoose'),

  bodyParser = require('body-parser');
  var upload = require('express-fileupload');
  var cors = require('cors')
  app.use(bodyParser.urlencoded({
    extended: false
  }))
  // var backup = require('mongodb-backup');

  // parse application/json
  app.use(bodyParser.json())
  
  // mongoose.Promise = global.Promise;
  
app.use(upload());
app.use(cors({
  credentials: true,
}));
mongoose.connect('mongodb://alwaan:141516qw@ds059496.mlab.com:59496/alwaan2', {
  useNewUrlParser: true,useCreateIndex:true,
});
// mongodb://alwaan:141516qw@ds059496.mlab.com:59496/alwaan2

// var name = '';
// name = Date.now() + ".tar";
mongoose.connection.on('connected', () => {


  console.log('\x1b[36m%s\x1b[0m', 'mongo has been connected...');
});


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// var User = require('./routes/adminRouter');
// routes('/api/v1',app);

var routes = require('./routes/totalRouters');
routes('/api/v1',app);

app.use(function(req, res) {
  res.status(404).send({url: req.originalUrl + ' not found'})
});


app.listen(port);

console.log('server started on: ' + port);
