import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useMutation } from '@tanstack/react-query'
import { IoCloseCircle } from 'react-icons/io5';
import { enqueueSnackbar } from 'notistack';
import { addUnit } from '../../https'
import { MdSquare, MdAdd } from "react-icons/md";

const UnitAdd = ({setIsUnitModalOpen}) => {
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        unitName: ""
    });
        
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    };
        
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            await UnitMutation.mutateAsync(formData);
            setIsUnitModalOpen(false);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }
    
    
    const UnitMutation = useMutation({
        mutationFn: (reqData) => addUnit(reqData),
        onSuccess: (res) => {
            const { data } = res;
            enqueueSnackbar(data.message, { variant: "success"});
            setFormData({ unitName: "" });
        },
        onError: (error) => {
            const { response } = error;
            enqueueSnackbar(response?.data?.message || "An error occurred", { variant: "error"});
            console.log(error);
        },
    });
                 
    const handleClose = () => {
        setIsUnitModalOpen(false);
    };
            
    
    return (
        <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className='bg-gradient-to-b from-white to-blue-50 rounded-xl shadow-2xl border border-blue-200 
                          w-full max-w-md'
            >
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 sm:p-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-2 rounded-lg">
                                <MdSquare className="text-white w-5 h-5" />
                            </div>
                            <div>
                                <h2 className='text-lg sm:text-xl font-bold text-white'>Add New Unit</h2>
                                <p className='text-blue-100 text-xs sm:text-sm'>Create a new measurement unit</p>
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
                <div className='p-4 sm:p-5'>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className='text-sm font-medium text-gray-700 flex items-center gap-2 mb-2'>
                                <MdSquare className="text-blue-600 w-4 h-4" />
                                Unit Name
                            </label>
                            <div className="relative">
                                <input 
                                    type='text'
                                    name='unitName'
                                    value={formData.unitName}
                                    onChange={handleInputChange}
                                    placeholder='Enter unit name (e.g., kg, piece, liter)'
                                    className='w-full px-4 py-3 pl-10 bg-white border border-blue-200 rounded-lg 
                                             text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 
                                             focus:border-transparent transition duration-200'
                                    required
                                    autoComplete='off'
                                    disabled={loading}
                                />
                                <MdSquare className='absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600' />
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                Enter a descriptive name for the measurement unit
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 mt-6">
                            <button
                                type='button'
                                onClick={handleClose}
                                disabled={loading}
                                className='flex-1 px-4 py-3 bg-white border border-blue-300 text-blue-700 rounded-lg 
                                         hover:bg-blue-50 transition duration-200 cursor-pointer font-medium text-sm'
                            >
                                Cancel
                            </button>
                            <button
                                type='submit'
                                disabled={loading || !formData.unitName.trim()}
                                className={`flex-1 px-4 py-3 rounded-lg transition duration-200 cursor-pointer 
                                         font-medium text-sm flex items-center justify-center gap-2
                                         ${loading || !formData.unitName.trim()
                                            ? 'bg-blue-400 cursor-not-allowed' 
                                            : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                                         } text-white`}
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        <span>Adding...</span>
                                    </>
                                ) : (
                                    <>
                                        <MdAdd className="w-4 h-4" />
                                        <span>Add Unit</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Unit Examples */}
                    <div className="mt-6 pt-4 border-t border-blue-200">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Common Unit Examples:</h4>
                        <div className="flex flex-wrap gap-2">
                            {['kg', 'piece', 'liter', 'meter', 'box', 'pack', 'bottle', 'gram'].map((unit, index) => (
                                <span 
                                    key={index}
                                    onClick={() => setFormData({ unitName: unit })}
                                    className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium 
                                             cursor-pointer hover:bg-blue-100 transition duration-200 border border-blue-200"
                                >
                                    {unit}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default UnitAdd;

// import React, { useState } from 'react'
// import { motion } from 'framer-motion'
// import { useMutation } from '@tanstack/react-query'
// import { IoCloseCircle } from 'react-icons/io5';
// import { enqueueSnackbar } from 'notistack';

// import { addUnit } from '../../https'

// const UnitAdd = ({setIsUnitModalOpen}) => {
    
//     const [formData, setFormData] = useState({
//         unitName :""
//     });
        
//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prev) => ({...prev, [name] : value}));
//     };
        
//     const handleSubmit = (e) => {
//         e.preventDefault();
//         console.log(formData)
    
//         UnitMutation.mutate(formData)
//         window.location.reload()
//         setIsUnitModalOpen(false)
//     }
    
    
//     const UnitMutation = useMutation({
//         mutationFn: (reqData) => addUnit(reqData),
//         onSuccess: (res) => {
            
//             const { data } = res;
//             //console.log(data)
//             enqueueSnackbar(data.message, { variant: "success"});
//             },
            
//             onError: (error) => {
//             const { response } = error;
//             enqueueSnackbar(response.data.message, { variant: "error"});
            
//             console.log(error);
//                 },
//     });
                 
//     const handleClose = () => {
//         setIsUnitModalOpen(false)
//     };
            
    
//     return (
//         <div className ='fixed inset-0 bg-opacity-50 flex items-center justify-center z-50' 
//         style={{ backgroundColor:  'rgba(20, 10, 10, 0.4)'}}>
//         <motion.div
//             initial ={{opacity :0 , scale :0.9}}
//             animate ={{opacity :1, scale :1}}
//             exit ={{opacity :0, scale :0.9}}
//             transition ={{duration :0.3 , ease: 'easeInOut'}}
//             className ='bg-white p-2 rounded-lg shadow-lg/30 w-120 md:mt-0 mt-0'
//         >
                        
                        
//          {/*Modal Header */}
//                 <div className="flex justify-between items-center mb-2 shadow-xl p-2">
//                     <h2 className='text-[#1a1a1a] text-md font-bold'>Add Unite</h2>
//                     <button onClick={handleClose} className='rounded-xs text-[#be3e3f] hover:bg-[#be3e3f]/30 cursor-pointer
//                         border-b border-[#be3e3f]'>
//                         <IoCloseCircle size={22} />
//                     </button>
//                 </div>
                                  
//         {/*Modal Body*/}
//         <form className ='mt-5 space-y-6' onSubmit ={handleSubmit}>
//             <div className =''>
                                    
//                 <label className ='text-[#1a1a1a] block mb-2 mt-3 px-4 text-sm font-medium'>Unit Name :</label>
//                 <div className ='flex items-center justify-between gap-5'>
//                     <div className ='w-full flex items-center rounded-xs p-3 bg-white shadow-xl'>
//                         <input 
//                             type ='text'
//                             name ='unitName'
//                             value ={formData.unitName}
//                             onChange ={handleInputChange}
                                                   
//                             placeholder = 'Enter unit name'
//                             className ='bg-transparent w-full text-[#1a1a1a] focus:outline-none border-b border-yellow-700'
//                             required
//                             autoComplete='none'
//                         />
//                     </div>
                
//                             <button
//                                 type='submit'
//                                 className='p-3 text-sm bg-[#0ea5e9] text-white font-semibold 
//                                 cursor-pointer w-15 h-15 rounded-full'
//                             >
//                                 Add Unit
//                             </button>
                        
//                 </div>
                            
//             </div>
                                
//         </form>
//         </motion.div>
//         </div>
//     );
// };




// export default UnitAdd;