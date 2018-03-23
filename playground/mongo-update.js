const {MongoClient,ObjectID}=require('mongodb');
MongoClient.connect('mongodb://localhost:3000/mytest',(err,db)=>{
  if(err){
    return console.log('unable to connect',err);
  }
  console.log('mongodb connect sucessfully');

db.collection('user').findOneAndUpdate(
  {_id:new ObjectID('5ab1083fac65590c17d8cb57')},{
    $set:{name:'vinayKumar'},
    $inc:{age:1}

  },{
    returnOriginal:false
  }
).then((result)=>{
  console.log(result);
});



  db.close();
});
