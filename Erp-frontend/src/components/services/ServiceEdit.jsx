import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { api } from '../../https';
import { toast } from 'react-toastify'
import { IoCloseCircle } from 'react-icons/io5';
import { MdImage, MdCategory, MdInventory, MdAttachMoney, MdAddShoppingCart, MdProductionQuantityLimits, MdScale, MdUpdate } from "react-icons/md";

const ServiceEdit = ({ item, setIsEditItemModal, fetchItems }) => {
    const [loading, setLoading] = useState(false);
    
    const handleClose = () => {
        setIsEditItemModal(false);
    };
   
    const [category, setCategory] = useState(
        item.category?._id || item.category || ""
    );
    const [unit, setUnit] = useState(
        item.unit?._id || item.unit || ""
    );

    const [serviceName, setServiceName] = useState(item.serviceName || "");
    const [price, setPrice] = useState(item.price || "");
    const [buyingPrice, setbuyingPrice] = useState(item.buyingPrice || "");
    const [qty, setQty] = useState(item.qty || "");
    const [newImage, setNewImage] = useState(null);

    // fetch categories and units
    const [categories, setCategories] = useState([]);
    const [units, setUnits] = useState([]);

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();

            if (newImage) {
                formData.append('image', newImage);
            }

            formData.append('category', category);
            formData.append('serviceName', serviceName);
            formData.append('price', price);
            formData.append('buyingPrice', buyingPrice);
            formData.append('qty', qty);
            formData.append('unit', unit);

            const { data } = await api.put(`/api/services/${item._id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            if (data.success) {
                toast.success(data.message);
                fetchItems();
                handleClose();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    // Fetch categories and units
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch categories
                const categoriesResponse = await api.get('/api/category/');
                if (categoriesResponse.data.success) {
                    setCategories(categoriesResponse.data.categories);
                }

                // Fetch units
                const unitsResponse = await api.get('/api/units/');
                if (unitsResponse.data.success) {
                    setUnits(unitsResponse.data.units);
                }
            } catch (error) {
                toast.error(error.message);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className='bg-gradient-to-b from-white to-blue-50 rounded-xl shadow-2xl border border-blue-200 
                          w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col'
            >
                {/* Modal Header */}
                <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 to-blue-700 p-4 sm:p-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-2 rounded-lg">
                                <MdInventory className="text-white w-5 h-5" />
                            </div>
                            <div>
                                <h2 className='text-lg sm:text-xl font-bold text-white'>Update Item</h2>
                                <p className='text-blue-100 text-xs sm:text-sm'>Modify item details</p>
                            </div>
                        </div>
                        <button 
                            onClick={handleClose}
                            className='p-2 text-white hover:bg-white/20 rounded-lg transition duration-200 cursor-pointer'
                            disabled={loading}
                        >
                            <IoCloseCircle size={22} />
                        </button>
                    </div>
                </div>

                {/* Modal Body - Form */}
                <div className='flex-1 overflow-y-auto p-4 sm:p-5'>
                    <form onSubmit={onSubmitHandler}>
                        {/* Image Upload */}
                        <div className="mb-6">
                            <label className='text-sm font-medium text-gray-700 flex items-center gap-2 mb-3'>
                                <MdImage className="text-blue-600 w-4 h-4" />
                                Product Image
                            </label>
                            <div className="flex items-center gap-4 p-4 bg-white border border-blue-200 rounded-lg hover:border-blue-300 transition duration-200">
                                <label htmlFor='edit-service-img' className="cursor-pointer">
                                    <div className="relative">
                                        <img
                                            className='w-20 h-20 object-cover rounded-lg border-2 border-blue-200'
                                            src={newImage ? URL.createObjectURL(newImage) : item.image}
                                            alt="Item"
                                        />
                                        <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100 transition duration-200">
                                            <MdImage className="text-white w-6 h-6" />
                                        </div>
                                    </div>
                                </label>
                                <input
                                    onChange={(e) => setNewImage(e.target.files[0])}
                                    type='file'
                                    id='edit-service-img'
                                    className="hidden"
                                    accept="image/*"
                                />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-700">Change product image</p>
                                    <p className="text-xs text-gray-500">Click image to upload new one</p>
                                    {newImage && (
                                        <p className="text-xs text-green-600 mt-1">New image selected</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Category Selection */}
                        <div className="mb-4">
                            <label className='text-sm font-medium text-gray-700 flex items-center gap-2 mb-2'>
                                <MdCategory className="text-blue-600 w-4 h-4" />
                                Category
                            </label>
                            <div className="relative">
                                <select 
                                    className='w-full px-4 py-3 pl-10 bg-white border border-blue-200 rounded-lg 
                                             text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 
                                             focus:border-transparent transition duration-200 appearance-none'
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    required
                                    disabled={loading}
                                >
                                    {categories.map((cat) => (
                                        <option key={cat._id} value={cat.categoryName} className="text-sm">
                                            {cat.categoryName}
                                        </option>
                                    ))}
                                </select>
                                <MdCategory className='absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600' />
                            </div>
                        </div>

                        {/* Item Name */}
                        <div className="mb-4">
                            <label className='text-sm font-medium text-gray-700 flex items-center gap-2 mb-2'>
                                <MdInventory className="text-blue-600 w-4 h-4" />
                                Item Name
                            </label>
                            <div className="relative">
                                <input
                                    type='text'
                                    value={serviceName}
                                    onChange={(e) => setServiceName(e.target.value)}
                                    placeholder='Enter item name'
                                    className='w-full px-4 py-3 pl-10 bg-white border border-blue-200 rounded-lg 
                                             text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 
                                             focus:border-transparent transition duration-200'
                                    required
                                    disabled={loading}
                                />
                                <MdInventory className='absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600' />
                            </div>
                        </div>

                        {/* Sale Price and Buy Price */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            {/* Sale Price */}
                            <div>
                                <label className='text-sm font-medium text-gray-700 flex items-center gap-2 mb-2'>
                                    <MdAttachMoney className="text-green-600 w-4 h-4" />
                                    Sale Price
                                </label>
                                <div className="relative">
                                    <input
                                        type='number'
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        placeholder='Selling price'
                                        className='w-full px-4 py-3 pl-10 pr-12 bg-white border border-blue-200 rounded-lg 
                                                 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 
                                                 focus:border-transparent transition duration-200'
                                        required
                                        min="0"
                                        step="0.01"
                                        disabled={loading}
                                    />
                                    <MdAttachMoney className='absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600' />
                                    <span className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm'>
                                        AED
                                    </span>
                                </div>
                            </div>

                            {/* Buy Price */}
                            <div>
                                <label className='text-sm font-medium text-gray-700 flex items-center gap-2 mb-2'>
                                    <MdAddShoppingCart className="text-blue-600 w-4 h-4" />
                                    Buy Price
                                </label>
                                <div className="relative">
                                    <input
                                        type='number'
                                        value={buyingPrice}
                                        onChange={(e) => setbuyingPrice(e.target.value)}
                                        placeholder='Purchase price'
                                        className='w-full px-4 py-3 pl-10 pr-12 bg-white border border-blue-200 rounded-lg 
                                                 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 
                                                 focus:border-transparent transition duration-200'
                                        required
                                        min="0"
                                        step="0.01"
                                        disabled={loading}
                                    />
                                    <MdAddShoppingCart className='absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600' />
                                    <span className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm'>
                                        AED
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Quantity and Unit */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            {/* Quantity */}
                            <div>
                                <label className='text-sm font-medium text-gray-700 flex items-center gap-2 mb-2'>
                                    <MdProductionQuantityLimits className="text-blue-600 w-4 h-4" />
                                    Quantity
                                </label>
                                <div className="relative">
                                    <input
                                        type='number'
                                        value={qty}
                                        onChange={(e) => setQty(e.target.value)}
                                        placeholder='Available quantity'
                                        className='w-full px-4 py-3 pl-10 bg-white border border-blue-200 rounded-lg 
                                                 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 
                                                 focus:border-transparent transition duration-200'
                                        required
                                        min="0"
                                        disabled={loading}
                                    />
                                    <MdProductionQuantityLimits className='absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600' />
                                </div>
                            </div>

                            {/* Unit */}
                            <div>
                                <label className='text-sm font-medium text-gray-700 flex items-center gap-2 mb-2'>
                                    <MdScale className="text-blue-600 w-4 h-4" />
                                    Unit
                                </label>
                                <div className="relative">
                                    <select 
                                        className='w-full px-4 py-3 pl-10 bg-white border border-blue-200 rounded-lg 
                                                 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 
                                                 focus:border-transparent transition duration-200 appearance-none'
                                        value={unit}
                                        onChange={(e) => setUnit(e.target.value)}
                                        required
                                        disabled={loading}
                                    >
                                        {units.map((unitItem) => (
                                            <option key={unitItem._id} value={unitItem.unitName} className="text-sm">
                                                {unitItem.unitName}
                                            </option>
                                        ))}
                                    </select>
                                    <MdScale className='absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600' />
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type='submit'
                            disabled={loading || !serviceName.trim() || !price || !buyingPrice || !qty}
                            className={`w-full py-3 rounded-lg transition duration-200 cursor-pointer 
                                     font-medium text-sm flex items-center justify-center gap-2
                                     ${loading || !serviceName.trim() || !price || !buyingPrice || !qty
                                        ? 'bg-blue-400 cursor-not-allowed' 
                                        : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                                     } text-white shadow-sm hover:shadow-md`}
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    <span>Updating...</span>
                                </>
                            ) : (
                                <>
                                    <MdUpdate className="w-4 h-4" />
                                    <span>Update Item</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Cancel Button */}
                <div className="border-t border-blue-200 bg-blue-50 p-4">
                    <button
                        onClick={handleClose}
                        disabled={loading}
                        className='w-full py-2.5 bg-white border border-blue-300 text-blue-700 rounded-lg 
                                 hover:bg-blue-50 transition duration-200 cursor-pointer font-medium text-sm'
                    >
                        Cancel
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default ServiceEdit;

// import React, { useState, useEffect } from 'react'
// import { motion } from 'framer-motion'
// import { api } from '../../https';
// import { toast } from 'react-toastify'
// import { IoCloseCircle } from 'react-icons/io5';


// const ServiceEdit = ({ item, setIsEditItemModal, fetchItems }) => {
//     const handleClose = () => {
//         setIsEditItemModal(false)
//     };
   
//     const [category, setCategory] = useState(
//         item.category?._id || item.category // handles both object and string
//     );
//      const [unit, setUnit] = useState(
//         item.unit?._id || item.unit || ""
//     );

//     const [serviceName, setServiceName] = useState(item.serviceName);
//     const [price, setPrice] = useState(item.price);
//     const [buyingPrice, setbuyingPrice] = useState(item.buyingPrice);
//     const [qty, setQty] = useState(item.qty);
//     const [newImage, setNewImage] = useState(null);

//     // fetch categories and units
//     const [categories, setCategories] = useState([]);
//     const [units, setUnits] = useState([]);



//     const onSubmitHandler = async (event) => {
//         event.preventDefault();

//         try {
//             const formData = new FormData();

//             if (newImage) {
//                 formData.append('image', newImage);
//             }

//             formData.append('category', category);
//             formData.append('serviceName', serviceName);
//             formData.append('price', price);
//             formData.append('buyingPrice', buyingPrice);
//             formData.append('qty', qty);
//             formData.append('unit', unit);

//             const { data } = await api.put(`/api/services/${item._id}`, formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                 }
//             });

//             if (data.success) {
//                 toast.success(data.message);
//                 fetchItems();
//                 handleClose();
//             } else {
//                 toast.error(data.message);
//             }
//         } catch (error) {
//             toast.error(error.response?.data?.message || error.message);
//         }
//     };


//     // Fetch categories and units
//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 // Fetch categories
//                 const categoriesResponse = await api.get('/api/category/');
//                 if (categoriesResponse.data.success) {
//                     setCategories(categoriesResponse.data.categories);
//                 }

//                 // Fetch units
//                 const unitsResponse = await api.get('/api/units/');
//                 if (unitsResponse.data.success) {
//                     setUnits(unitsResponse.data.units);
//                 }
//             } catch (error) {
//                 toast.error(error.message);
//             }
//         };

//         fetchData();
//     }, []);

   

//     return (

//         <div className='fixed inset-0 bg-opacity-50 flex items-center justify-center shadow-lg/30 z-50'
//             style={{ backgroundColor: 'rgba(145, 143, 143, 0.4)' }}>
//             <motion.div
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.9 }}
//                 transition={{ durayion: 0.3, ease: 'easeInOut' }}
//                 className='bg-white p-2 rounded-lg shadow-lg/30 w-120 md:mt-5 mt-5 h-[calc(100vh)]'
//             >


//                 {/*Modal Header */}
//                 <div className="flex justify-between items-center mb-2 shadow-xl p-2">
//                     <h2 className='text-[#1a1a1a] text-md font-bold'>Update Item</h2>
//                     <button onClick={handleClose} className='rounded-xs text-[#be3e3f] hover:bg-[#be3e3f]/30 cursor-pointer
//                                 border-b border-[#be3e3f]'>
//                         <IoCloseCircle size={22} />
//                     </button>
//                 </div>


//                 {/*Modal Body*/}
//                 <form className='mt-3 space-y-6' onSubmit={onSubmitHandler}>
//                     <div className='flex items-center gap-4 mb-2'>
//                         <label htmlFor='edit-service-img'>
//                             <img
//                                 className='w-16 h-16 rounded-full cursor-pointer  p-1 border-b-3 border-sky-500 shadow-lg/30 object-cover'
//                                 src={newImage ? URL.createObjectURL(newImage) : item.image}
//                                 alt="item"
//                             />
//                         </label>
//                         <input
//                             onChange={(e) => setNewImage(e.target.files[0])}
//                             type='file'
//                             id='edit-service-img'
//                             hidden
//                         />
//                         <p className='text-xs font-semibold text-[#0ea5e9] underline'>Change image</p>
//                     </div>

//                     <div className='mt-5 flex items-center justify-between'>
//                         <label className='w-[20%] text-[#1a1a1a] block mb-2 mt-3 text-xs font-normal'>Category :</label>
//                         <div className='w-[80%] flex items-center rounded-xs p-3 bg-white shadow-xl'>
//                             <select className='w-full bg-zinc-100 h-8 rounded-xs text-xs font-normal    '
//                                 value={category}
//                                 onChange={(e) => setCategory(e.target.value)}

//                                 required
//                             >
                        
//                                 {categories.map((cat) => (

//                                     <option key={cat._id} value={cat.categoryName}>
//                                         {cat.categoryName}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>
//                     </div>

//                     <div className='flex items-center justify-between'>
//                         <label className='w-[20%] text-[#1a1a1a] block mb-2 mt-3 text-xs font-normal'>Item Name :</label>
//                         <div className='w-[80%] flex items-center rounded-xs p-3  bg-white shadow-xl'>
//                             <input
//                                 type='text'

//                                 value={serviceName}
//                                 onChange={(e) => setServiceName(e.target.value)}

//                                 placeholder='Enter Item name'
//                                 className='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none font-semibold text-sm
//                                         border-b border-yellow-700'
//                                 required
//                                 autoComplete='none'
//                             />
//                         </div>
//                     </div>


//                     <div className='flex items-center justify-between'>
//                         <label className='w-[20%] text-black block mb-2 mt-3 text-xs font-normal'>Sale Price  :</label>
//                         <div className='flex w-[80%] items-center rounded-xs p-3 bg-white shadow-xl'>
//                             <input
//                                 type='text'

//                                 value={price}
//                                 onChange={(e) => setPrice(e.target.value)}

//                                 placeholder='Enter sale price of unit'
//                                 className='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none font-semibold text-sm
//                                         border-b border-yellow-700'
//                                 required
//                                 autoComplete='none'
//                             />
//                         </div>
//                     </div>

//                     <div className='flex items-center justify-between'>
//                         <label className='w-[20%] text-black block mb-2 mt-3 text-xs font-normal'>Buy Price :</label>
//                         <div className='flex w-[80%] items-center rounded-xs p-3 bg-white shadow-xl'>
//                             <input
//                                 type='text'

//                                 value={buyingPrice}
//                                 onChange={(e) => setbuyingPrice(e.target.value)}

//                                 placeholder='Enter buy price of unit'
//                                 className='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none font-semibold text-sm
//                                         border-b border-yellow-700'
//                                 required
//                                 autoComplete='none'
//                             />
//                         </div>
//                     </div>

//                     <div className='flex items-center justify-between gap-5'>
//                         {/* <label className='w-[20%] text-[#1a1a1a] block mb-2 mt-3 text-xs font-medium'>Quantity:</label> */}
//                         <div className='w-[80%] items-center rounded-xs p-3 bg-white shadow-xl'>
//                             <input
//                                 type='text'
//                                 value={qty}
//                                 onChange={(e) => setQty(e.target.value)}

//                                 placeholder='Available Quantity'
//                                 className='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none font-semibold text-xs
//                                         border-b border-yellow-700  w-full'
//                                 required
//                                 autoComplete='none'
//                             />
//                         </div>


//                         <div className='flex w-full items-center rounded-xs p-2 bg-white shadow-lg/30'>
//                             <select className='w-full bg-zinc-100 h-8 rounded-xs text-xs font-normal'
//                                 value={unit}
//                                 onChange={(e) => setUnit(e.target.value)}
//                                 required
//                             >
//                                 {units.map((unit) => (

//                                     <option key={unit._id} value={unit.unitName}>
//                                         {unit.unitName}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>
//                     </div>

//                     <button
//                         type='submit'
//                         className='p-3 rounded-xs mt-3 py-3 text-sm bg-[#0ea5e9] text-white font-semibold 
//                             cursor-pointer '
//                     >
//                         Update Item
//                     </button>


//                 </form>

//             </motion.div>
//         </div>

       
//     );
// };


// export default ServiceEdit ;