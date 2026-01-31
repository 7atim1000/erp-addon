import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { api } from '../../https';
import { toast } from 'react-toastify'
import { IoCloseCircle } from 'react-icons/io5';
import { MdPerson, MdEmail, MdPhone, MdLocationOn, MdAttachMoney, MdUpdate } from "react-icons/md";

const CustomerUpdate = ({ customer, setIsEditCustomerModal, fetchCustomers }) => {
    const [loading, setLoading] = useState(false);
    
    const handleClose = () => {
        setIsEditCustomerModal(false);
    };

    // Keep the exact same state structure
    const [customerName, setCustomerName] = useState(customer.customerName);
    const [email, setEmail] = useState(customer.email);
    const [contactNo, setContactNo] = useState(customer.contactNo);
    const [address, setAddress] = useState(customer.address);
    const [balance, setBalance] = useState(customer.balance);

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            // Send as JSON (removing multipart/form-data)
            const updateData = {
                customerName,
                email,
                contactNo,
                address,
                balance
            };
            
            const { data } = await api.put(`/api/customers/${customer._id}`, updateData);

            if (data.success) {
                toast.success(data.message);
                fetchCustomers();
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
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className='bg-gradient-to-b from-white to-blue-50 rounded-xl shadow-2xl border border-blue-200 
                          w-full max-w-lg max-h-[90vh] overflow-y-auto scrollbar-hidden'
            >
                {/* Modal Header */}
                <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 to-blue-700 p-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-2 rounded-lg">
                                <MdPerson className="text-white w-5 h-5" />
                            </div>
                            <div>
                                <h2 className='text-xl font-bold text-white'>Update Customer</h2>
                                <p className='text-blue-100 text-sm'>Modify customer details</p>
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
                <div className='p-5 space-y-4'>
                    <form onSubmit={onSubmitHandler}>
                        {/* Customer Name */}
                        <div className="mb-4">
                            <label className='text-sm font-medium text-gray-700 flex items-center gap-2 mb-2'>
                                <MdPerson className="text-blue-600 w-4 h-4" />
                                Customer Name
                            </label>
                            <div className="relative">
                                <input
                                    type='text'
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    placeholder='Enter customer name'
                                    className='w-full px-4 py-3 pl-10 bg-white border border-blue-200 rounded-lg 
                                             text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 
                                             focus:border-transparent transition duration-200'
                                    required
                                    autoComplete='off'
                                    disabled={loading}
                                />
                                <MdPerson className='absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600' />
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
                                    placeholder='Enter customer email'
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
                                    placeholder='Enter customer address'
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
                                    placeholder='Enter customer balance'
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
                                    <span>Update Customer</span>
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

export default CustomerUpdate;

// import React, { useState, useEffect } from 'react'
// import { motion } from 'framer-motion'
// import { api } from '../../https';
// import { toast } from 'react-toastify'
// import { IoCloseCircle } from 'react-icons/io5';

// const CustomerUpdate = ({ customer, setIsEditCustomerModal, fetchCustomers }) => {
//     const handleClose = () => {
//         setIsEditCustomerModal(false)
//     };


//     const [customerName, setCustomerName] = useState(customer.customerName);
//     const [email, setEmail] = useState(customer.email);
//     const [contactNo, setContactNo] = useState(customer.contactNo);
//     const [address, setAddress] = useState(customer.address);
//     const [balance, setBalance] = useState(customer.balance);

//     const onSubmitHandler = async (event) => {
//         event.preventDefault();

//         try {
//             const formData = new FormData();

//             formData.append('customerName', customerName);
//             formData.append('email', email);
//             formData.append('contactNo', contactNo);
//             formData.append('address', address);
//             formData.append('balance', balance);
            
//             const { data } = await api.put(`/api/customers/${customer._id}`, formData
//             //     {
//             //     headers: {
//             //         'Content-Type': 'multipart/form-data',
//             //     }
//             // }
//         );

//             if (data.success) {
//                 toast.success(data.message);
//                 fetchCustomers();
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
//                     <h2 className='text-[#1a1a1a] text-md font-bold'>Update Customer</h2>
//                     <button onClick={handleClose} className='rounded-xs text-[#be3e3f] hover:bg-[#be3e3f]/30 cursor-pointer
//                                      border-b border-[#be3e3f]'>
//                         <IoCloseCircle size={22} />
//                     </button>
//                 </div>


//                 {/*Modal Body*/}
//                 <form className='mt-3 space-y-6' onSubmit={onSubmitHandler}>
            
//                     <div className='flex items-center justify-between'>
//                         <label className='w-[20%] text-[#1a1a1a] block mb-2 mt-3 text-xs font-normal'>Customer Name :</label>
//                         <div className='w-[80%] flex items-center rounded-xs p-3  bg-white shadow-xl'>
//                             <input
//                                 type='text'

//                                 value={customerName}
//                                 onChange={(e) => setCustomerName(e.target.value)}

//                                 placeholder='Enter customer name'
//                                 className='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none font-semibold text-sm
//                                              border-b border-yellow-700'
//                                 required
//                                 autoComplete='none'
//                             />
//                         </div>
//                     </div>


//                     <div className='flex items-center justify-between'>
//                         <label className='w-[20%] text-black block mb-2 mt-3 text-xs font-normal'>Email  :</label>
//                         <div className='flex w-[80%] items-center rounded-xs p-3 bg-white shadow-xl'>
//                             <input
//                                 type='email'

//                                 value={email}
//                                 onChange={(e) => setEmail(e.target.value)}

//                                 placeholder='Enter customer email'
//                                 className='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none font-semibold text-sm
//                                 border-b border-yellow-700'
//                                 required
//                                 autoComplete='none'
//                             />
//                         </div>
//                     </div>

//                     <div className='flex items-center justify-between'>
//                         <label className='w-[20%] text-black block mb-2 mt-3 text-xs font-normal'>Address :</label>
//                         <div className='flex w-[80%] items-center rounded-xs p-3 bg-white shadow-xl'>
//                             <input
//                                 type='text'

//                                 value={address}
//                                 onChange={(e) => setAddress(e.target.value)}

//                                 placeholder='Enter customer address'
//                                 className='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none font-semibold text-sm
//                                              border-b border-yellow-700'
//                                 required
//                                 autoComplete='none'
//                             />
//                         </div>
//                     </div>

//                     <div className='flex items-center justify-between'>
//                         <label className='w-[20%] text-black block mb-2 mt-3 text-xs font-normal'>Contact Number :</label>
//                         <div className='flex w-[80%] items-center rounded-xs p-3 bg-white shadow-xl'>
//                             <input
//                                 type='text'

//                                 value={contactNo}
//                                 onChange={(e) => setContactNo(e.target.value)}

//                                 placeholder='Enter customer contact number'
//                                 className='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none font-semibold text-sm
//                                              border-b border-yellow-700'
//                                 required
//                                 autoComplete='none'
//                             />
//                         </div>
//                     </div>

//                     <div className='flex items-center justify-between'>
//                         <label className='w-[20%] text-black block mb-2 mt-3 text-xs font-normal'>Balance :</label>
//                         <div className='flex w-[80%] items-center rounded-xs p-3 bg-white shadow-xl'>
//                             <input
//                                 type='text'

//                                 value={balance}
//                                 onChange={(e) => setBalance(e.target.value)}

//                                 placeholder='Enter customer balance'
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
//                         Update Customer
//                     </button>


//                 </form>

//             </motion.div>
//         </div>

//     );
// };


// export default CustomerUpdate ;