const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Schema = mongoose.Schema;
const multer = require('multer');
const path = require('path');

//ensure logged in
const { ensureAuthenticated } = require('../helpers/auth');
const medicaldata = require('../public/json/clinics.json')


// load Models
require('../models/Submit')
const Submit = mongoose.model('submit');
require('../models/User');
const User = mongoose.model('users');

//request route 
router.get('/request/', ensureAuthenticated, (req, res) => {
  var medical = medicaldata
  User.find({ _id: req.user.id })
    .populate('supervisor')
    .then(users => {
      res.render('./menu/request', {
        users: users,
        medical: medical,
      });
    })
})

//Process request form
router.post('/', ensureAuthenticated, (req, res) => {
  let errors = [];

  if (!req.body.clinic) {
    errors.push({ text: 'Please input the clinic name' });
  }
  if (!req.body.task) {
    errors.push({ text: 'Please input your outstanding tasks' });
  }
  if (!req.body.date) {
    errors.push({ text: 'Please input the date that you wish to request' });
  }

  if (errors.length > 0) {
    res.render('./menu/request', {
      errors: errors,
      clinic: req.body.clinic,
      task: req.body.task,
      date: req.body.date,
      department: req.body.department,
      supervisor: req.body.supervisor
    });
  } else {
    const newSubmission = {
      clinic: req.body.clinic,
      task: req.body.task,
      date: req.body.date,
      user: req.user.id,
      employee: req.user.id,
      mc: req.body.id
    }
    new Submit(newSubmission).save(function (err, newSubmission) {
      if (err) return res.send(err)
      User.findOne({ _id: req.user.id }, function (err, mc) {
        if (err) return (err)
        mc.mc.unshift(newSubmission)
        mc.save(function (err) {
          if (err) return (err)
          req.flash('success_msg', 'Request successfully received');
          res.redirect('./status')
        })
      })
    })
  }
})
//Delete submit
router.delete('/:id', ensureAuthenticated, (req, res) => {
  Submit.findOne({ _id: req.params.id }, function (err, remove) {
    remove.remove(req.params.id);
    remove.save();
  })
  User.findOne({mc:req.params.id},function(err, remove){
    remove.mc.remove(req.params.id);
    remove.save()
  })
    .then(() => {
      req.flash('success_msg', 'Request Removed');
      res.redirect('../status');
    })
})

//Edit Form process
router.put('/:id', ensureAuthenticated, (req, res) => {
  Submit.findOne({
    _id: req.params.id
  })
    .then(Submit => {
      Submit.clinic = req.body.clinic;
      Submit.task = req.body.task;
      Submit.date = req.body.date;
      Submit.save()
        .then(Submit => {
          req.flash('success_msg', 'Request have been edited');
          res.redirect('../status');
        })
    })
});

//Edit submit
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  var medical = medicaldata
  Submit.findOne({
    _id: req.params.id
  })
    .then(Submit => {
      if (Submit.user != req.user.id) {
        res.redirect('/status');
      } else {
        res.render('./menu/edit', {
          Submit: Submit,
          medical: medical,
        })
      };
    });
})

//set storage engine
const storage = multer.diskStorage({
  destination: './public/img/medicalCertificates/',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
})

//Initialize upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 }, //5mb limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
}).single('mcimage');

//check file type

function checkFileType(file, cb) {
  //Allowed extensions
  const filetypes = /jpeg|jpg|png|gif/;
  //check extention
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  //check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Only upload images!')
  }
}

//post image
router.post('/submit/:id', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      Submit.findOne({
        _id: req.params.id
      })
        .then(submitMedical => {
          res.render('./menu/submit', {
            errorss: err,
            submitMedical: submitMedical
          })
        })
    } else {
      if (req.file == undefined) {
        res.render('./menu/submit', {
          errorss: 'Error: No file selected'
        })
      } else {
        Submit.findOne({
          _id: req.params.id
        }).then (Submit => {
          Submit.uploadmc = req.file.filename;
          Submit.date = req.body.date;
          Submit.dateto = req.body.dateto;
          Submit.clinic = req.body.clinic;
          Submit.save()
            .then(Submit => {
              req.flash('success_msg', 'Your MC have been uploaded');
              res.redirect('/status');
        })
        });
      }
    }
  })
})

//submit MC route 
router.get('/submit/:id', ensureAuthenticated, (req, res) => {
  Submit.findOne({
    _id: req.params.id
  })
    .then(submitMedical => {
      res.render('./menu/submit', {
        submitMedical: submitMedical
      })
    })
})


module.exports = router;