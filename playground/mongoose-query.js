const {ObjectID}=require('mongodb');
const {mongoose}=require('./../server/db/mongoose');
const {Todo}=require('./../server/models/todo');
var id='9ab225d742449c22b2f488e611';

if(ObjectID.isValid(id)){
  console.log('Id is not valid');

}

/*Todo.find({_id:id}).then((doc)=>{
  console.log('result are',doc);
},(err)=>{
  console.log('error',err);
});

Todo.findOne({_id:id}).then((doc)=>{
  console.log('result are',doc);
},(err)=>{
  console.log('error',err);
});
*/
Todo.findById(id).then((doc)=>{
  if(!doc){
     return console.log('not a valid id ');
  }
  console.log('result are',doc);
},(err)=>{
  console.log('error',err);
}).catch((e)=>{
  console.log(e);
});
