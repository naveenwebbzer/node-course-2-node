//const MongoClient=require('mongodb').MongoClient;
const {MongoClient}=require('mongodb');
var user={name:'Andrew',address:'Delhi'};
var {name}=user;
console.log(name);
MongoClient.connect('mongodb://localhost:3000/mytest',(err,db)=>{
  if(err){
    console.log("unable to connect to mongo db server");
  }
  console.log('connect to mongo server');
    /*db.collection('user').insertOne(
     {
       _id:123,
       name:'naveen',
       lastname:'kumar',
       address:'C2/123 new bas stand Delhi'
     },(err,result)=>{
       if(err){
         console.log("unable to insertdue to",err);
       }
       console.log(JSON.stringify(result.ops,undefined,2));
     }
   );



db.collection('first').insertOne({
   text:'this is my first ',
   role:'hare kirshna',
   completed:false
 },(err1,result)=>{
   if(err1){
     console.log('unable to insert');

   }
   console.log(JSON.stringify(result.ops,undefined,2));

 });*/

  db.close();
});
