const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();

//load User Model 
require('../models/User');
const User = mongoose.model('users');

// User login route 
router.get('/login', (req, res) => {
  res.render('./users/login');
})

// User register route 
router.get('/register', (req, res) => {
  res.render('./users/register');
})

//login form POST method
router.post('/login', (req,res,next) => {
  passport.authenticate('local', {
    failureRedirect: '/users/login',
    successRedirect:'/status/test',
    failureFlash: true
  }) (req,res,next);
});

//Register form POST method

router.post('/register', (req, res) => {
  let errors = [];
  //checking to see if the password match
  if (req.body.password != req.body.password2) {
    errors.push({ text: 'Passwords do not match' });
  }
  //the length of the password must be more than 4 characters
  if (req.body.password.length < 4) {
    errors.push({ text: 'Password must be at least 4 characters' });
  }
  if (errors.length > 0) {
    res.render('users/register', {
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2
    });
  } else {
    //validating if the email has already been registered
    User.findOne({ email: req.body.email })
      .then(user => {
        if (user) {
          req.flash('error_msg', 'Email has already been registered. Please login');
          res.redirect('/users/login')
        } else {
          const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
          })
          //encrypting the password so that the password does not store as a plaintext
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser.save()
                .then(user => {
                  req.flash('success_msg', 'You are now registered and can login');
                  res.redirect('/users/login');
                })
                .catch(err => {
                  console.log(err);
                  return;
                })
            });
          });
        }
      })
  }
});

//Logout user

router.get('/logout', (req,res) =>{
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

module.exports = router; 