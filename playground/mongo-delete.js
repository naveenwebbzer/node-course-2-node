const {MongoClient,ObjectID}=require('mongodb');
MongoClient.connect('mongodb://localhost:3000/mytest',(err,db)=>{
  if(err){
    return console.log('unable to connect',err);
  }
  console.log('mongodb connect sucessfully');
//deletemany
/*db.collection('user').deleteMany({name:'naveen'}).then((result)=>{
  console.log(result);
  console.log('remove sucessfully');
},(err)=>{
  console.log('unable to fetch ',err);
});
//delete insertOne
db.collection('user').deleteOne({name:'parveen'}).then((result)=>{
  console.log(result);
  console.log('remove sucesfully');
},(err)=>{
  console.log('error found');
});
*/
db.collection('user').findOneAndDelete({name:'pavan'}).then((result)=>{
  console.log(result);
  console.log('find and delete sucessfully')
},(err)=>{
  if(err){
    console.log("unable to delete ");
  }

});

//findand delete

  db.close();
});
