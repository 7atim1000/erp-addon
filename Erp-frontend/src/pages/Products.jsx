import React, { useState, useEffect } from 'react';
import BackButton from '../components/shared/BackButton';
import { MdDeleteForever, MdOutlineAddToDrive, MdEdit, MdInventory2 } from "react-icons/md";
import { FaBox, FaTags, FaStore, FaLayerGroup, FaDollarSign, FaChartLine } from "react-icons/fa";
import { toast } from 'react-toastify';
import BottomNav from '../components/shared/BottomNav';
import { api } from '../https';
import { motion, AnimatePresence } from 'framer-motion';

const Products = () => {
    const Button = [
        { label: 'Add Product', icon: <MdOutlineAddToDrive className='text-white' size={20} />, action: 'product' }
    ];

    const [isProductModal, setIsProductModal] = useState(false);
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredList, setFilteredList] = useState([]);

    const handleProductModal = (action) => {
        if (action === 'product') setIsProductModal(true);
    };

    // Fetch products
    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/products/');

            if (response.data.success) {
                setList(response.data.products);
                setFilteredList(response.data.products);
            } else {
                toast.error(response.data.message || 'Products not found');
            }
        } catch (error) {
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Failed to fetch products');
            }
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // Search functionality
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredList(list);
        } else {
            const filtered = list.filter(product =>
                product.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.productCategory?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.productStore?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredList(filtered);
        }
    }, [searchTerm, list]);

    // Remove product
    const removeProduct = async (id) => {
        try {
            const response = await api.post('/api/products/remove', { id });

            if (response.data.success) {
                toast.success(response.data.message);
                // Update list after removal
                setList(prev => prev.filter(product => product._id !== id));
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message || 'Failed to delete product');
        }
    };

    // Calculate stats
    const totalProducts = list.length;
    const totalValue = list.reduce((sum, product) => {
        const quantity = Number(product.quantity) || 0;
        const priceBuy = Number(product.priceBuy) || 0;
        return sum + (quantity * priceBuy);
    }, 0);
    const outOfStock = list.filter(product => (Number(product.quantity) || 0) <= 0).length;

    return (
        <section className='min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 md:p-6'>
            <div className='max-w-7xl mx-auto'>
                {/* Header Section */}
                <div className='bg-white rounded-xl shadow-lg mb-6 overflow-hidden border border-blue-100'>
                    <div className='flex flex-col md:flex-row justify-between items-start md:items-center p-4 md:p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white'>
                        <div className='flex items-center gap-3 mb-4 md:mb-0'>
                            <BackButton className="text-white hover:bg-white/20" />
                            <div className='flex items-center gap-3'>
                                <div className='bg-white/20 p-2 rounded-lg'>
                                    <MdInventory2 className='text-white w-6 h-6' />
                                </div>
                                <div>
                                    <h1 className='text-xl md:text-2xl font-bold'>Products Management</h1>
                                    <p className='text-blue-100 text-sm'>Manage your inventory efficiently</p>
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto'>
                            <div className='relative w-full md:w-64'>
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className='w-full pl-10 pr-4 py-2 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50'
                                />
                                <div className='absolute left-3 top-1/2 transform -translate-y-1/2'>
                                    <svg className="w-4 h-4 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>
                            
                            <button
                                onClick={() => handleProductModal('product')}
                                className='flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition duration-200 cursor-pointer whitespace-nowrap'
                            >
                                <MdOutlineAddToDrive className='text-white w-4 h-4' />
                                <span className='text-sm font-medium'>Add Product</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
                    <div className='bg-white rounded-xl p-4 border border-blue-100 shadow-sm'>
                        <div className='flex items-center gap-3'>
                            <div className='p-2 bg-blue-100 rounded-lg'>
                                <FaBox className='w-5 h-5 text-blue-600' />
                            </div>
                            <div>
                                <p className='text-xs text-gray-500'>Total Products</p>
                                <p className='text-xl font-bold text-blue-800'>{totalProducts}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className='bg-white rounded-xl p-4 border border-blue-100 shadow-sm'>
                        <div className='flex items-center gap-3'>
                            <div className='p-2 bg-blue-100 rounded-lg'>
                                <FaLayerGroup className='w-5 h-5 text-blue-600' />
                            </div>
                            <div>
                                <p className='text-xs text-gray-500'>In Stock</p>
                                <p className='text-xl font-bold text-green-600'>{totalProducts - outOfStock}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className='bg-white rounded-xl p-4 border border-blue-100 shadow-sm'>
                        <div className='flex items-center gap-3'>
                            <div className='p-2 bg-blue-100 rounded-lg'>
                                <FaDollarSign className='w-5 h-5 text-blue-600' />
                            </div>
                            <div>
                                <p className='text-xs text-gray-500'>Total Value</p>
                                <p className='text-xl font-bold text-green-600'>{totalValue.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className='bg-white rounded-xl p-4 border border-blue-100 shadow-sm'>
                        <div className='flex items-center gap-3'>
                            <div className='p-2 bg-blue-100 rounded-lg'>
                                <FaChartLine className='w-5 h-5 text-blue-600' />
                            </div>
                            <div>
                                <p className='text-xs text-gray-500'>Out of Stock</p>
                                <p className='text-xl font-bold text-red-600'>{outOfStock}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Products Table Section */}
                <div className='bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden'>
                    <div className='p-4 md:p-6'>
                        <div className='flex items-center justify-between mb-6'>
                            <div className='flex items-center gap-2'>
                                <FaBox className='w-5 h-5 text-blue-600' />
                                <h2 className='text-lg font-semibold text-gray-800'>Product Inventory</h2>
                            </div>
                            <div className='text-sm text-gray-500'>
                                Showing {filteredList.length} of {totalProducts} products
                            </div>
                        </div>

                        {loading ? (
                            <div className='flex justify-center items-center py-12'>
                                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
                            </div>
                        ) : filteredList.length === 0 ? (
                            <div className='text-center py-12'>
                                <div className='mb-4 inline-flex p-4 bg-blue-50 rounded-full'>
                                    <FaBox className='w-12 h-12 text-blue-400' />
                                </div>
                                <h3 className='text-lg font-semibold text-gray-700 mb-2'>
                                    {searchTerm ? 'No Products Found' : 'No Products Available'}
                                </h3>
                                <p className='text-gray-500 mb-6 max-w-md mx-auto'>
                                    {searchTerm 
                                        ? 'No products match your search criteria. Try different keywords.'
                                        : 'Your product inventory is empty. Start by adding your first product to manage your inventory efficiently.'
                                    }
                                </p>
                                {!searchTerm && (
                                    <button
                                        onClick={() => handleProductModal('product')}
                                        className='inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg transition duration-200 cursor-pointer'
                                    >
                                        <MdOutlineAddToDrive className='w-4 h-4' />
                                        <span className='font-medium'>Add First Product</span>
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className='overflow-x-auto'>
                                <table className='w-full'>
                                    <thead>
                                        <tr className='bg-gradient-to-r from-blue-50 to-blue-100 text-left'>
                                            <th className='p-3 text-xs font-semibold text-blue-700 uppercase tracking-wider'>
                                                <div className='flex items-center gap-2'>
                                                    <FaBox className='w-3 h-3' />
                                                    Name
                                                </div>
                                            </th>
                                            <th className='p-3 text-xs font-semibold text-blue-700 uppercase tracking-wider'>
                                                <div className='flex items-center gap-2'>
                                                    <FaTags className='w-3 h-3' />
                                                    Category
                                                </div>
                                            </th>
                                            <th className='p-3 text-xs font-semibold text-blue-700 uppercase tracking-wider'>
                                                <div className='flex items-center gap-2'>
                                                    <FaStore className='w-3 h-3' />
                                                    Store
                                                </div>
                                            </th>
                                            <th className='p-3 text-xs font-semibold text-blue-700 uppercase tracking-wider'>Quantity</th>
                                            <th className='p-3 text-xs font-semibold text-blue-700 uppercase tracking-wider'>Buy Price</th>
                                            <th className='p-3 text-xs font-semibold text-blue-700 uppercase tracking-wider'>Sale Price</th>
                                            <th className='p-3 text-xs font-semibold text-blue-700 uppercase tracking-wider text-center'>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className='divide-y divide-blue-100'>
                                        <AnimatePresence>
                                            {filteredList.map((product, index) => (
                                                <motion.tr
                                                    key={product._id || index}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -20 }}
                                                    transition={{ duration: 0.2, delay: index * 0.05 }}
                                                    className='hover:bg-blue-50/50 transition-colors duration-150'
                                                >
                                                    <td className='p-3'>
                                                        <div className='flex items-center gap-2'>
                                                            <div className='p-1.5 bg-blue-100 rounded-md'>
                                                                <FaBox className='w-3 h-3 text-blue-600' />
                                                            </div>
                                                            <span className='font-medium text-gray-800'>{product.productName || 'N/A'}</span>
                                                        </div>
                                                    </td>
                                                    <td className='p-3'>
                                                        <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
                                                            {product.productCategory || 'Uncategorized'}
                                                        </span>
                                                    </td>
                                                    <td className='p-3 text-gray-600'>{product.productStore || 'N/A'}</td>
                                                    <td className='p-3'>
                                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${(Number(product.quantity) || 0) <= 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                                            {product.quantity || 0}
                                                        </span>
                                                    </td>
                                                    <td className='p-3 font-semibold text-gray-700'>
                                                        {product.priceBuy ? `${Number(product.priceBuy).toFixed(2)}` : '0.00'}
                                                    </td>
                                                    <td className='p-3 font-semibold text-green-600'>
                                                        {product.priceSale ? `${Number(product.priceSale).toFixed(2)}` : '0.00'}
                                                    </td>
                                                    <td className='p-3'>
                                                        <div className='flex items-center justify-center gap-2'>
                                                            <button
                                                                className='p-1.5 text-blue-600 hover:text-white hover:bg-blue-600 rounded-lg transition-all duration-200 cursor-pointer'
                                                                title="Edit Product"
                                                                onClick={() => {/* Add edit functionality here */}}
                                                            >
                                                                <MdEdit className='w-4 h-4' />
                                                            </button>
                                                            <button
                                                                className='p-1.5 text-red-500 hover:text-white hover:bg-red-500 rounded-lg transition-all duration-200 cursor-pointer'
                                                                title="Delete Product"
                                                                onClick={() => { 
                                                                    setSelectedProduct(product); 
                                                                    setDeleteModalOpen(true); 
                                                                }}
                                                            >
                                                                <MdDeleteForever className='w-4 h-4' />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </AnimatePresence>
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Section */}
                <div className='mt-6 bg-white rounded-xl shadow-lg border border-blue-100 p-4'>
                    <div className='flex flex-col md:flex-row items-center justify-between gap-4'>
                        <div className='text-sm text-gray-600'>
                            <div className='flex items-center gap-2'>
                                <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
                                <span>Total: {totalProducts} products • Inventory Value: {totalValue.toFixed(2)}</span>
                            </div>
                        </div>
                        <div className='text-xs text-gray-500'>
                            Last updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {isProductModal && (
                <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
                    {/* Add your product modal component here */}
                    <div className='bg-white rounded-lg p-6 max-w-md w-full'>
                        <h3 className='text-lg font-semibold mb-4'>Add Product (Modal Placeholder)</h3>
                        <p className='text-gray-600 mb-4'>Product add functionality will go here.</p>
                        <button 
                            onClick={() => setIsProductModal(false)}
                            className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer'
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            <BottomNav />

            <ConfirmModal
                open={deleteModalOpen}
                productName={selectedProduct?.productName}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={() => {
                    removeProduct(selectedProduct?._id);
                    setDeleteModalOpen(false);
                }}
            />
        </section>
    );
};

const ConfirmModal = ({ open, onClose, onConfirm, productName }) => {
    if (!open) return null;
    
    return (
        <div className='fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className='bg-gradient-to-b from-white to-blue-50 rounded-2xl shadow-2xl border border-blue-200 w-full max-w-md'
            >
                <div className='p-6'>
                    <div className='text-center mb-6'>
                        <div className='mb-4 inline-flex p-3 bg-red-100 rounded-full'>
                            <MdDeleteForever className='w-8 h-8 text-red-600' />
                        </div>
                        <h3 className='text-lg font-bold text-gray-800 mb-2'>Delete Product</h3>
                        <p className='text-gray-600'>
                            Are you sure you want to delete <span className='font-semibold text-red-600'>{productName}</span>?
                        </p>
                        <p className='text-sm text-gray-500 mt-2'>
                            This action cannot be undone. All product data will be permanently removed.
                        </p>
                    </div>
                    
                    <div className='flex flex-col sm:flex-row gap-3'>
                        <button
                            onClick={onClose}
                            className='flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition duration-200 cursor-pointer font-medium'
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className='flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition duration-200 cursor-pointer font-medium'
                        >
                            Delete Product
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Products;

// import React , {useState, useEffect} from 'react' 

// import BackButton from '../components/shared/BackButton';
// import { MdDeleteForever, MdOutlineAddToDrive } from "react-icons/md";
// import { LiaEditSolid } from "react-icons/lia";

// import { toast } from 'react-toastify'

// import BottomNav from '../components/shared/BottomNav';

// import { api } from '../https';


// const Products = () => {
//     const Button = [
//         { label: 'Add Product', icon: <MdOutlineAddToDrive className='text-white' size={20} />, action: 'product' }
//     ];

//     const [isProductModal, setIsProductModal] = useState(false);

//     const handleProductModal = (action) => {
//         if (action === 'product') setIsProductModal(true)
//     }

//     // fetch products - any error on .map or length check next function
//     const [list, setList] = useState([])

//     const fetchProducts = async () => {
//         try {
//             const response = await api.get('/api/products/')

//             if (response.data.success) {
//                 setList(response.data.products)
//             } else {
//                 toast.error(response.data.message || 'Product not found')
//             }

//         } catch (error) {
//             // Show backend error message if present in error.response
//             if (error.response && error.response.data && error.response.data.message) {
//                 toast.error(error.response.data.message);
//             } else {
//                 toast.error(error.message)
//             }
//             console.log(error)
//         }
//     }

//     useEffect(() => {
//         fetchProducts()
//     }, [])


//     const [deleteModalOpen, setDeleteModalOpen] = useState(false);
//     const [selectedProduct, setSelectedProduct] = useState(null);


//     // remove Products
//     const removeProduct = async (id) => {

//         try {

//             const product = await api.post('/api/products/remove', { id },)

//             if (response.data.success) {

//                 //Update the LIST after Remove
//                 toast.success(response.data.message)
//                 window.location.reload()

//             } else {
//                 toast.error(response.data.message)
//             }

//         } catch (error) {
//             console.log(error)
//             toast.error(error.message)
//         }
//     };


//     return (
//        <section className='h-[calc(100vh-5rem)] overflow-y-scroll scrollbar-hidden'>

//             <div className='flex items-center justify-between px-8 py-2'>
//                 <div className='flex items-center'>
//                     <BackButton />
//                     <h1 className='text-lg font-semibold text-[#1f1f1f]'>Products Management</h1>
//                 </div>

//                 <div className='flex items-center justify-around gap-3'>
//                     {Button.map(({ label, icon, action }) => {
//                         return (
//                             <button
//                                 onClick={() => handleProductModal(action)}
//                                 className='shadow-lg cursor-pointer bg-[#D2B48C] hover:bg-blue-600 text-white hover:text-white
//                                 px-5 py-2 rounded-lg  font-semibold text-sm flex items-center gap-2'>
//                                 {label} {icon}
//                             </button>
//                         )
//                     })}
//                 </div>

//                 {/* {isCategoryModalOpen && <CategoryAdd setIsCategoryModalOpen={setIsCategoryModalOpen} />} */}

//             </div>


//             <div className='mt-10' >

//                 <div className='overflow-x-auto mx-25'>
//                     <table className='w-[100%] text-left text-[#1a1a1a' >
//                         <thead className='bg-[#D2B48C] text-xs font-semibold text-white'>
//                             <tr>
//                                 <th className='p-2'>Name</th>
//                                 <th className='p-2'>Category</th>
//                                 <th className='p-2'>Store</th>
//                                 <th className='p-2'>Quantity</th>
//                                 <th className='p-2'>Buy price</th>
//                                 <th className='p-2'>Sale price</th>

//                                 <th className='p-1' style={{ marginRight: '0px' }}></th>
//                             </tr>
//                         </thead>

//                         <tbody>

//                             {list.length === 0
//                                 ? (<p className='ml-5 mt-5 text-xs text-red-700 flex items-start justify-start'>Your products list is empty . Start adding customers !</p>)
//                                 : list.map((product, index) => (

//                                     <tr
//                                         // key ={index}
//                                         className='border-b border-[#D2B48C] text-xs font-semibold'
//                                     >
//                                         <td className='p-2' hidden>{product._id}</td>
//                                         <td className='p-2'>{product.productName}</td>
//                                         <td className='p-2'>{product.productCategory}</td>
//                                         <td className='p-2'>{product.productStore}</td>
//                                         <td className='p-2'>{product.quantity}</td>
//                                         <td className='p-2'>{product.priceBuy}</td>
//                                         <td className='p-2'>{product.priceSale}</td>
                                     
//                                         <td className='p-1  flex flex-wrap gap-5  justify-center bg-zinc-1' style={{ marginRight: '0px' }}>

//                                             <button className={`text-red-700 cursor-pointer text-sm font-semibold `}>
//                                                 <LiaEditSolid size={20} className='w-5 h-5 text-sky-600 rounded-full' onClick={() => setIsItemEditModalOpen(true)} />
//                                             </button>



//                                             <button className={`text-red-700 cursor-pointer text-sm font-semibold`}>
//                                                 <MdDeleteForever onClick={() => { setSelectedProduct(product); setDeleteModalOpen(true); }} size={20} className='w-5 h-5 text-orange-600 rounded-full' />
//                                             </button>

                                            
// {/*                                             
//                                             {detailsButton.map(({ label, icon, action }) => {

//                                                 return (
//                                                     <button className='cursor-pointer 
//                                                     py-2 rounded-lg text-green-600 font-semibold text-sm '
//                                                         onClick={() => handleDetailsModal(customer._id, customer.customerName, action)}
//                                                     >
//                                                         {label} {icon}
//                                                     </button>
//                                                 )
//                                             })} */}


//                                             {/* {paymentButton.map(({ label, icon, action }) => {

//                                                 return (
//                                                     <button className='cursor-pointer 
//                                     py-2 rounded-lg text-sky-500 text-xs font-semibold text-sm flex items-center gap-2'
//                                                         onClick={() => handlePaymentModal(customer._id, customer.customerName, customer.balance, action)}
//                                                     >
//                                                         {label} {icon}
//                                                     </button>
//                                                 )
//                                             })} */}



//                                         </td>



//                                     </tr>
//                                 ))}


//                         </tbody>
//                     </table>

//                 </div>

//                 {/* {isDetailsModal && <DetailsModal setIsDetailsModal={setIsDetailsModal} />}
//                 {isPaymentModal && <CustomerPayment setIsPaymentModal={setIsPaymentModal} />} */}

//             </div>

//             <BottomNav />

//             {/* Place the ConfirmModal here */}

//             <ConfirmModal

//                 open ={deleteModalOpen}
//                 productName ={selectedProduct?.productName}
//                 onClose ={() => setDeleteModalOpen(false)}
              
//                 onConfirm ={() => {
//                     removeProduct(selectedProduct._id);
//                     setDeleteModalOpen(false);
//                 }}
//             />


//         </section>
//     );
// };



// // You can put this at the bottom of your Services.jsx file or in a separate file
// const ConfirmModal = ({ open, onClose, onConfirm, productName }) => {
//   if (!open) return null;
//   return (
//        <div
//       className="fixed inset-0 flex items-center justify-center z-50"
//       style={{ backgroundColor: 'rgba(243, 216, 216, 0.4)' }}  //rgba(0,0,0,0.4)
//     >
      
//       <div className="bg-white rounded-lg p-6 shadow-lg min-w-[300px]">
//         {/* <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2> */}
//         <p className="mb-6">Are you sure you want to remove <span className="font-semibold text-red-600">{productName}</span>?</p>
//         <div className="flex justify-end gap-3">
//           <button
//             className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 cursor-pointer"
//             onClick={onClose}
//           >
//             Cancel
//           </button>
//           <button
//             className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 cursor-pointer"
//             onClick={onConfirm}
//           >
//             Delete
//           </button>
//         </div>
//       </div>

//     </div>
//   );
// };


// export default Products ;