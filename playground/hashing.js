const {SHA256}=require('crypto-js');

var message ='i am naveen kumar';
var hash=SHA256(message).toString();
//console.log(`message: ${message}`);
//console.log(`sha string ${hash}`);

var bcrypt = require('bcryptjs');
var password="letmeinplz1";

bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(password, salt, function(err, hash) {
        // Store hash in your password DB.
    });
});
