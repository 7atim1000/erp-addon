const Stores = require('../models/storesModel');

const addStore = async (req, res, next) => {

    try {
         
        const { storeNo, storeName, storeLocation } = req.body ;
        if (!storeNo || !storeName || !storeLocation) {
            res.status(400).json({ status: false, message: 'Sorry please provide all fields' });
        }

        const isStorePresent = await Stores.findOne({ storeName }) ;
        if (isStorePresent) {
            res.status(400).json({ success :true, message :'Sorry this Store is already exist' })
        
        } else {
            const store = { storeNo, storeName, storeLocation, user: req.user._id } ;
            const newStore = Stores(store);
            await newStore.save(); 

            res.status(200).json({ success: true, message :'New Store added sucessfully' })
        }






    } catch (error) {
        next(error);
    }
};


const getStores = async(req, res, next) => {
    try {
        const stores = await Stores.find();
        res.status(200).json({ message: 'All stores fetched successfully', success :true , stores, data :stores })
    } catch (error) {
        next(error) ;
    };
}


const removeStore = async (req, res, next) => {
    try {

        await Stores.findByIdAndDelete(req.body.id)
        res.json({ success: true, message: 'Store removed Successfully' });

    } catch (error) {
        next(error)
    }

}



module.exports = { addStore, getStores, removeStore }


