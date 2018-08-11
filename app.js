const express = require('express');
const exphbs = require ('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require ('path');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require ('passport');
const {ensureAuthenticated} = require('./helpers/auth');
const {
  formatDate,
  select,
  submitMC,
  new1,
  counting,
  bodyparts
} = require('./helpers/hbs');
const nodemailer = require('nodemailer')

const app = express();

//DB configuration file
const db = require('./config/database')

//connect to mongoose
mongoose.connect(db.mongoURI,{
  useNewUrlParser:true
})
  .then(() => console.log('mongoDB Connected...'))
  .catch(err => console.log(err));

// load Submit Model
require('./models/Submit')
const Submit = mongoose.model('submit');
require('./models/User')
const User = mongoose.model ('users')

//email settings
const transporter = nodemailer.createTransport({
  host: 'mail.privateemail.com',
  port: '465',
  secure: 'true',
  auth:{
    user: 'Private',
    pass: 'Private'
  }
})


//Handlebars middleware
app.engine('handlebars', exphbs ({
  helpers: {
    formatDate:formatDate,
    select:select,
    submitMC:submitMC,
    new1:new1,
    counting:counting,
    bodyparts:bodyparts,
},
defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//Express middleware session
app.use(session({
  secret: 'This is Asmi Project',
  resave: true,
  saveUninitialized: true,
})) 

//Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

// Method Override
app.use(methodOverride('_method'));


//passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

//Global Variables
app.use(function(req,res,next){
  res.locals.success_msg= req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
})

//load routes
const submit = require('./routes/submit');
const users = require('./routes/users');
const profile = require('./routes/profile');

//passport Config

require('./config/passport')(passport);

//index route 
app.get('/', (req,res) => {
  res.render('users/login');
});

app.get('/status/test', (req,res) => {
  User.findOne({_id:req.user.id})
  .then(test => {
    var testing = test.firsttime
    if (testing == "yes") {
      res.redirect('setup')
    } else {res.redirect('/status')}
    });
  });

//acknowledge route
app.put('/status/acknowledge/:id', ensureAuthenticated, (req,res) => {
  Submit.findOne({
    _id: req.params.id
  })
  .then(Submit => {
    Submit.acknowledged='true';
    Submit.save()
    .then(User => {
      req.flash('success_msg', 'Employee has been informed');
      res.redirect('/status');
    })
  })
});

//status route 
app.get('/status', ensureAuthenticated, (req,res) => {
  User.find({_id: req.user.id})
  .populate('mc')
  .populate('employee')
  .populate({path: 'employee', populate:{path:'mc'}})
  .populate({path: 'mc', populate:{path:'user'}})
    .then(submit => {
      res.render('status', {
        submit:submit
      })
    })
})

//Setup page for first time users
app.get('/status/setup', ensureAuthenticated, (req,res) =>{
  User.find({})
  .then(setup => {
    res.render('setup', {
      setup:setup
    })
  })
})

//Update setup page process
app.put('/status/setup/:id', ensureAuthenticated, (req,res) => {
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
  User.firsttime = "no";
  User.save()
  .then(User => {
    req.flash('success_msg', 'Your profile have been updated');
    res.redirect('/menu/profile');
  })
})
});

//Send mail
app.post('/send/:id', (req,res) => {
  Submit.findOne({_id:req.params.id})
  .populate('user')
  .then(email => {
    const emailaddress = email.user.email;
    const mailOptions = {
      from: 'admin@asmicorp.com',
      to: emailaddress,
      subject: 'A reminder to submit your MC',
      text: 'Please remember to upload your MC in the app'
    }
    transporter.sendMail(mailOptions, function(error,info){
      if (error) {
        console.log(error);
      } else {
        console.log('email sent' + info.response);
      }
    })
  })
  .then(emailsent => {
    req.flash('success_msg', 'Email has been successfully sent');
    res.redirect('/status');
    })
  })
      



// Use routes
app.use('/users', users);
app.use('/menu', submit,profile);

// Static Folder
app.use(express.static(path.join(__dirname, 'public')));

const port = process.env.PORT || 5000;

app.listen(port, () =>{
  console.log(`Server started on port ${port}`);
});