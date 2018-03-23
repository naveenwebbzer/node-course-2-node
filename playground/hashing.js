const {SHA256}=require('crypto-js');

var message ='i am naveen kumar';
var hash=SHA256(message).toString();
console.log(`message: ${message}`);
console.log(`sha string ${hash}`);
