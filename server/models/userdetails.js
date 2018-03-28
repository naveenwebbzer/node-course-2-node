const mongoose = require('mongoose');
const validator=require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
var UserDetailSchema=new mongoose.Schema(
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

  }]

  }
);





var UserDetail = mongoose.model('user_details', UserDetailSchema);

module.exports = {UserDetail}
