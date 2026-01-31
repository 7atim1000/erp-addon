const mongoose = require('mongoose');

const vacationSchema = new mongoose.Schema({
    vacationType :{type: String, required: true},

    employeeNo : { type: String, required: true},
    empName :{ type: String, required: true},
    contactNo: { type: String, required: true},
    email: { type: String, required: true},
    department :{ type: String, required: true},
    jobTitle :{ type: String, required: true},
    jobNo : { type: String, required: true},
    jobDate : { type: Date, required: true},
    
    vacationStart : { type: Date, required: true},
    vacationEnd : { type: Date, required: true},
    daysCount : { type: Number, required: true},

    vacationReason : { type: String, required: true},
    vacationComment: { type: String },
    vacationStatus: { type: String, required: true},

    date: { type: Date, default: Date.now()},    

}, {timestamps :true})

module.exports = mongoose.model('Vacation', vacationSchema);