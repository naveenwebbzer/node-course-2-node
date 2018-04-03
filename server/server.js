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
var {transporter} = require('./db/mailer');
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

      //  var html = jade.renderFile('/var/www/html/PocketWatcher/server/template/html.jade', {username: body.firstname});
      // setup email data with unicode symbols
      let mailOptions = {
          from: '"Register 👻" <info@pocketwatcher.com>', // sender address
          to: user.email, // list of receivers
          subject: 'Register ✔', // Subject line
          html: 'Thanku for registration',
          text:'text'
         // html body
      };

      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              return console.log(error);
          }


      });

//end for send email
  res.header('x-auth', token).send({ "message": "Thank you for  registeration  successfully.An email has been send  to your register email Id.  ","status": "true", "response":user});
  }).catch((e) => {
    res.status(400).send({ "message": e.message,"status": false, "response":e});
  })
});

app.get('/user/check', authenticate, (req, res) => {
  res.send(req.user);
});


app.post('/user/checkemail',(req, res) => {
var body = _.pick(req.body, ['email']);
User.findByEmail(body.email).then((user) => {
  if(!(user) || user.length < 1){
   res.status(400).send({ "message": "Invalid user email which you have provide.","status": false, "response":e});
  }

    res.send({ "message": "User found sucessfully.","status": "true", "response":user});

  }).catch((e) => {
    res.status(400).send({ "message": "Invalid user email which you have provide.","status": false, "response":e});
  });

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

        //var html = jade.renderFile('/var/www/html/PocketWatcher/server/template/forgotpass.jade', {name: user.firstname});
      // setup email data with unicode symbols
      let mailOptions = {
          from: '"Reset password 👻" <info@pocketwatcher.com>', // sender address
          to: user.email, // list of receivers
          subject: 'Reset password ✔', // Subject line
          html: 'A link has been send your email',
          text:'text'
         // html body
      };

      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              return console.log(error);
          }


      });




      //end for send email
      res.header('x-auth', token).send({ "message": "A link has been sent to your registered email id.","status": "true", "response":token});
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
 //console.log(body.email);
 User.findOneAndUpdate(
   {email:body.email},{
     $set:{
       firstname:body.firstname,
       lastname:body.lastname,
       phone_no:body.phone_no,
       cus_type:new ObjectID(body.cus_type),
       gender:body.gender
       }
    },
     {new: true}

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
  UserDetail.findOneAndUpdate(
    {email:body.email},{
      $set:{
        country:body.country,
        state:body.state,
        city:body.city,
        locality:body.locality,
        postcode:body.postcode,
        isshipping:body.isshipping,
        }
     },
      {new: true}

  ).then((user)=>{
    if(!(user)){
     res.status(400).send({ "message": "This is not a valid email.","status": false, "response":e});
    }
    User.findOneAndUpdate({email: body.email}, {$set:{address:user._id}}, {new: true}, function(err, doc){
        if(err){
            //console.log("Something wrong when updating data!");
        }

        //console.log(doc);
    })
     res.send({ "message": "record hass been update sucessfully .","status": "true", "response":user});
  }).catch((e) => {

    user_detail.save().then((user) => {


       User.findOneAndUpdate({email: body.email}, {$set:{address:user._id}}, {new: true}, function(err, doc){
           if(err){
               //console.log("Something wrong when updating data!");
           }

           //console.log(doc);
       });

      res.send({"message": "Address has been save sucessfully","status": true, "response":user});
    //return user.generateAuthToken();
    }).catch((e) => {
      res.status(400).send({ "message": e.message,"status": false, "response":e});
    })



    //res.status(400).send({ "message": "This is not a valid email.","status": false, "response":e});
  });


  //





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
