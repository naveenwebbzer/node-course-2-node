var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');
const _ = require('lodash');
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
const nodemailer = require('nodemailer');
var {User} = require('./models/user');
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
  User.findByEmail(body.email,).then((user) => {
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
