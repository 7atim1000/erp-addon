const StoresItems = require('../models/storesItemsModel');

const addStoreItem = async(req, res, next) => {
    try {
        const {storeitemName, storeCategory, store, receiptPrice, exchangePrice, quantity, unit, expireDate} = req.body;
        if (!storeitemName || !storeCategory || !store || !receiptPrice ||!exchangePrice || !quantity || !unit || !expireDate) {
            return res.status(400).json({ success:false, message :'Please fill all fields'});
        }

        const newStoreItem = new StoresItems({
            storeitemName,
            storeCategory,
            store,
            receiptPrice,
            exchangePrice,
            quantity,
            unit,
            expireDate,
            user: req.body.user,
        });
        await newStoreItem.save();
        res.status(200).json({ success: true, message :'Item added successfully', data: newStoreItem})
    
    } catch (error) {
        next(error);
    };
};

const getStoresItems = async(req, res, next) => {
    try {
    
        const { sort = '-createdAt' } = req.body;
        const items = await StoresItems.find()

        .sort(sort);
        res.status(200).json({ success: true, message: 'All items fetch successfully', items, data: items})
    
    } catch (error) {
        next(error);
    }
};

const getStoresItemsInvocie = async(req, res, next) => {
  try {

    const { search } = req.query;
    let query = {};

    if (search) {
      query = {
        $or: [
          { storeitemName: { $regex: search, $options: 'i' } }

        ]
      };
    };

    const items = await StoresItems.find(query)
    res.status(200).json({ success: true, message: 'All items fetch successfully', items, data: items })

  } catch (error) {
    next(error);
  }
};





// const getStoresItems = async (req, res, next) => {
//     try {
//         const { store } = req.query;
//         const { sort = '-createdAt' } = req.query; // Changed from req.body to req.query
        
//         // Build query object
//         const query = {};
//         if (store) {
//             query.store = store;
//         }

//         const items = await StoresItems.find(query) // Added query to find()
//             .populate('store', 'storeName')
//             .populate('user', 'name')
//             .sort(sort);

//         if (!items || items.length === 0) {
//             return res.status(404).json({ 
//                 success: false, 
//                 message: 'No items found' 
//             });
//         }
        
//         res.status(200).json({
//             success: true,
//             message: 'Items fetched successfully',
//             // count: items.length,
//             items,
//             data: items // Consistent response structure
//         });

//     } catch (error) {
//         next(error);
//     }
// };




const removeStoresItems = async (req, res, next) => {
    
    try {

        await StoresItems.findByIdAndDelete(req.body.id)
        res.json({ success: true, message: 'Selected item removed Successfully' });

    } catch (error) {
        next(error)
    }

};


//exports.updateQuantities = async (req, res) => {
const updatereceiptQuantities = async(req, res) => {  
    try {
    const { items } = req.body;
    for (const { id, qty } of items) {
        await StoresItems.findByIdAndUpdate(id, { $inc: { quantity: +qty } }); // subtract purchased qty
    }
    res.status(200).json({ success: true, message: 'Quantities updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateexchangeQuantities = async(req, res) => {  
    try {
    const { items } = req.body;
    for (const { id, qty } of items) {
      await StoresItems.findByIdAndUpdate(id, { $inc: { quantity: -qty } }); // subtract purchased qty
    }
    res.status(200).json({ success: true, message: 'Quantities updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



module.exports = { addStoreItem, getStoresItems, removeStoresItems, getStoresItemsInvocie, updatereceiptQuantities,  updateexchangeQuantities} ;