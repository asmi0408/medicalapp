const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema

const UserSchema = new Schema ({
  name:{
    type: String,
    required: true
  },
  email:{
    type: String,
    required: true
  },
  password:{
    type: String,
    require: true
  },
  date:{
    type: Date,
    default: Date.now
  },
  department:{
    type: String,
    default: "nil"
  },
  employee:[{
    type: Schema.Types.ObjectId,
    ref:'users'
  }],
  mc:[{
    type: Schema.Types.ObjectId,
    ref:'submit'
  }],
  supervisor:{
    type: Schema.Types.ObjectId,
    ref:'users'
  },
  firsttime:{
    type: String,
    default: 'yes'
  }
});

mongoose.model('users', UserSchema);