const mongoose = require('mongoose');
const validator=require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
var CustomerTypeSchema=new mongoose.Schema(
  {
    cus_type: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      unique:true,

  },
  date: { type: Date, default: Date.now }


  }
);
/*
CustomerTypeSchema.methods.toJSON = function () {
  var customer_type = this;
  var userObject = customer_type.toObject();

  return _.pick(userObject, ['_id', 'cus_type']);
};


*/





var CustomerType = mongoose.model('customer_type', CustomerTypeSchema);

module.exports = {CustomerType}
