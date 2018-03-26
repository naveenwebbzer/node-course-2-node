var {User} = require('./../models/user');
var {mongoose} = require('./../db/mongoose');
var authenticate = (req, res, next) => {
  //var hhhh=user.tokens.[0].token;
  var token = req.header('x-auth');

  User.findByToken(token).then((user) => {
    res.send({user});
  }, (e) => {
    res.status(400).send(e);
  });
};

module.exports = {authenticate};
