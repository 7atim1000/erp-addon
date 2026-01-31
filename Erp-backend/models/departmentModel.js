const mongoose = require ('mongoose');

const departmentSchema = new mongoose.Schema ({
  
    departmentNo : { type : String, required :[true, 'Department number is required'] } ,
    departmentName : { type : String , required :[true, 'Department name is required']},
    user : { type : mongoose.Schema.Types.ObjectId , ref : 'User'}, 
});



module.exports = mongoose.model('Department', departmentSchema);