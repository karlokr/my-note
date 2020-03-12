var express = require('express');
var mongoose = require('mongoose');
var crypto = require('crypto');
var session = require('client-sessions');
var bodyParser = require('body-parser');
var path = require('path');
var cors = require('cors');
var userRoutes = require('./server/routes/user.js');
var noteRoutes = require('./server/routes/note.js');
var User = require('./server/models/userModel.js');
var config = require('./server/db/config.js');

const app = express();
const port = 3000;

// Middleware, etc
mongoose.Promise = Promise;
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.use(session({
  cookieName: 'session',
  secret: crypto.randomBytes(20).toString('hex'),
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));

var corsOptions = {
   origin: 'http://192.168.1.150:3000'
}

app.use(function(req, res, next) {
  if (req.session && req.session.user) {
    User.findOne({ username: req.session.user.username }, function(err, user) {
      if (user) {
        req.user = user;
        delete req.user.password;
        req.session.user = user; 
        res.locals.user = user;
      }
      next();
    });
  } else { next(); }
});

function requireLogin (req, res, next) {
  if (!req.user) {
    res.redirect('/log-in');
  } else {
    next();
  }
};

// Routes
app.use('/', userRoutes);
app.use('/', requireLogin, noteRoutes);

// Start server
mongoose.set('useCreateIndex', true);
mongoose.connect(config.database.url, {useNewUrlParser: true, useUnifiedTopology: true})
  .catch(err => console.error(err.stack))
  .then(db => {
    app.locals.mongoose = db;
    app.listen(port, () => {
      console.log(app.locals.mongoose.connection.readyState ? "Mongoose connection successful" : "Mongoose connection unsucessful");
      console.log(`Node.js app is listening at http://localhost:${port}`);
    });
});
