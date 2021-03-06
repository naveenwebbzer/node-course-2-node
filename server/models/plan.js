const mongoose = require('mongoose');
const validator=require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
var PlanSchema=new mongoose.Schema(
  {

    plan_type: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      unique:false,

  },
  plan_id:{
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    default: "NA"
  },
  plane_name:{
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      default: "NA"
  },
  description:{
    type: String,
    trim: true,
    minlength: 1,
    default: "NA"
  },
  status:{
    type: Boolean,
      trim: true,
    minlength: 1,
    default: true
  },
  price:{
    type: String,
      trim: true,
    minlength: 1,
    default: "NA"
  },
  plan_mode:{
    type: String,
      trim: true,
    minlength: 1,
    default: "NA"
  },
 date: { type: Date, default: Date.now }


  }
);





PlanSchema.statics.findByID=function(_id){
 var PlanDetail=this;

 
 return PlanDetail.findById({_id}).then((plan) => {
   if (!plan) {
     return Promise.reject({ error: "Invalid Plan ID." });
   }
   return plan;

 });

};
var PlanDetail = mongoose.model('plans', PlanSchema);
module.exports = {PlanDetail}
