const Storesunits = require('../models/storesunitsModel');


const addStoreUnit = async( req, res, next) => {
    try {
        
        const { storeunitNo, storeunitName } = req.body ;
        if( !storeunitNo || !storeunitName ) {
            res.status(400).json({ success :false, message :'Provide all fields please ...'})
        };

        const isStoresUnitsPresent = await Storesunits.findOne({storeunitName})
        if (isStoresUnitsPresent) {
            res.status(400).json({ success :true, message :'Sorry this Store is already exist' })
        
        } else {
            const storeUnit = { storeunitNo, storeunitName ,  user: req.body.user} ;
            const newStoreUnit = Storesunits(storeUnit);
            await newStoreUnit.save() ;
            
            res.status(200).json({ success: true, message :'New Unit added sucessfully' })
        }


    } catch (error) {
        next(error);
    }
};



const getStoresUnits = async(req, res, next) =>{

    try {
        
        const storesUnits = await Storesunits.find();
        res.status(200).json({ success: true, storesUnits, data: storesUnits, message: 'All units fetched successfully',})

    } catch (error) {
        next(error)
    }
};



const removeStoreUnit = async (req, res, next) => {
    try {

        await Storesunits.findByIdAndDelete(req.body.id)
        res.json({ success: true, message: 'Unit removed Successfully' });

    } catch (error) {
        next(error)
    }

}



module.exports = { addStoreUnit, getStoresUnits, removeStoreUnit }


