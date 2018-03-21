var mongoose = require('mongoose');

var User = mongoose.model('User', {
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },
 name:{
    type: String,
    required: false,
    trim: true,
    minlength: 1
},
phone:{
    type: Number,
    required: true,
    trim: true,
    minlength: 1
},
age:{
     type: Number,
    required: false,
    trim: true,
    minlength: 1
}
});

module.exports = {User}
