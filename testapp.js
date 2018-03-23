const MongoClient=require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:3000/mytest',(err,db)=>{
  if(err){
    console.log("unable to connect to mongo db server");
  }
  console.log('connect to mongo server');
 db.collection('first').insertOne({
   text:'this is my first ',
   role:'hare kirshna',
   completed:false
 },(err1,result)=>{
   if(err1){
     console.log('unable to insert');

   }
   console.log(JSON.stringify(result.ops,undefined,2));

 });

  db.close();
});
