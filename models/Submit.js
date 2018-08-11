const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema

const SubmitSchema = new Schema ({
  date:{
    type: Date,
    required: true
  },
  dateto:{
    type: Date,
  },
  clinic:{
    type: String,
    required: true
  },
  user:{
    type: Schema.Types.ObjectId,
    ref:'users'
  },
  task:{
    type: String,
    require: true
  },
  uploadmc:{
    type: String,
    default: "none"
  },
  acknowledged:{
    type: Boolean,
    default: false
  },
  count:{
    type: Intl,
    default: 1
  }
});

mongoose.model('submit', SubmitSchema);