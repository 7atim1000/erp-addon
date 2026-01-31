const mongoose = require('mongoose');

const salarySchema = new mongoose.Schema({

    employee :{ type :mongoose.Schema.Types.ObjectId ,ref :'Employee'},
    employeeNo :{ type : String, required :true},
    empName : { type: String, required :true},
    department :{ type :String, required :true},
    jobTitle :{ type :String, required :true},

    basicSalary :{ type: Number, required : true},
    subsistence :{ type: Number, required : true},
    housingAllowance :{ type: Number, required : true},
    depotationAllowance :{ type: Number, required : true},
    incentives :{ type: Number, required : true},

    deduction :{ type : Number, default :0 },
    finalSalary :{ type: Number, default : 0, required : true},
    expectedSalary : { type :Number, required : true }

}, {timestamps :true})



module.exports = mongoose.model('Salary', salarySchema);