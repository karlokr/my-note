var express = require('express');
var router = express.Router();
//var logic = require('../logic/user.js');
var Note = require('../models/noteModel.js');
var User = require('../models/userModel.js');

router.post('/add-note', function(req, res){
   User.findOne({_id: req.session.user.id}, function(err, user) {
      if (!user) {
         res.send("You shouldn't be here.");
      } else {
         console.log(req.body.note);
         var newNote = new Note({note: req.body.note, user: req.session.user.id});
         newNote.save().then(function(data) {
           res.send(data);
         });
      }
   })
});

router.post('/delete-note', function(req, res){
   var newUser = new User({username: req.body.uname});
   newUser.password = newUser.generateHash(req.body.psw);
   newUser.save().then(function(data) {
       res.redirect("/");
   }).catch(function(error) {
       res.send("username already exists");
   });
});


// for testing
router.get('/', function(req, res) {
   res.sendFile("/home/hoppy/hoppy-hour-node/server/html/note.html");
})

module.exports = router;
