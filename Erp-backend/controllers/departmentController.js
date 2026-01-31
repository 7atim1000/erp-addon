const Department = require('../models/departmentModel')


const addDepartment = async(req, res, next) => {
    try {

        const { departmentNo, departmentName } = req.body ;
        if (!departmentName || !departmentNo) {
            res.status(400).json({ success: false, message:'Please provide deparment name and department number' })
        }

        const isDepartmentNamePresent = await Department.findOne({departmentName})
        if (isDepartmentNamePresent) {
            res.status(400).json({ status: false, message: 'Sorry this department is already exist' });
        
        } else {
            
            const department = { departmentNo, departmentName, user: req.body.user };
            const newDepartment = Department(department);
            await newDepartment.save();

            res.status(200).json({ status: true, message: 'Department added Successfully', data: newDepartment });
        }

    
 
    } catch (error) {
        next(error)
    }
};


const getDepartments = async (req, res, next) => {
    try {
        const departments = await Department.find();
        res.status(200).json({ message: 'All departments fetched successfully', success:true,departments, data: departments })
    } catch (error) {
        next(error)
    }
};



const removeDepartment = async (req, res, next) => {
    try {

        await Department.findByIdAndDelete(req.body.id)
        res.json({ success: true, message: 'Department removed Successfully' });

    } catch (error) {
        next(error)
    }

}



module.exports = { addDepartment, getDepartments, removeDepartment }
