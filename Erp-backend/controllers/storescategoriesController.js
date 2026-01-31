const Storescategories = require('../models/storescategoriesModel') ;

const addCategory = async(req, res, next) => {
    try {
        const { storeCategoryName, storeCategoryNo } = req.body ;
        if (!storeCategoryName || !storeCategoryNo) {
            res.status(400).json({ success:false , message :'Please fill all field'})
        };

        const isCategoryNamePresent = await Storescategories.findOne({storeCategoryName}) ;
        if (isCategoryNamePresent) {
            res.status(400).json({ status :false, message :'This category name is already exist'})
        
        } else {
           const category = { storeCategoryName , storeCategoryNo,  user: req.body.user};
           const newCategory =  Storescategories(category);
           await newCategory.save();

           res.status(200).json({ status: true, message: 'New Category added Successfully', data: newCategory });
        }
    } catch (error) {
        next (error);
    }
}



const getCategories = async(req, res, next) => {

    try {
        const categories = await Storescategories.find();
        res.status(200).json({ message: 'All categories fetched successfully', success :true , categories, data: categories })
    } catch (error) {
        next(error)   
    }
};


const removeCategory = async (req, res, next) => {
    try {

        await Storescategories.findByIdAndDelete(req.body.id)
        res.json({ success: true, message: 'Category removed Successfully' });

    } catch (error) {
        next(error)
    }

}



module.exports = { addCategory, getCategories, removeCategory }


