const Representative = require('../models/representativeModel')

const addRepresentative = async(req, res, next) => {
   
    // try {
        const { repName , contactNo, address , balance } = req.body;
        const representative = { repName , contactNo, address , balance }

        const newRepresentative = Representative(representative);
        await newRepresentative.save();
        res.status(200).json ({ success: true, message: 'New reperesentative added Successfully', data: newRepresentative })
        
    // } catch (error) {
        
    // }
}

const getRepresentative = async(req, res, next) => {
    
    try{

        const representative = await Representative.find();
        res.status(200).json({ success: true, message: 'All representative fetch successfully', representative, data: representative})

    }catch(error) {
        next(error)
    }
}

const removeRepresentative = async(req, res, next) => {
    try {

        await Representative.findByIdAndDelete(req.body.id)
        res.json({ success: true, message : 'Selected representative removed Successfully .' })
        
    } catch (error) {
        
    }
}


module.exports = { addRepresentative, getRepresentative, removeRepresentative }