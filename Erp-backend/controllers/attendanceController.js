const Attendance = require('../models/attendanceModel')

const addAttendance = async (req, res, next) => {
    try {
        const {
            attendanceType,
            employeeNo,
            empName,
            department,
            jobTitle,
            attendanceTime,
            empSalary,
            //defaulAttentTime, 
            date
        } = req.body;

        const attendance = new Attendance({
            attendanceType,
            employeeNo,
            empName,
            department,
            jobTitle,
            attendanceTime,
            empSalary,
          //  defaultAttenTime, // can be omitted if you want to use the default
            date
        });

        await attendance.save(); // diffTime will be set by the pre-save hook

        res.status(201).json({success :true, message :'Attendance registrated successfully', data : attendance});
    } catch (error) {
        next(error);
    }
};



const getAttendance = async (req, res, next) => {
    try {
        
        const { department, empName, attendanceType, search, sort } = req.method === 'GET' ? req.query : req.body;
        
        // Base query
        const query = {
            ...(department && department !== 'all' && { department }),
            ...(empName && empName !== 'all' && { empName }),
            ...(attendanceType && attendanceType !== 'all' && { attendanceType }),
        };

        // Add search functionality if search parameter exists
        if (search) {
            query.$or = [
                { empName: { $regex: search, $options: 'i' } },
                { department: { $regex: search, $options: 'i' } },
                { attendanceType: { $regex: search, $options: 'i' } },
                // Add other fields you want to search here
            ];
        }

        console.log('attendance Query:', query);

        // Find attendance with optional sorting
        let attendanceQuery = Attendance.find(query);

        // Add sorting if requested (default: descending by date)
        if (sort === 'asc') {
            attendanceQuery = attendanceQuery.sort({ date: 1 }); // Ascending
        } else {
            attendanceQuery = attendanceQuery.sort({ date: -1 }); // Default: Descending
        }

        const attendance = await attendanceQuery.exec();

        res.status(200).json(attendance);
    } catch (error) {
        next(error);
    }
};


    // const getAttendance = async (req, res, next) => {
    //     try {
    //         const { department, empName, attendanceType } = req.method === 'GET' ? req.query : req.body;
            
    
    //         const query = {
    //             ...(department && department !== 'all' && { department }),
    //             ...(empName && empName !== 'all' && { empName }),
    //             ...(attendanceType && attendanceType !== 'all' && { attendanceType }),
    //         };
    //         console.log('attendance Query:', query);

    //         const attendance = await Attendance.find(query)

    //         res.status(200).json(attendance);
    //     } catch (error) {
    //         next(error);
    //     }
    // };



module.exports = { addAttendance, getAttendance }