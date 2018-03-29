var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');
const _ = require('lodash');
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
const nodemailer = require('nodemailer');
var {User} = require('./models/user');
var {CustomerType}=require('./models/custype');
var {UserDetail}=require('./models/userdetails');
var {PlanDetail}=require('./models/plan');
var {authenticate} = require('./middleware/authenticate');
var jade = require('jade');
var app = express();
var port=process.env.PORT || 27017;
app.use(bodyParser.json());
// signup users


app.post('/signup', (req, res) => {
  var body = _.pick(req.body, ['email', 'password','firstname','lastname']);
  var user = new User(body);

  user.save().then((user) => {
    //res.send(user);
return user.generateAuthToken();
}).then((token)=>{
  //for email send
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
//end for send email
  res.header('x-auth', token).send({ "message": "User register successfully.","status": "true", "response":user});
  }).catch((e) => {
    res.status(400).send({ "message": e.message,"status": false, "response":e});
  })
});

app.get('/user/check', authenticate, (req, res) => {
  res.send(req.user);
});

app.post('/user/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  //res.send(body);
  User.findByCredentials(body.email, body.password).then((user) => {
      return user.generateAuthToken().then((token) => {
        res.header('x-auth', token).send({ "message": "User login successfully.","status": "true", "response":user});
        //res.header('x-auth', token).send(user);
      });
    }).catch((e) => {
      res.status(400).send({ "message": "Invalid email and password.","status": false, "response":e});
    });
});


app.post('/user/forgot', (req, res) => {
  var body = _.pick(req.body, ['email']);
  //res.send(body);
  User.findByEmail(body.email).then((user) => {
      return user.generateAuthToken().then((token) => {
        //console.log(user.email);
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
           //var templateDir = './templates/forgot-password';
            // setup email data with unicode symbols



            let mailOptions = {
                from: '"Reset password 👻" <info@pocketwatcher.com>', // sender address
                to: user.email, // list of receivers
                subject: 'Reset password ✔', // Subject line
name:user.firstname,
                html: `<b> hello ${user.firstname} link has been send for change password</b>` // html body
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }


            });
        });
      //end for send email
      res.header('x-auth', token).send({ "message": "email has been verify.Please check email of uoyr email box.","status": "true", "response":token});
        //res.header('x-auth', token).send(user);
      });
    }).catch((e) => {
      res.status(400).send({ "message": "Invalid user email which you have provide.","status": false, "response":e});
    });
});
//
//customer type mailOptions
/*app.post('/user/cus_type333', (req, res) => {
  var body = _.pick(req.body, ['cus_type']);
  var custype = new CustomerType(body);

  custype.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});
*/
app.post('/user/cus_type', (req, res) => {
  var body = _.pick(req.body, ['cus_type']);
    var custype = new CustomerType(body);
if(body.cus_type){
  custype.save().then((doc) => {
res.send({ "message": "recoard has been insert sucessfully.","status": true, "response":doc});
  }, (e) => {
    res.status(400).send({ "message": "This Customer Type already found.","status": false, "response":e});
  });

}else{
  CustomerType.find(
    {}
  ).then((list)=>{
    //console.log(list.length > 0);
    if(!(list) || list.length < 1){
     res.status(400).send({ "message": "Recoard not found.","status": false, "response":e});
    }

     res.send({ "message": "record found .","status": "true", "response":list});
  }).catch((e) => {
    res.status(400).send({ "message": "Recoard not found.","status": false, "response":e});
  });
}


});






//  edit profile
app.post('/user/profile', (req, res) => {
  var body = _.pick(req.body, ['id','email', 'firstname','lastname','phone_no','cus_type','gender']);
  //var user = new User(body);
 console.log(body.email);
 User.findOneAndUpdate(
   {email:body.email},{
     $set:{
       firstname:body.firstname,
       lastname:body.lastname,
       phone_no:body.phone_no,
       cus_type:body.cus_type,
       gender:body.gender
       }
    },{
     returnOriginal:false
   }
 ).then((user)=>{
   if(!(user)){
    res.status(400).send({ "message": "This is not a valid email.","status": false, "response":e});
   }

    res.send({ "message": "record hass been update sucessfully .","status": "true", "response":user});
 }).catch((e) => {
   res.status(400).send({ "message": "This is not a valid email.","status": false, "response":e});
 });

});
/// user details
app.post('/user/user_details', (req, res) => {
  var body = _.pick(req.body, ['email','country', 'state','city','locality','flatNumber','postcode','isshipping']);
  var user_detail = new UserDetail(body);

  user_detail.save().then((user) => {
    res.send({"message": "Address has been save sucessfully","status": true, "response":user});
//return user.generateAuthToken();
}).catch((e) => {
    res.status(400).send({ "message": e.message,"status": false, "response":e});
  })
});
///Plan details
app.get('/plan',(req,res)=>{
 PlanDetail.aggregate(
   [
     { $sort: { "plan_id": -1 } },
     { $group : { _id : "$plan_id", plans: { $push: "$$ROOT" } } }
   ]
).then((list)=>{
  if(!(list)){
   res.status(400).send({ "message": "No Recoard Found.","status": false, "response":e});
  }

   res.send({ "message": "Plan list  .","status": "true", "response":list});
 },(e)=>{
   res.status(400).send({ "message": e.message,"status": false, "response":e});
 });
});


app.delete('/user/logout', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  });
});

/*app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((e) => {
    res.status(400).send(e);
  })
});
app.post('/todo', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todo', (req, res) => {
  Todo.find().then((todo) => {
    res.send({todo});
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todo/:id', (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findById(id).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }

    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });
});
*/

app.listen(port, () => {
  console.log(`start port is ${port}`);
});

module.exports = {app};
