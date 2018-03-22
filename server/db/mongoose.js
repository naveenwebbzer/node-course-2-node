var mongoose=require('mongoose');
mongoose.Promise=global.Promise;
//var = '192.168.1.63:27017';
//mongodb://username:password@host:port/database
mongoose.connect(`mongodb://admin:admin123@192.168.1.63:27017/admin`);
//mongoose.connect(`mongodb://localhost:3000/mytest`);
module.exports={mongoose};
