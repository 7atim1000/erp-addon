const Products = require('../models/productsModel');

const addProduct = async(req, res, next) => {

    try {
      
        const { productNo, productName, productStore, productCategory, productUnit ,quantity , priceSale, priceBuy } = req.body ;
        if(!productNo || !productName || !productStore || !productCategory || !productUnit || !quantity || !priceSale || !priceBuy) {
              res.status(400).json({ success: false, message:'Please provide all fields' })
        };

        const isProductPresent = await Products.findOne({ productName })
        if (isProductPresent) {
            res.status(400).json({ status: false, message: 'Sorry this Product is already exist' });
        }

        const product = {productNo, productName, productStore, productCategory, productUnit ,quantity , priceSale, priceBuy};
        const newProduct = Products(product)
        await newProduct.save();

        res.status(200).json({ status: true, message: 'New product added Successfully', data: newProduct });
    
    } catch (error) {
        next(error);
    }
};



const getProducts = async(req, res, next) => {

    try {
        const products = await Products.find();
        res.status(200).json({ message: 'All products fetched successfully', success :true , products, data: products })
    } catch (error) {
        next(error)   
    }
};


const removeProduct = async (req, res, next) => {
    try {

        await Products.findByIdAndDelete(req.body.id)
        res.json({ success: true, message: 'Product removed Successfully' });

    } catch (error) {
        next(error)
    }

}



module.exports = { addProduct, getProducts, removeProduct }


