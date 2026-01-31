const Salary = require('../models/salaryModel');

const addSalary = async(req, res, next) => {
    
    try {
        const salary = new Salary(req.body);   
        
        await salary.save();
        res.status(201).json({ success: true, message: 'Salary created successfuly!', data: salary });

    } catch (error) {
        next(error);
    }
};


const updateSalary = async(req, res, next) => {
    try {
        const { id } = req.params;
        const { basicSalary, subsistence, housingAllowance, depotationAllowance, incentives, deduction, finalSalary, expectedSalary } = req.body;
        

        if( !basicSalary || !subsistence || !housingAllowance ||!depotationAllowance ||!incentives ||!deduction ||!finalSalary ||!expectedSalary){
            return res.json({ success: false, message: 'Missing Details' });
        }

     
        const updateData = { basicSalary, subsistence, housingAllowance, depotationAllowance, incentives, deduction, finalSalary, expectedSalary };

        const updatedSalary = await Salary.findByIdAndUpdate(id, updateData, { new: true });

        if(!updatedSalary) {
            return res.json({ success: false, message: 'Employee not found' });
        }

        res.json({ success: true, message: 'Salary updated', salary: updatedSalary });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};





const getSalaries = async (req, res, next) => {

    try {

        const { department, empName, search, sort, page = 1, limit = 10 } = req.body;
        // Build the query object
        const query = {
            ...(department && department !== 'all' && { department }),
            ...(empName && empName !== 'all' && { empName }),
            ...(search && {
                $or: [
                    { empName: { $regex: search, $options: 'i' } },
                    { department: { $regex: search, $options: 'i' } }
                ]
            })
        };

        // Build the sort object
        let sortOption = {};
        if (sort) {
            if (sort === 'createdAt') {
                sortOption = { createdAt: -1 }; // Newest first by default
            } else if (sort === 'department') {
                sortOption = { department: 1 }; // A-Z
            } else if (sort === 'empName') {
                sortOption = { empName: 1 }; // A-Z
            }
        }


        // Calculate pagination values
        const startIndex = (page - 1) * limit;
        // const endIndex = page * limit;
        const total = await Salary.countDocuments(query);

        // Get paginated results
        const salaries = await Salary.find(query)
            .sort(sortOption)
            .skip(startIndex)
            .limit(limit)

            .populate({
                path: "employee",
                select: "contactNo address",
            });

        // Pagination result
        // const pagination = {};

        // if (endIndex < total) {
        //     pagination.next = {
        //         page: page + 1,
        //         limit
        //     };
        // }

        // if (startIndex > 0) {
        //     pagination.prev = {
        //         page: page - 1,
        //         limit
        //     };
        // }

        // In your backend code, you're sending hardcoded pagination values:
        // res.status(200).json({
        //     message: 'Salaries fetched successfully',
        //     success: true,
        //     data: salaries,
        //     salaries, 

        //     "pagination": {
        //         "currentPage": 1,
        //         "limit": 10,
        //         "total": 100,
        //         "totalPages": 10
        //     }


        // });
        res.status(200).json({
            message: 'Salaries fetched successfully',
            success: true,
            data: salaries,
            pagination: {
                currentPage: Number(page),
                limit: Number(limit),
                total,
                totalPages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        next(error);
    }
};


// const getSalaries = async (req, res, next) => {
//     try {
//         const { department, empName } = req.body;
        
//         const query = {
//             ...(department && department !== 'all' && { department }),
//             ...(empName && empName !== 'all' && { empName })
//         };

//         const salaries = await Salary.find(query)
//             .populate({
//                 path: "employee",
//                 select: "contactNo address",
//             });

//         res.status(200).json({
//             message: 'Salaries fetched successfully',
//             success: true,
//             data: salaries
//         });

//     } catch (error) {
//         next(error);
//     }
// };

const getPublicSalaries = async(req, res, next) => {
    try {
    
        const salaries = await Salary.find();
        res.status(200).json({ success: true, message: 'All salaries fetch successfully', salaries, data: salaries})
    } catch (error) {
        next(error);
    }
}


const updateDeduction = async (req, res, next) => {
   
    try {

        const { deduction, expectedSalary } = req.body;
        const { empNo } = req.params;

        await Salary.findOneAndUpdate({employeeNo : empNo}, { deduction, expectedSalary });   // empName > field ,,, name > variable 
        res.status(200).json({ success: true , message: 'Monthly deduction updated successfully..'});
        
    } catch (error) {
        next(error)
    }

}



// const getSalaries = async (req, res, next) => {
//     try {
//         const { department, empName } = req.method === 'GET' ? req.query : req.body;

//         const query = {
//             ...(department && department !== 'all' && { department }),
//             ...(empName && empName !== 'all' && { empName }),
//         };
//         console.log('Salary Query:', query);

//         const salaries = await Salary.find(query)
//             .populate({
//                 path: "employee",
//                 select: "contactNo address",
//             });

//         res.status(200).json(salaries);
//     } catch (error) {
//         next(error);
//     }
// };


module.exports = { addSalary, getSalaries, updateDeduction, getPublicSalaries }