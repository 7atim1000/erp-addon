const mongoose = require('mongoose');

function parseTimeToMinutes(timeStr) {
    if (!timeStr) return 0;
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    if (modifier === 'PM' && hours !== 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;

    return hours * 60 + minutes;
}


const attendanceSchema = new mongoose.Schema({

    attendanceType :{ type : String, required :true },
    employeeNo :{ type: String, required :true },
    empName: { type: String, required: true },
    department: { type: String, required: true },
    jobTitle: { type: String, required: true },
    empSalary: { type: Number, required: true},

    attendanceTime: { type: String, required: true }, // e.g., "08:00 PM"

    defaultAttenTime :{ type :String , default :"08:00:00 AM"},
    defaultDepartureTime :{ type :String , default :"04:00:00 PM"},
    
    delayAttenTime : { type : Number },

    date :{ type : Date , required : true}

});



// Pre-save hook to calculate diffTime
// attendanceSchema.pre('save', function (next) {
//     this.delayAttenTime = parseTimeToMinutes(this.attendanceTime) - parseTimeToMinutes(this.defaultAttenTime);
//     next();
// });

// set difference TIME :-
attendanceSchema.pre('save', function (next) {
    if (this.attendanceType === "Attendance") {
        this.delayAttenTime = parseTimeToMinutes(this.attendanceTime) - parseTimeToMinutes(this.defaultAttenTime);

    } else if (this.attendanceType === "Departure") {
        this.delayAttenTime = parseTimeToMinutes(this.attendanceTime) - parseTimeToMinutes(this.defaultDepartureTime);
        
    } else {
        this.delayAttenTime = 0;
    }
    next();
});


module.exports = mongoose.model('Attendance', attendanceSchema);
// attendance and departure
//-------------------------------

// function parseTimeToMinutes(timeStr) {
//     // Example: "08:00 AM" or "08:00 PM"
//     const [time, modifier] = timeStr.split(' ');
//     let [hours, minutes] = time.split(':').map(Number);

//     if (modifier === 'PM' && hours !== 12) hours += 12;
//     if (modifier === 'AM' && hours === 12) hours = 0;

//     return hours * 60 + minutes;
// }

// // Usage:
// const diffMinutes = parseTimeToMinutes(attendance.time) - parseTimeToMinutes(attendance.timeDefault);


