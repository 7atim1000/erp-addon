const Vacation = require('../models/vacationModel')

const addVacation = async(req, res, next) => {
    
    try {
        const vacation = new Vacation(req.body);   
        
        await vacation.save();
        res.status(201).json({ success: true, message: 'Leave requirement sent successfuly!', data: vacation });

    } catch (error) {
        next(error);
    }
};


const getVacations = async(req, res, next) => {
    try {
        const { vacationType, vacationStatus, department, empName, search, sort, page = 1, limit = 10 } = req.body;
        // Build the query object
        const query = {
            ...(vacationType && vacationType !== 'all' && { vacationType }),
            ...(vacationStatus && vacationStatus !== 'all' && { vacationStatus }),
            ...(department && department !== 'all' && { department }),
            ...(empName && empName !== 'all' && { empName }),
          
            ...(search && { 
                $or: [
                    { vacationType: { $regex: search, $options: 'i' } },
                    { vacationStatus: { $regex: search, $options: 'i' } },
                    { empName: { $regex: search, $options: 'i' } },
                    { department: { $regex: search, $options: 'i' } },
                    { jobNo: { $regex: search, $options: 'i' } },
                    { contactNo: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } },
                    { empJob: { $regex: search, $options: 'i' } }
                ]
            })
        };


        // Sorting
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

        // pagenation 
        const startIndex = (page - 1) * limit;
        // const endIndex = page * limit;
        const total = await Vacation.countDocuments(query);

        // Get paginated results
        const vacations = await Vacation.find(query)
            .sort(sortOption)
            .skip(startIndex)
            .limit(limit)

        res.status(200).json({
            message: 'All vacations fetched successfully',
            success: true,
            data: vacations,
            vacations,

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



const updateVacation = async (req, res, next) => {
    
    try {
        const { vacationStatus } = req.body;
        const {id} = req.params;
        
        // if (!mongoose.Types.ObjectId.isValid(id)){
        //     const error = createHttpError(404, 'Invalid ID !');
        //     return next(error);
        // }

        const vacation = await Vacation.findByIdAndUpdate(
           // req.params.id,
           id,  
           {vacationStatus},
            {new: true}
        );
        
        if(!vacation){
            // const error = createHttpError(404, 'Requirement not found to update!');
            return next(error);
        }
        res.status(200).json({ success: true, message: 'Required status updated', data: vacation })

    } catch (error) {
        next(error)
    }
};


module.exports = { addVacation, getVacations, updateVacation }