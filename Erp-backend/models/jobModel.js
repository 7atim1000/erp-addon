const mongoose = require ('mongoose')

const jobSchema = new mongoose.Schema ({
 
    jobNo : { type : String , required : true },
    jobName : { type :String, required :true },

    user : { type : mongoose.Schema.Types.ObjectId, ref :'User' }

});

 

module.exports = mongoose.model('Job', jobSchema);