import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { api } from '../../https';
import { toast } from 'react-toastify'
import { IoCloseCircle } from 'react-icons/io5';
import { MdBusiness, MdEmail, MdPhone, MdLocationOn, MdAttachMoney, MdUpdate } from "react-icons/md";

const SupplierEdit = ({ supplier, setIsEditSupplierModal, fetchSuppliers }) => {
    const [loading, setLoading] = useState(false);
    
    const handleClose = () => {
        setIsEditSupplierModal(false);
    };

    // Keep the exact same state structure
    const [supplierName, setSupplierName] = useState(supplier.supplierName);
    const [email, setEmail] = useState(supplier.email);
    const [contactNo, setContactNo] = useState(supplier.contactNo);
    const [address, setAddress] = useState(supplier.address);
    const [balance, setBalance] = useState(supplier.balance);

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            // Send as JSON (removing multipart/form-data)
            const updateData = {
                supplierName,
                email,
                contactNo,
                address,
                balance
            };
            
            const { data } = await api.put(`/api/suppliers/${supplier._id}`, updateData);

            if (data.success) {
                toast.success(data.message);
                fetchSuppliers();
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

    return (
        <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
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
                                <MdBusiness className="text-white w-5 h-5" />
                            </div>
                            <div>
                                <h2 className='text-lg sm:text-xl font-bold text-white'>Update Supplier</h2>
                                <p className='text-blue-100 text-xs sm:text-sm'>Modify supplier details</p>
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
                        {/* Supplier Name */}
                        <div className="mb-4">
                            <label className='text-sm font-medium text-gray-700 flex items-center gap-2 mb-2'>
                                <MdBusiness className="text-blue-600 w-4 h-4" />
                                Supplier Name
                            </label>
                            <div className="relative">
                                <input
                                    type='text'
                                    value={supplierName}
                                    onChange={(e) => setSupplierName(e.target.value)}
                                    placeholder='Enter supplier name'
                                    className='w-full px-4 py-3 pl-10 bg-white border border-blue-200 rounded-lg 
                                             text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 
                                             focus:border-transparent transition duration-200'
                                    required
                                    autoComplete='off'
                                    disabled={loading}
                                />
                                <MdBusiness className='absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600' />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="mb-4">
                            <label className='text-sm font-medium text-gray-700 flex items-center gap-2 mb-2'>
                                <MdEmail className="text-blue-600 w-4 h-4" />
                                Email Address
                            </label>
                            <div className="relative">
                                <input
                                    type='email'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder='Enter supplier email'
                                    className='w-full px-4 py-3 pl-10 bg-white border border-blue-200 rounded-lg 
                                             text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 
                                             focus:border-transparent transition duration-200'
                                    required
                                    autoComplete='off'
                                    disabled={loading}
                                />
                                <MdEmail className='absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600' />
                            </div>
                        </div>

                        {/* Address */}
                        <div className="mb-4">
                            <label className='text-sm font-medium text-gray-700 flex items-center gap-2 mb-2'>
                                <MdLocationOn className="text-blue-600 w-4 h-4" />
                                Address
                            </label>
                            <div className="relative">
                                <input
                                    type='text'
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder='Enter supplier address'
                                    className='w-full px-4 py-3 pl-10 bg-white border border-blue-200 rounded-lg 
                                             text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 
                                             focus:border-transparent transition duration-200'
                                    required
                                    autoComplete='off'
                                    disabled={loading}
                                />
                                <MdLocationOn className='absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600' />
                            </div>
                        </div>

                        {/* Contact Number */}
                        <div className="mb-4">
                            <label className='text-sm font-medium text-gray-700 flex items-center gap-2 mb-2'>
                                <MdPhone className="text-blue-600 w-4 h-4" />
                                Contact Number
                            </label>
                            <div className="relative">
                                <input
                                    type='text'
                                    value={contactNo}
                                    onChange={(e) => setContactNo(e.target.value)}
                                    placeholder='+971 5X XXX XXXX'
                                    className='w-full px-4 py-3 pl-10 bg-white border border-blue-200 rounded-lg 
                                             text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 
                                             focus:border-transparent transition duration-200'
                                    required
                                    autoComplete='off'
                                    disabled={loading}
                                />
                                <MdPhone className='absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600' />
                            </div>
                        </div>

                        {/* Balance */}
                        <div className="mb-6">
                            <label className='text-sm font-medium text-gray-700 flex items-center gap-2 mb-2'>
                                <MdAttachMoney className="text-blue-600 w-4 h-4" />
                                Current Balance
                            </label>
                            <div className="relative">
                                <input
                                    type='text'
                                    value={balance}
                                    onChange={(e) => setBalance(e.target.value)}
                                    placeholder='Enter supplier balance'
                                    className='w-full px-4 py-3 pl-10 pr-12 bg-white border border-blue-200 rounded-lg 
                                             text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 
                                             focus:border-transparent transition duration-200'
                                    required
                                    autoComplete='off'
                                    disabled={loading}
                                />
                                <MdAttachMoney className='absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600' />
                                <span className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm'>
                                    AED
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                Current balance: {balance} AED
                            </p>
                        </div>

                        {/* Submit Button */}
                        <button
                            type='submit'
                            disabled={loading}
                            className={`w-full py-3 rounded-lg transition duration-200 cursor-pointer 
                                     font-medium text-sm flex items-center justify-center gap-2
                                     ${loading 
                                        ? 'bg-blue-400 cursor-not-allowed' 
                                        : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                                     } text-white`}
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    <span>Updating...</span>
                                </>
                            ) : (
                                <>
                                    <MdUpdate className="w-4 h-4" />
                                    <span>Update Supplier</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Cancel Button */}
                <div className="border-t border-blue-200 p-4 bg-blue-50">
                    <button
                        onClick={handleClose}
                        className='w-full py-2.5 bg-white border border-blue-300 text-blue-700 rounded-lg 
                                 hover:bg-blue-50 transition duration-200 cursor-pointer font-medium text-sm'
                        disabled={loading}
                    >
                        Cancel
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default SupplierEdit;


// import React, { useState, useEffect } from 'react'
// import { motion } from 'framer-motion'
// import { api } from '../../https';
// import { toast } from 'react-toastify'
// import { IoCloseCircle } from 'react-icons/io5';

// const SupplierEdit = ({ supplier, setIsEditSupplierModal, fetchSuppliers }) => {
//     const handleClose = () => {
//         setIsEditSupplierModal(false)
//     };

//     const [supplierName, setSupplierName] = useState(supplier.supplierName);
//     const [email, setEmail] = useState(supplier.email);
//     const [contactNo, setContactNo] = useState(supplier.contactNo);
//     const [address, setAddress] = useState(supplier.address);
//     const [balance, setBalance] = useState(supplier.balance);

//     const onSubmitHandler = async (event) => {
//         event.preventDefault();

//         try {
//             const formData = new FormData();

//             formData.append('supplierName', supplierName);
//             formData.append('email', email);
//             formData.append('contactNo', contactNo);
//             formData.append('address', address);
//             formData.append('balance', balance);
            
//             const { data } = await api.put(`/api/suppliers/${supplier._id}`, formData
//         );

//             if (data.success) {
//                 toast.success(data.message);
//                 fetchSuppliers();
//                 handleClose();
//             } else {
//                 toast.error(data.message);
//             }
//         } catch (error) {
//             toast.error(error.response?.data?.message || error.message);
//         }
//     };

//     // The issue is that you're trying to send multipart/form-data but your backend is expecting JSON data. When you set 'Content-Type': 'multipart/form-data', the Express.js express.json() middleware can't parse the request body, so req.body becomes undefined.
//     // Solution 1: Remove the headers (Use JSON) this is Json : const { data } = await api.put(`/api/customers/${customer._id}`, formData);
   
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
//                     <h2 className='text-[#1a1a1a] text-md font-bold'>Update Supplier</h2>
//                     <button onClick={handleClose} className='rounded-xs text-[#be3e3f] hover:bg-[#be3e3f]/30 cursor-pointer
//                                      border-b border-[#be3e3f]'>
//                         <IoCloseCircle size={22} />
//                     </button>
//                 </div>


//                 {/*Modal Body*/}
//                 <form className='mt-3 space-y-6' onSubmit={onSubmitHandler}>
            
//                     <div className='flex items-center justify-between'>
//                         <label className='w-[25%] text-[#1a1a1a] block mb-2 mt-3 text-xs font-normal'>Supplier Name :</label>
//                         <div className='w-[75%] flex items-center rounded-xs p-3  bg-white shadow-xl'>
//                             <input
//                                 type='text'

//                                 value={supplierName}
//                                 onChange={(e) => setSupplierName(e.target.value)}

//                                 placeholder='Enter supplier name'
//                                 className='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none font-semibold text-sm
//                                             border-b border-yellow-700'
//                                 required
//                                 autoComplete='none'
//                             />
//                         </div>
//                     </div>


//                     <div className='flex items-center justify-between'>
//                         <label className='w-[25%] text-black block mb-2 mt-3 text-xs font-normal'>Email  :</label>
//                         <div className='flex w-[75%] items-center rounded-xs p-3 bg-white shadow-xl'>
//                             <input
//                                 type='email'

//                                 value={email}
//                                 onChange={(e) => setEmail(e.target.value)}

//                                 placeholder='Enter supplier email'
//                                 className='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none font-semibold text-sm
//                                 border-b border-yellow-700'
//                                 required
//                                 autoComplete='none'
//                             />
//                         </div>
//                     </div>

//                     <div className='flex items-center justify-between'>
//                         <label className='w-[25%] text-black block mb-2 mt-3 text-xs font-normal'>Address :</label>
//                         <div className='flex w-[75%] items-center rounded-xs p-3 bg-white shadow-xl'>
//                             <input
//                                 type='text'

//                                 value={address}
//                                 onChange={(e) => setAddress(e.target.value)}

//                                 placeholder='Enter supplier address'
//                                 className='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none font-semibold text-sm
//                                              border-b border-yellow-700'
//                                 required
//                                 autoComplete='none'
//                             />
//                         </div>
//                     </div>

//                     <div className='flex items-center justify-between'>
//                         <label className='w-[25%] text-black block mb-2 mt-3 text-xs font-normal'>Contact Number :</label>
//                         <div className='flex w-[75%] items-center rounded-xs p-3 bg-white shadow-xl'>
//                             <input
//                                 type='text'

//                                 value={contactNo}
//                                 onChange={(e) => setContactNo(e.target.value)}

//                                 placeholder='Enter supplier contact number'
//                                 className='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none font-semibold text-sm
//                                              border-b border-yellow-700'
//                                 required
//                                 autoComplete='none'
//                             />
//                         </div>
//                     </div>

//                     <div className='flex items-center justify-between'>
//                         <label className='w-[25%] text-black block mb-2 mt-3 text-xs font-normal'>Balance :</label>
//                         <div className='flex w-[75%] items-center rounded-xs p-3 bg-white shadow-xl'>
//                             <input
//                                 type='text'

//                                 value={balance}
//                                 onChange={(e) => setBalance(e.target.value)}

//                                 placeholder='Enter supplier balance'
//                                 className='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none font-semibold text-sm
//                                     border-b border-yellow-700'
//                                 required
//                                 autoComplete='none'
//                             />
//                         </div>
//                     </div>


                   

//                     <button
//                         type='submit'
//                         className='p-3 rounded-xs mt-3 py-3 text-sm bg-[#0ea5e9] text-white font-semibold 
//                                  cursor-pointer '
//                     >
//                         Update Supplier
//                     </button>


//                 </form>

//             </motion.div>
//         </div>

//     );
// };

// export default SupplierEdit ;