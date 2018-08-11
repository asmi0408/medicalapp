const express = require ('express');
const mongoose = require('mongoose');
const router = express.Router();

//ensure logged in
const {ensureAuthenticated} = require('../helpers/auth');

//load user model
require('../models/User');
const User = mongoose.model('users');

//profile route 
router.get('/profile/', ensureAuthenticated, (req,res) => {
  User.find({})
  .populate('supervisor')
  .then(users => {
    res.render('./menu/profile', {
      users:users
    });
  })
})

//Update profile process
router.put('/profile/:id', ensureAuthenticated, (req,res) => {
    var id2 = req.user.id;
    User.findOne({_id:req.user.supervisor}, function(err, result){
      if(err) throw (err)
      result.employee.remove(id2);
      result.save();
    })
  User.findOne({_id:req.body.supervisor}, function(err, result){
    result.employee.addToSet(req.user.id);
    result.save();
  })
  User.findOne({_id: req.user.id})
  .then(User => {
    User.name = req.body.name;
    User.email = req.body.email;
    User.department = req.body.department;
    User.supervisor = req.body.supervisor;
    User.save()
    
    .then(User => {
  
      req.flash('success_msg', 'Your profile have been updated');
      res.redirect('/menu/profile');
    })
  })
});

module.exports = router;