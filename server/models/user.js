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
      minlength: 1
  },
  lastname:{
    type: String,
    required: true,
    trim: true,
    minlength: 1
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

  }]

  }
);
UserSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email','firstname','lastname','password','tokens']);
};


UserSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

  user.tokens.push({access, token});

  return user.save().then(() => {
    nodemailer.createTestAccount((err, account) => {

        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: 'sourcesoft.developer@gmail.com', // generated ethereal user
                pass: '!!#$124><RTTq1' // generated ethereal password
            },

        });

        // setup email data with unicode symbols
        let mailOptions = {
            from: '"Register 👻" <info@pocketwatcher.com>', // sender address
            to: user.email, // list of receivers
            subject: 'Register ✔', // Subject line
            text: 'Register Message ', // plain text body
            html: '<b>Hello user thanks for register we will touch you soon.</b>' // html body
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }


        });
    });
   return token;
  });
};
UserSchema.statics.findByToken = function (token) {
  var User = this;
  var decoded;

  try {
    decoded = jwt.verify(token, 'abc123');
  } catch (e) {
    return Promise.reject();
  }

  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};

UserSchema.statics.findByCredentials = function (email, password) {
  var User = this;

  return User.findOne({email}).then((user) => {
    if (!user) {
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
      // Use bcrypt.compare to compare password and user.password
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          resolve(user);
        } else {
          reject();
        }
      });
    });
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
