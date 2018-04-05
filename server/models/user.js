const mongoose = require('mongoose');
const validator=require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
var UserSchema=new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      unique:true,
      validate:{
        validator:validator.isEmail,
        message:'{value} is not a valid email'

    }
  },
  firstname:{
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      default: "NA"
  },
  lastname:{
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    default: "NA"
  },
  phone_no:{
     type:Number,
     required:false,
     trim: true,
     minlength: 6,
     default: 0

  },
  profileImage:{
    type:String,
    required:false,
    trim: true,
    minlength: 1,
    default: "NA"

  },
  cus_type:[{ type: mongoose.Schema.Types.ObjectId, ref: 'CustomerType' }],
  gender:{
     type:String,
     required:false,
     trim: true,
     minlength: 1,
     default: "NA"

  },
  password:{
      type: String,
      required: true,
      trim: true,
      minlength: 6
  },
  verify_status:{
      type: Boolean,
      default: true,


  },

  date: { type: Date, default: Date.now },
  tokens:[{
  access:{
   type:String,
   required:true
  },token:{
    type:String,
    required:true
  }

}],
address: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User_Detail' }]

  }
);

var UserDetailSchema=new mongoose.Schema(
  {


  email:{
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    default: "NA"
  },
  country:{
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    default: "NA"
  },
  state:{
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      default: "NA"
  },
  city:{
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    default: "NA"
  },
  locality:{
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    default: "NA"
  },
  flatNumber:{
     type:String,
     required:false,
     trim: true,
     minlength: 1,
     default: "NA"

  },
  postcode:{
     type:Number,
     required:false,
     trim: true,
     minlength: 6,
     default: 0

  },

  isshippingaddress:{
     type:String,
     required:false,
     trim: true,
     minlength: 1,
     default: "NA"

  },
 date: { type: Date, default: Date.now },
  tokens:[{
  access:{
   type:String,
   required:true
  },token:{
    type:String,
    required:true
  }

}],


  }
);

var User_Detail = mongoose.model('User_Detail', UserDetailSchema);
UserSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email','firstname','lastname','verify_status','phone_no','gender','cus_type','address','profileImage',
,'tokens']);
};

UserSchema.methods.removeToken = function (token) {
  var user = this;

  return user.update({
    $pull: {
      tokens: {token}
    }
  });
};
UserSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

  user.tokens.push({access, token});

  return user.save().then(() => {

   return token;
  });
};
UserSchema.statics.findByToken = function (token) {
  var User = this;
  var decoded;

  try {
    decoded = jwt.verify(token, 'abc123');
  } catch (e) {
    return Promise.reject({ error: "Invalid user email and password." });
  }

  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};

UserSchema.statics.findByCredentials = function (email, password) {
  var User = this;

  return User.findOne({email}).populate('address').then((user) => {
    if (!user) {
      return Promise.reject({ error: "Invalid user email and password." });
    }
 //console.log(user);
    return new Promise((resolve, reject) => {
      // Use bcrypt.compare to compare password and user.password
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
        // console.log(user);
          resolve(user);
        } else {
          reject({ error: "Invalid user email and password." });
        }
      });
    });
  });
};
UserSchema.statics.findByEmail=function(email){
 var User=this;
 return User.findOne({email}).then((user) => {
   if (!user) {
     return Promise.reject({ error: "Invalid user email." });
   }
   return user;

 });

};


UserSchema.pre('save', function (next) {
  var user = this;

  if (user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        console.log(hash);
        next();
      });
    });
  } else {
    next();
  }
});





var User = mongoose.model('User', UserSchema);

module.exports = {User}
