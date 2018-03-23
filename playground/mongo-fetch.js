const {MongoClient,ObjectID}=require('mongodb');
MongoClient.connect('mongodb://localhost:3000/mytest',(err,db)=>{
  if(err){
    return console.log('unable to connect',err);
  }
  console.log('mongodb connect sucessfully');

db.collection('user').find({name:'pavan'}).toArray().then((data)=>{
  console.log('data found');
  console.log(JSON.stringify(data,undefined,2));
},(err)=>{
  console.log('unable to fetch ',err);
});


  db.close();
});
