const Item = require("../models/itemModel");
const cloudinary = require('cloudinary').v2;
const { mongoose } = require('mongoose');

const insertItem = async (req,res) => {

   try {

   const { name, category, price} = req.body

   const image1 =  req.files.image1 && req.files.image1[0]

    const images = [image1].filter((item)=> item !== undefined)
    let imagesUrl = await Promise.all(
        images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {resource_type:'image'});
        return result.secure_url
       })
   ) 


   const itemData = {
   name,
   category,
   price  ,
   image  : imagesUrl,

   }

   {/*console.log(productData);*/}
   const item = new Item(itemData);
   await item.save()

// generate one RES
   //res.json({success:true, message:"new car Addedd" , data: item})
   
    res.status(201).json({ success: true, message: 'Order Created!', data: item });
   

   } catch (error){
    console.log(error);
    res.json({success:false, message:error.message})
   }


}

const addItem = async(req, res, next) => {
    try {

    const { name, price, category, carNo, color } = req.body ;

    const item = { name, price, category, carNo, color }
    //const iteeem = { item, price, category } 
    const newItem = Item(item)
    await newItem.save()

    
    res.status(201).json({ success: true, message: 'New car added Successfully', data: newItem });

        
    } catch (error) {
        next(error)        
    }
}


const getAllItems = async (req, res, next) => {
    
    try {

        const items = await Item.find();
        //res.status(200).json({ message: 'All items fetched successfully', success: true, items })
        res.status(200).json({ message: 'All items fetched successfully', success: true, items, data: items })
        //res.json({ success: true, message : 'Car added Successfully' })

    } catch (error) {
        next(error)
    }
}


const removeItem = async (req, res) => {
    try {
        //const { id } = req.params;
        await Item.findByIdAndDelete(req.body.id)
        res.json({ success: true, message : 'Car removed Successfully' })
        
    } catch (error) {
        console.log(error)
        res.json({success:false, message: error.message })
   
    }
}


const updateItem = async (req, res, next) => {
   
    try {

        const { status, orderId } = req.body;
        const { id } = req.params;
    
        if (!mongoose.Types.ObjectId.isValid(id)){
            const error = createHttpError(404, "Invalid Id");
            return next(error);
        };

        const service = await Item.findByIdAndUpdate(
            id,
            
            { status, currentOrder: orderId },
            { new : true }
        );

       
        if (!service) {
            const error = createHttpError(404, 'Item is not Exist!');
            return error;
        }

        res.status(200).json({ success: true, message: 'Car status updated successfully..', data: service })
        
    } catch (error) {
        next(error)
    }

}





module.exports = { addItem, getAllItems, updateItem, removeItem, insertItem }