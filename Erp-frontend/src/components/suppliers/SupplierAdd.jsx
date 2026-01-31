import React, {useState} from 'react'
import { useMutation } from '@tanstack/react-query'
import { addSupplier } from '../../https';
import { motion } from 'framer-motion'
import { enqueueSnackbar } from 'notistack';
import { IoCloseCircle } from 'react-icons/io5';
import { MdBusiness, MdEmail, MdPhone, MdLocationOn, MdAttachMoney, MdPersonAdd } from "react-icons/md";

const SupplierAdd = ({setIsSupplierModalOpen, fetchSuppliers}) => {
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        supplierName: "", 
        email: "", 
        contactNo: "", 
        address: "", 
        balance: 0
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    };

    const handleClose = () => {
        setIsSupplierModalOpen(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            await SupplierMutation.mutateAsync(formData);
            setIsSupplierModalOpen(false);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const SupplierMutation = useMutation({
        mutationFn: (reqData) => addSupplier(reqData),
        onSuccess: (res) => {
            const { data } = res;
            enqueueSnackbar(data.message, { variant: "success"});
            fetchSuppliers();
            setFormData({
                supplierName: "", 
                email: "", 
                contactNo: "", 
                address: "", 
                balance: 0
            });
        },
        onError: (error) => {
            const { response } = error;
            enqueueSnackbar(response?.data?.message || "An error occurred", { variant: "error"});
            console.log(error);
        },
    });

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
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 sm:p-5 flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-2 rounded-lg">
                                <MdBusiness className="text-white w-5 h-5" />
                            </div>
                            <div>
                                <h2 className='text-lg sm:text-xl font-bold text-white'>Add New Supplier</h2>
                                <p className='text-blue-100 text-xs sm:text-sm'>Enter supplier information</p>
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
                    <form onSubmit={handleSubmit}>
                        {/* Supplier Name */}
                        <div className="mb-4">
                            <label className='text-sm font-medium text-gray-700 flex items-center gap-2 mb-2'>
                                <MdBusiness className="text-blue-600 w-4 h-4" />
                                Supplier Name
                            </label>
                            <div className="relative">
                                <input 
                                    type='text'
                                    name='supplierName'
                                    value={formData.supplierName}
                                    onChange={handleInputChange}
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
                                Supplier Email
                            </label>
                            <div className="relative">
                                <input
                                    type='email'
                                    name='email'
                                    value={formData.email}
                                    onChange={handleInputChange}
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

                        {/* Contact Number */}
                        <div className="mb-4">
                            <label className='text-sm font-medium text-gray-700 flex items-center gap-2 mb-2'>
                                <MdPhone className="text-blue-600 w-4 h-4" />
                                Contact Number
                            </label>
                            <div className="relative">
                                <input 
                                    type='text'
                                    name='contactNo'
                                    value={formData.contactNo}
                                    onChange={handleInputChange}
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

                        {/* Address */}
                        <div className="mb-4">
                            <label className='text-sm font-medium text-gray-700 flex items-center gap-2 mb-2'>
                                <MdLocationOn className="text-blue-600 w-4 h-4" />
                                Address
                            </label>
                            <div className="relative">
                                <input 
                                    type='text'
                                    name='address'
                                    value={formData.address}
                                    onChange={handleInputChange}
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

                        {/* Balance */}
                        <div className="mb-6">
                            <label className='text-sm font-medium text-gray-700 flex items-center gap-2 mb-2'>
                                <MdAttachMoney className="text-blue-600 w-4 h-4" />
                                Opening Balance
                            </label>
                            <div className="relative">
                                <input 
                                    type='text'
                                    name='balance'
                                    value={formData.balance}
                                    onChange={handleInputChange}
                                    placeholder='Enter opening balance'
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
                                Enter 0 if no opening balance
                            </p>
                        </div>

                        {/* Submit Button */}
                        <button
                            type='submit'
                            disabled={loading || !formData.supplierName.trim()}
                            className={`w-full py-3 rounded-lg transition duration-200 cursor-pointer 
                                     font-medium text-sm flex items-center justify-center gap-2
                                     ${loading || !formData.supplierName.trim()
                                        ? 'bg-blue-400 cursor-not-allowed' 
                                        : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                                     } text-white`}
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    <span>Adding Supplier...</span>
                                </>
                            ) : (
                                <>
                                    <MdPersonAdd className="w-4 h-4" />
                                    <span>Add Supplier</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Cancel Button */}
                <div className="border-t border-blue-200 p-4 bg-blue-50 flex-shrink-0">
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

export default SupplierAdd;

// import React, {useState} from 'react'
// import { useMutation } from '@tanstack/react-query'
// import { addSupplier } from '../../https';
// import { motion } from 'framer-motion'
// import { enqueueSnackbar } from 'notistack';
// import { IoCloseCircle } from 'react-icons/io5';


// const SupplierAdd = ({setIsSupplierModalOpen, fetchSuppliers}) => {

//     const [formData, setFormData] = useState({
//         supplierName :"", email: "", contactNo :"", address :"", balance :0
//     })

//     const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({...prev, [name] : value}));
//     };

//     const handleClose = ()=> {
//         setIsSupplierModalOpen(false)
//     }
    

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         console.log(formData)

//         SupplierMutation.mutate(formData)
//         setIsSupplierModalOpen(false)

//     };

//     const SupplierMutation = useMutation({
//         mutationFn: (reqData) => addSupplier(reqData),
//         onSuccess: (res) => {
                
//         const { data } = res;
//         //console.log(data)
//         enqueueSnackbar(data.message, { variant: "success"});
//         fetchSuppliers();
//         },
                
//         onError: (error) => {
//             const { response } = error;
//             enqueueSnackbar(response.data.message, { variant: "error"});
                
//         console.log(error);
//         },
//     });
    



//     return (
//         <div className ='fixed inset-0 bg-opacity-50 flex items-center justify-center shadow-lg/10 z-50' 
//         style={{ backgroundColor: 'rgba(20, 10, 10, 0.4)'}}>
//             <motion.div
//             initial ={{opacity :0 , scale :0.9}}
//             animate ={{opacity :1, scale :1}}
//             exit ={{opacity :0, scale :0.9}}
//             transition ={{durayion :0.3 , ease: 'easeInOut'}}
//             className ='bg-white p-2 rounded-lg shadow-lg/30 w-120 md:mt-5 mt-5 h-[calc(100vh)] overflow-y-scroll scrollbar-hidden'
//             >
                                
                                
//             {/*Modal Header */}
//             <div className="flex justify-between items-center mb-2 shadow-xl p-2">
//                 <h2 className='text-[#1a1a1a] text-md font-bold'>Add Supplier</h2>
//                 <button onClick={handleClose} className='rounded-xs text-[#be3e3f] hover:bg-[#be3e3f]/30 cursor-pointer
//                     border-b border-[#be3e3f]'>
//                     <IoCloseCircle size={22} />
//                 </button>
//             </div>
                                          
//             {/*Modal Body*/}
//             <form className ='mt-5 space-y-6' onSubmit ={handleSubmit}>
//                 <div className ='flex items-center justify-between'>
//                     <label className ='w-[20%] text-[#1a1a1a] block text-xs font-normal'>Supplier Name :</label>
//                     <div className ='flex w-[80%] items-center rounded-xs p-3 bg-white shadow-xl'>
//                         <input 
//                             type ='text'
//                             name ='supplierName'
//                             value ={formData.supplierName}
//                             onChange ={handleInputChange}
                                                  
//                             placeholder = 'Enter supplier name'
//                             className ='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none text-xs font-normal
//                                 border-b border-yellow-700'
//                             required
//                             autoComplete='none'
//                         />
//                     </div>
//                 </div>

//                 <div className='flex items-center justify-between'>
//                     <label className='w-[20%] text-[#1a1a1a] block text-xs font-normal'>Supplier Email :</label>
//                     <div className='flex w-[80%] items-center rounded-xs p-3 bg-white shadow-xl'>
//                         <input
//                             type='email'
//                             name='email'
//                             value={formData.email}
//                             onChange={handleInputChange}

//                             placeholder='Enter supplier email'
//                             className='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none text-xs font-normal
//                                 border-b border-yellow-700'
//                             required
//                             autoComplete='none'
//                         />
//                     </div>
//                 </div>
        
                
//                 <div className ='flex items-center justify-between'>
//                     <label className ='w-[20%] text-[#1a1a1a] block text-xs font-normal'>Contact number : </label>
//                     <div className ='flex w-[80%] items-center rounded-xs p-3 bg-white shadow-xl'>
//                         <input 
//                             type ='text'
//                             name ='contactNo'
//                             value ={formData.contactNo}
//                             onChange ={handleInputChange}
                                                  
//                             placeholder = '+971 9999999'
//                             className ='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none text-xs font-normal
//                                 border-b border-yellow-700'
//                             required
//                             autoComplete='none'
//                         />
//                     </div>       
//                 </div>        
                            
//                 <div className ='flex items-center justify-between'>
//                     <label className ='w-[20%] text-[#1a1a1a] block text-xs font-normal'>Address : </label>
//                     <div className ='flex w-[80%] items-center rounded-xs p-3 bg-white shadow-xl'>
//                         <input 
//                             type ='text'
//                             name ='address'
//                             value ={formData.address}
//                             onChange ={handleInputChange}
                                                  
//                             placeholder = 'Enter address of supplier'
//                             className ='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none text-xs font-normal
//                                 border-b border-yellow-700'
//                             required
//                             autoComplete='none'
//                         />
                
//                     </div>
//                 </div>
                                      
//                 <div className ='flex items-center justify-between'>
//                     <label className ='w-[20%] text-[#1a1a1a] block text-xs font-normal'>Balance : </label>
//                     <div className ='flex w-[80%] items-center rounded-xs p-3 bg-white shadow-xl'>
//                         <input 
//                             type ='text'
//                             name ='balance'
//                             value ={formData.balance}
//                             onChange ={handleInputChange}
                                                  
//                             placeholder = 'Enter opening balance of supplier'
//                             className ='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none text-xs font-normal
//                                 border-b border-yellow-700'
//                             required
//                             autoComplete='none'
//                         />
                
//                     </div>
//                 </div>
        
//                 <button
//                     type='submit'
//                     className='p-3 rounded-xs mt-6 py-3 text-sm bg-[#0ea5e9] text-white font-semibold 
//                     cursor-pointer '
//                 >
//                     Add Supplier
//                 </button>
                                                  
                                         
//             </form>
        
//                 </motion.div>
//             </div>
//     );
// } ;




// export default SupplierAdd ;