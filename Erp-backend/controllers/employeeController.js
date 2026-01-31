const Employee = require('../models/employeeModel');
const { mongoose } = require('mongoose') ;

const cloudinary = require('cloudinary').v2;

// const employee = await Employee.create(req.body);
// res.status(201).json({
//   success: true,
//   message: 'Employee registered successfully',
//   data: employee // <-- must return the whole employee object
// });


const addEmployee = async(req, res, next) => {
    try {
        const { employeeNo, empName, contactNo, address, email, jobNo, department, empJob, jobDate } = req.body;
        const imageFile = req.file;

        // Validate required fields
        if (!employeeNo || !empName || !contactNo || !address || !email || !jobNo || !department || !empJob || !jobDate) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please provide all required employee fields' 
            });
        }

        // Validate image exists
        if (!imageFile) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please upload an employee image' 
            });
        }

        // Check if employee number already exists (better than checking name)
        const existingEmployee = await Employee.findOne({ 
            $or: [
                { employeeNo: employeeNo },
                { email: email }
            ]
        });

        if (existingEmployee) {
            let message = 'Employee with this ';
            if (existingEmployee.employeeNo === employeeNo) {
                message += 'employee number already exists';
            } else {
                message += 'email already exists';
            }
            return res.status(400).json({ 
                success: false, 
                message: message 
            });
        }

        // Upload image to Cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { 
            resource_type: "image",
            folder: "employee_images" // Good practice to organize by folder
        });

        // Create new employee
        const newEmployee = new Employee({
            employeeNo,
            empName,
            contactNo,
            address,
            email,
            jobNo,
            department,
            empJob,
            jobDate,
            image: imageUpload.secure_url,
            cloudinaryId: imageUpload.public_id // Store for future deletion
        });

        await newEmployee.save();

        res.status(201).json({ 
            success: true, 
            message: 'New employee added successfully', 
            data: newEmployee 
        });

    } catch (error) {
        // Handle Cloudinary-specific errors
        if (error.message.includes('Cloudinary')) {
            return res.status(500).json({
                success: false,
                message: 'Error uploading image to Cloudinary'
            });
        }
        next(error);
    }
};


// Update employee Controller
const updateEmployee = async(req, res, next) => {
    try {
        const { id } = req.params;
        const {  empName, contactNo, address, email, jobNo, department, empJob, jobDate } = req.body;
        let imageUrl;

        if( !empName || !contactNo || !address ||!email ||!jobNo ||!department ||!empJob ||!jobDate){
            return res.json({ success: false, message: 'Missing Details' });
        }

        // If a new image was uploaded
        if(req.file) {
            const imageUpload = await cloudinary.uploader.upload(req.file.path, {resource_type: "image"});
            imageUrl = imageUpload.secure_url;
        }

        const updateData = {
            empName,
            contactNo,
            address,
            email,
            jobNo,
            department,
            empJob,
            jobDate,
        
        };

        // Only add image to update if a new one was uploaded
        if(imageUrl) {
            updateData.image = imageUrl;
        }

        const updatedEmployee = await Employee.findByIdAndUpdate(id, updateData, { new: true });

        if(!updatedEmployee) {
            return res.json({ success: false, message: 'Employee not found' });
        }

        res.json({ success: true, message: 'Employee updated', employee: updatedEmployee });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


// const addEmployee = async(req, res, next) => {
    
//     try {
//         const { employeeNo, empName, contactNo, address, email, jobNo, department, empJob, jobDate } = req.body ;
//         const imageFile = req.file ;

//         if (!employeeNo || !empName || !contactNo || !address || !email || !jobNo || !department || !empJob ||!jobDate ){
//             res.status(400).json({ success: false, message:'Please provide  all employees fields' })
//         };

//         const isEmpNamePresent = await Employee.findOne({empName})
//             if (isEmpNamePresent) {
//             res.status(400).json({ status: false, message: 'Sorry this emplyee name is already exist' });
       
       
       
//         } else {
//             // upload image to cloudinary 
//             const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" })
//             const imageUrl = imageUpload.secure_url

//             const employee = { employeeNo, empName, contactNo, address, email, jobNo, department, empJob, jobDate,  image :imageUrl  };
//             const newEmployee = Employee(employee);
//             await newEmployee.save() ;

//             res.status(200).json({ status: true, message: 'New employee added Successfully', data: newEmployee });
//         }

      


//     } catch (error) {
//         next(error)
//     }
// }



const getEmployees  = async(req, res, next) => {
    
    try {
        
    
        const {  department, empName, search, sort = '-createdAt', page = 1, limit = 10 } = req.body;
        const query = {
            ...(department && department !== 'all' && { department }),
            ...(empName && empName !== 'all' && { empName }),
          
            ...(search && { 
                $or: [
                    { empName: { $regex: search, $options: 'i' } },
                    { department: { $regex: search, $options: 'i' } },
                    { jobNo: { $regex: search, $options: 'i' } },
                    { contactNo: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } },
                    { empJob: { $regex: search, $options: 'i' } }
                ]
            })
        };

        // In your backend (getEmployees function)
        let sortOption = {};
        if (sort === '-createdAt') {
            sortOption = { createdAt: -1 }; // Newest first
        } else if (sort === 'createdAt') {
            sortOption = { createdAt: 1 }; // Oldest first
        } else if (sort === 'empName') {
            sortOption = { empName: 1 }; // A-Z
        } else if (sort === '-empName') {
            sortOption = { empName: -1 }; // Z-A
        } else if (sort === 'department') {
            sortOption = { department: 1 }; // A-Z
        }

        // Calculate pagination values
        const startIndex = (page - 1) * limit;
        // const endIndex = page * limit;
        const total = await Employee.countDocuments(query);

        // Get paginated results
        const employees = await Employee.find(query)
            .sort(sortOption)
            .skip(startIndex)
            .limit(limit)
   
        res.status(200).json({
            message: 'All employees fetched successfully',
            success: true,
            data: employees,
            employees,

            pagination: {
                currentPage: Number(page),
                limit: Number(limit),
                total,
                totalPages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        next(error)
    }
};


const removeEmployee = async (req, res, next) => {
    try {

        await Employee.findByIdAndDelete(req.body.id)
        res.json({ success: true, message: 'Employee removed Successfully' });

    } catch (error) {
        next(error)
    }

};


const updateSalary = async (req, res, next) => {
   
    try {

        const { empSalary } = req.body;
        const { id } = req.params;


        await Employee.findByIdAndUpdate(id, { empSalary });
        res.status(200).json({ success: true , message: 'Employee salary updated successfully..'});

        // res.status(200).json({ success: true, message: 'Employee salary updated successfully..', data: employee })
        
    } catch (error) {
        next(error)
    }

}



module.exports = { addEmployee, getEmployees, removeEmployee, updateSalary, updateEmployee }