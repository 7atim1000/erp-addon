const createHttpError = require('http-errors');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config');


const cloudinary = require('cloudinary').v2;


const register = async(req, res, next) => {
    
    try{
        
        const { name, phone, email, password } = req.body;
        const imageFile = req.file;
        
        if (!name || !phone || !email || !password ) {
            const error = createHttpError(400, 'All fields are required !');
            return next(error);
        }

        const isUserPresent = await User.findOne({email})
        if (isUserPresent) {
            const error = createHttpError(400, 'User already exist !');
            return next(error);
        }

        // Upload image to Cloudinary optional 
        let imageUrl;
        if (imageFile) {
            // upload image to cloudinary if file exists
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
            imageUrl = imageUpload.secure_url;
        }

        const user = { name, phone, email, password };

        if (imageUrl) {
            user.image = imageUrl;
        }

        const newUser = User(user);
        await newUser.save();

        res.status(201).json ({ message: 'New user created successfully .', data: newUser});

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};



const signup = async(req, res, next) => {
    
    try{
        const { employeeNo, name, phone, email, password, role, department, userJob, jobNo, jobDate } = req.body;
        const imageFile = req.file;
        
        if (!name || !phone || !email || !password || !role) {
            const error = createHttpError(400, 'All fields are required !');
            return next(error);
        }

        // Validate image exists

        // if (!imageFile) {
        //     return res.status(400).json({
        //         success: false,
        //         message: 'Please upload an user image'
        //     });
        // }
       
        const isUserPresent = await User.findOne({email})
        if (isUserPresent) {
            const error = createHttpError(400, 'User already exist !');
            return next(error);
        }

        // Upload image to Cloudinary
       
        let imageUrl;

        if (imageFile) {
            // upload image to cloudinary if file exists
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
            imageUrl = imageUpload.secure_url;
        }

        const user = { employeeNo, name, phone, email, password, role,  department, 
            userJob,
            jobNo,
            jobDate,

            // image: imageUpload.secure_url,
            // cloudinaryId: imageUpload.public_id 
        };

        if (imageUrl) {
            user.image = imageUrl;
        }

        const newUser = User(user);
        await newUser.save();

        res.status(201).json ({ message: 'New user created successfully .', data: newUser});

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}



const login = async(req, res, next) => {

        try {
            const { email, password } = req.body;

            if (!email || !password) {
                const error = createHttpError(400, 'All fields are required !');
                return next(error);
            }

            const isUserPresent = await User.findOne({email});
            if (!isUserPresent) {
                const error = createHttpError(400, 'Invalid Credentials');
                return next(error);
            }

            const isMatch = await bcrypt.compare(password, isUserPresent.password);
            if (!isMatch){
                const error = createHttpError(400, 'Invalid Credentials');
                return next(error);
            }


            // jsonwebtoken
            const accessToken = jwt.sign({_id: isUserPresent._id}, config.accessTokenSecret, {
                expiresIn : '10d'
            });

            res.cookie('accessToken', accessToken, {
                maxAge: 1000 * 60 * 60 * 24 * 30,
                httpOnly: true,
                sameSite: 'none',
                secure: true
            })

            res.status(200).json({ success: true, message: 'User login successfully ...',
                
                data: {

                    _id: isUserPresent._id,
                    name: isUserPresent.name,
                    phone: isUserPresent.phone,
                    adress: isUserPresent.address,
                    email: isUserPresent.email,
                    role: isUserPresent.role,
                    department: isUserPresent.department, // <-- must be here
                    userJob: isUserPresent.userJob    ,    // <-- must be here
                    // userSalary : isUserPresent.userSalary,
                },

                accessToken


            // data: isUserPresent, accessToken

            });

        } catch (error) {
            next(error);
        }


};


const updateProfile = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, password } = req.body;
        let imageUrl;


        // If a new image was uploaded
        if (req.file) {
            const imageUpload = await cloudinary.uploader.upload(req.file.path, { resource_type: "image" });
            imageUrl = imageUpload.secure_url;
        }

        const updateData = {name};
          // Only hash and add password if it was provided
        if (password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }

        // Only add image to update if a new one was uploaded
        if (imageUrl) {
            updateData.image = imageUrl;
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true } // Return updated doc and run validators
        ).select('-password'); // Exclude password from the returned user data

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({ success: true, message: 'Profile Updated Successfully', user: updatedUser });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};




// Get all users (admin only)
const getAllUsers = async (req, res, next) => {
    try {
        // Only admin can access all users
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "Access denied. Admin privileges required"
            });
        }

        const users = await User.find()
            .select('-password') // Exclude passwords
            .sort({ createdAt: -1 }); // Sort by newest first

        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        next(error);
    }
};



const getUserData = async (req, res, next) =>  {

    try { 
        const user = await User.findById(req.user._id)
        res.status(200).json({ success: true, data: user})
    } catch (error) {
        next(error)
    }
};

// Update user role controller
const updateUserRole = async (req, res) => {
    try {
        const { userId } = req.params;
        const { role } = req.body;

        // Validate required fields
        if (!role) {
            return res.status(400).json({
                success: false,
                message: "Role is required"
            });
        }

        // Validate role value
        const validRoles = ['admin', 'cashier', 'reject', 'refuse'];
        if (!validRoles.includes(role.toLowerCase())) {
            return res.status(400).json({
                success: false,
                message: "Invalid role. Allowed roles: admin, cashier, reject, refuse"
            });
        }

        // Find user by ID
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Check if trying to update own role (optional security measure)
        if (req.user && req.user._id.toString() === userId && role === 'reject') {
            return res.status(403).json({
                success: false,
                message: "You cannot reject your own account"
            });
        }

        // Update user role
        user.role = role.toLowerCase();
        user.updatedAt = Date.now();
        
        await user.save();

        // Log the action (optional)
        console.log(`User ${userId} role updated to ${role} by ${req.user?._id || 'system'}`);

        return res.status(200).json({
            success: true,
            message: "User role updated successfully",
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                updatedAt: user.updatedAt
            }
        });

    } catch (error) {
        console.error("Update user role error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};



const logout = async (req, res, next) => {
    try {
        // Clear the cookie
        res.clearCookie('accessToken', {
            httpOnly: true,
            sameSite: 'none',
            secure: true  // Must be true if sameSite is none
        });
   
        res.status(200).json({ 
            success: true, 
            message: "User logout successfully ..." 
        });
    } catch (error) {
        next(error);
    }
};

const updateUserSalary = async (req, res, next) => {
   
    try {

        const { userSalary } = req.body;
        const { empNo } = req.params;


        await User.findOneAndUpdate({ employeeNo : empNo }, { userSalary });
        res.status(200).json({ success: true , message: 'User salary updated successfully..'});
        
    } catch (error) {
        next(error)
    }

}


module.exports = { register, signup, login, getUserData, logout, updateUserSalary, updateProfile, updateUserRole, getAllUsers }