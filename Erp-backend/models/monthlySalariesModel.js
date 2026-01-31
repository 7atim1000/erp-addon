const mongoose = require('mongoose') ;

const monthlySalariesSchema = new mongoose.Schema({

    salaryNumber : { type:String, required : true },
    month : { type :String, required :true },
    salaryStatus : { type :String, required : true },
    total : { type : Number ,required :true }, 
    
    details : [],
    bills :{
        total :{ type: Number},
    },


    user : { type : mongoose.Schema.Types.ObjectId ,ref :'User'},
    date: { type: Date, default: Date.now()},

} ,{timestamps :true})


module.exports = mongoose.model('MonthlySalaries', monthlySalariesSchema)


