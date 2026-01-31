import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { api } from '../../https';
import { toast } from 'react-toastify'
import { IoCloseCircle } from 'react-icons/io5';
import { MdSquare, MdUpdate } from "react-icons/md";

const UnitUpdate = ({ setIsEditUnitModal, fetchUnits, unit }) => {
    const [loading, setLoading] = useState(false);
    
    const handleClose = () => {
        setIsEditUnitModal(false);
    };

    const [unitName, setUnitName] = useState(unit.unitName);
    
    const onSubmitHandler = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            // Send as JSON (removing multipart/form-data)
            const updateData = {
                unitName: unitName
            };
            
            const { data } = await api.put(`/api/units/${unit._id}`, updateData);

            if (data.success) {
                fetchUnits();
                handleClose();
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    return(
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
                                <h2 className='text-lg sm:text-xl font-bold text-white'>Update Unit</h2>
                                <p className='text-blue-100 text-xs sm:text-sm'>Modify unit details</p>
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
                    <form onSubmit={onSubmitHandler}>
                        <div className="mb-6">
                            <label className='text-sm font-medium text-gray-700 flex items-center gap-2 mb-2'>
                                <MdSquare className="text-blue-600 w-4 h-4" />
                                Unit Name
                            </label>
                            <div className="relative">
                                <input
                                    type='text'
                                    value={unitName}
                                    onChange={(e) => setUnitName(e.target.value)}
                                    placeholder='Enter unit name'
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
                                Current: {unit.unitName}
                            </p>
                        </div>

                        {/* Unit Examples (for inspiration) */}
                        <div className="mb-6 pt-4 border-t border-blue-200">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Common Unit Examples:</h4>
                            <div className="flex flex-wrap gap-2">
                                {['kg', 'piece', 'liter', 'meter', 'box', 'pack', 'bottle', 'gram'].map((example, index) => (
                                    <span 
                                        key={index}
                                        onClick={() => setUnitName(example)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer 
                                                 transition duration-200 border
                                                 ${unitName === example
                                                    ? 'bg-blue-600 text-white border-blue-600'
                                                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200'
                                                 }`}
                                    >
                                        {example}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3">
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
                                disabled={loading || !unitName.trim() || unitName === unit.unitName}
                                className={`flex-1 px-4 py-3 rounded-lg transition duration-200 cursor-pointer 
                                         font-medium text-sm flex items-center justify-center gap-2
                                         ${loading || !unitName.trim() || unitName === unit.unitName
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
                                        <span>Update Unit</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default UnitUpdate;

// import React, {useState, useEffect} from 'react'

// import { motion } from 'framer-motion'
// import { api } from '../../https';
// import { toast } from 'react-toastify'
// import { IoCloseCircle } from 'react-icons/io5';

// const UnitUpdate = ({setIsEditUnitModal, fetchUnits, unit}) => {
//     const handleClose = () => {
//         setIsEditUnitModal(false)
//     };

//     const [unitName, setUnitName] = useState(unit.unitName);
    
//     const onSubmitHandler = async (event) => {
//         event.preventDefault();

//         try {
//             const formData = new FormData();

//             formData.append('unitName', unitName);
       
//             const { data } = await api.put(`/api/units/${unit._id}`, formData
             
//             );

//             if (data.success) {
               
//                 fetchUnits();
             
//                 handleClose();
//                 toast.success(data.message);
//             } else {
//                 toast.error(data.message);
//             }
//         } catch (error) {
//             toast.error(error.response?.data?.message || error.message);
//         }
//     };

//     return(
//         <div className='fixed inset-0 bg-opacity-50 flex items-center justify-center shadow-lg/30 z-50'
//             style={{ backgroundColor: 'rgba(145, 143, 143, 0.4)' }}>
//             <motion.div
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.9 }}
//                 transition={{ durayion: 0.3, ease: 'easeInOut' }}
//                 className='bg-white p-2 rounded-lg shadow-lg/30 w-120 md:mt-0 mt-0'
//             >


//                 {/*Modal Header */}
//                 <div className="flex justify-between items-center mb-2 shadow-xl p-2">
//                     <h2 className='text-[#1a1a1a] text-md font-bold'>Update Unit</h2>
//                     <button onClick={handleClose} className='rounded-xs text-[#be3e3f] hover:bg-[#be3e3f]/30 cursor-pointer
//                         border-b border-[#be3e3f]'>
//                         <IoCloseCircle size={22} />
//                     </button>
//                 </div>


//                 {/*Modal Body*/}
//                 <form className='mt-3 space-y-6' onSubmit={onSubmitHandler}>

//                     <div className='flex items-center justify-between'>
//                         <label className='w-[20%] text-[#1a1a1a] block mb-2 mt-3 text-xs font-normal'>Unit Name :</label>
//                         <div className='w-[80%] flex items-center rounded-xs p-3  bg-white shadow-xl'>
//                             <input
//                                 type='text'

//                                 value={unitName}
//                                 onChange={(e) => setUnitName(e.target.value)}

//                                 placeholder='Enter unit name'
//                                 className='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none font-semibold text-sm
//                                     border-b border-yellow-700'
//                                 required
//                                 autoComplete='none'
//                             />
//                         </div>
//                     </div>




//                     <button
//                         type='submit'
//                         className='p-3 w-full rounded-xs mt-3 py-3 text-sm bg-[#0ea5e9] text-white font-semibold 
//                         cursor-pointer '
//                     >
//                         Update Unit
//                     </button>


//                 </form>

//             </motion.div>
//         </div>

//     );
// };


// export default UnitUpdate ;