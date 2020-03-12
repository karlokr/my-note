var express = require('express');
var router = express.Router();
//var logic = require('../logic/user.js');
var User = require('../models/userModel.js');

router.post('/log-in', function(req, res){
   User.findOne({username: req.body.uname}, function(err, user) {
      if (!user) {
         res.send("Invalid user");
      } else {
         if (user.validPassword(req.body.psw)) {
            req.session.user = user;
            res.redirect("/");
         } else {
            res.send("Invalid password");
         }
      }
   })
});

router.post('/register', function(req, res){
   var newUser = new User({username: req.body.uname});
   newUser.password = newUser.generateHash(req.body.psw);
   newUser.save().then(function(data) {
       res.redirect("/");
   }).catch(function(error) {
       res.send("username already exists");
   });
});


// for testing
router.get('/register', function(req, res) {
   res.sendFile("/home/hoppy/hoppy-hour-node/server/html/register.html");
})
router.get('/log-in', function(req, res) {
   res.sendFile("/home/hoppy/hoppy-hour-node/server/html/login.html");
})

module.exports = router;
