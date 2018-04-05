const mongoose = require('mongoose');
const validator=require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
var UserPlanSchema=new mongoose.Schema(
  {

    email: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      unique:true
    },
  plan:{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    trim: true,
    minlength: 1,
    default: "NA"
  },
  plan_type:{
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      default: "NA"
  },
  plan_id:{
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    default: "NA"
  },
  plan_name:{
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    default: "NA"
  },
  description:{
     type:String,
     required:false,
     trim: true,
     minlength: 1,
     default: "NA"

  },
  status:{
     type:Boolean,
     required:false,
     trim: true,
     minlength: 6,
     default: 0

  },
  price:{
     type:String,
     required:false,
     trim: true,
     minlength: 1,
     default: "NA"

  },
  plan_mode:{
     type:String,
     required:false,
     trim: true,
     minlength: 1,
     default: "NA"

  },
 date: { type: Date, default: Date.now },
 paymentstatus:{

      type:Boolean,
      required:true,
      trim: true,
      minlength: 6,
      default: 0

   }
}
);

var UserPlan = mongoose.model('UserPlan', UserPlanSchema);





module.exports = {UserPlan}
