const Service = require('../models/serviceModel');
const { mongoose } = require('mongoose');
const cloudinary = require('cloudinary').v2;

const addService = async (req, res, next) => {
  try {
    const { category, serviceName, price, buyingPrice, qty, unit } = req.body;
    const imageFile = req.file;

    if (!category || !serviceName || !price || !buyingPrice ||!qty || !unit) {
      return res.json({ success: false, message: 'Missing Details' });
    }

     // Check if service with the same serviceName already exists
    const existingService = await Service.findOne({ serviceName });
    if (existingService) {
      return res.json({ success: false, message: 'Service with this name already exists' });
    }
    
    let imageUrl;

    if (imageFile) {
      // upload image to cloudinary if file exists
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
      imageUrl = imageUpload.secure_url;
    }

    const service = {
      category,
      serviceName,
      price,
      buyingPrice,
      qty,
      unit,
    };

    if (imageUrl) {
      service.image = imageUrl;
    }

    const newService = new Service(service);
    await newService.save();

    res.json({ success: true, message: 'New Service Added', data: newService });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


const updateService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { category, serviceName, price, buyingPrice, qty, unit } = req.body;
    let imageUrl;

    // If a new image was uploaded
    if (req.file) {
      const imageUpload = await cloudinary.uploader.upload(req.file.path, { resource_type: "image" });
      imageUrl = imageUpload.secure_url;
    }

    const updateData = {
      category,
      serviceName,
      price,
      buyingPrice,
      qty,
      unit
    };

    // Only add image to update if a new one was uploaded
    if (imageUrl) {
      updateData.image = imageUrl;
    }

    const updatedService = await Service.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedService) {
      return res.json({ success: false, message: 'Service not found' });
    }

    res.json({ success: true, message: 'Item updated successfully', service: updatedService });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};



const getServices = async (req, res, next) => {
    try {
        const { category, search, sort = '-createdAt', page = 1, limit = 10 } = req.body;

        // Build query more efficiently
        const query = {};
        
        if (category && category !== 'all') {
            query.category = category;
        }
        
        if (search) {
            query.$or = [
                { category: { $regex: search, $options: 'i' } },
                { serviceName: { $regex: search, $options: 'i' } }
            ];
        }

        // Optimize sort options
        const sortOptions = {
            '-createdAt': { createdAt: -1 },
            'createdAt': { createdAt: 1 },
            'serviceName': { serviceName: 1 },
            '-serviceName': { serviceName: -1 },
            'category': { category: 1 }
        };

        const sortOption = sortOptions[sort] || { createdAt: -1 };

        // Execute count and find in parallel
        const [total, services] = await Promise.all([
            Service.countDocuments(query),
            Service.find(query)
                .sort(sortOption)
                .skip((page - 1) * limit)
                .limit(Number(limit))
                .lean() // Use lean() for faster queries
        ]);

        res.status(200).json({
            success: true,
            message: 'Services fetched successfully',
            data: services,
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


const removeService = async(req, res, next) => {
    try {

        await Service.findByIdAndDelete(req.body.id)
        res.json({ success: true, message : 'Selected item removed Successfully' })
    
    } catch (error) {
        console.log(error)
        res.json({success:false, message: error.message });
    }

}



//exports.updateQuantities = async (req, res) => {
const updateBuyQuantities = async(req, res) => {  
    try {
    const { items } = req.body;
    for (const { id, quantity } of items) {
      await Service.findByIdAndUpdate(id, { $inc: { qty: +quantity } }); // subtract purchased qty
    }
    res.status(200).json({ success: true, message: 'Quantities updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateSaleQuantities = async(req, res) => {  
    try {
    const { items } = req.body;
    for (const { id, quantity } of items) {
      await Service.findByIdAndUpdate(id, { $inc: { qty: -quantity } }); // subtract purchased qty
    }
    res.status(200).json({ success: true, message: 'Quantities updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


module.exports = { addService, getServices, removeService, updateBuyQuantities, updateSaleQuantities 
  , updateService
}