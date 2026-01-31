import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { api } from '../../https';
import { toast } from 'react-toastify'
import { IoCloseCircle } from 'react-icons/io5';
import { MdEdit, MdCategory } from "react-icons/md";

const CategoryEdit = ({ setIsEditCategoryModal, category }) => {
    const [categoryName, setCategoryName] = useState(category?.categoryName || '');
    const [loading, setLoading] = useState(false);

    const handleClose = () => {
        setIsEditCategoryModal(false);
    };

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        
        if (!categoryName.trim()) {
            toast.error('Please enter a category name');
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('categoryName', categoryName);
       
            const { data } = await api.put(`/api/category/${category._id}`, formData);

            if (data.success) {
                toast.success(data.message);
                handleClose();
                // Note: It's better to use a callback or state update rather than window.location.reload()
                // Consider passing a refresh function as prop instead
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || 'Update failed');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className='bg-gradient-to-b from-white to-blue-50 rounded-2xl shadow-2xl border border-blue-200 w-full max-w-md'
            >
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-5 md:p-6 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-2 rounded-lg">
                                <MdEdit className="text-white w-5 h-5" />
                            </div>
                            <div>
                                <h2 className='text-xl font-bold text-white'>Update Category</h2>
                                <p className='text-blue-100 text-sm'>Edit category information</p>
                            </div>
                        </div>
                        <button 
                            onClick={handleClose}
                            className='p-2 text-white hover:bg-white/20 rounded-lg transition duration-200 cursor-pointer'
                            disabled={loading}
                        >
                            <IoCloseCircle className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Modal Body */}
                <form className='p-5 md:p-6 space-y-6' onSubmit={onSubmitHandler}>
                    {/* Category Name Input */}
                    <div className="space-y-2">
                        <label className='text-sm font-medium text-gray-700 flex items-center gap-2'>
                            <MdCategory className="w-4 h-4 text-blue-600" />
                            Category Name
                        </label>
                        <div className="relative">
                            <input
                                type='text'
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                                placeholder='Enter category name'
                                className='w-full px-4 py-3 pl-10 bg-white border border-blue-200 rounded-lg 
                                         text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 
                                         focus:border-transparent transition duration-200'
                                required
                                autoComplete='off'
                                disabled={loading}
                            />
                            <div className='absolute left-3 top-1/2 transform -translate-y-1/2'>
                                <MdCategory className='w-4 h-4 text-gray-400' />
                            </div>
                        </div>
                        <p className='text-xs text-gray-500'>
                            Current: <span className='font-medium text-blue-600'>{category?.categoryName}</span>
                        </p>
                    </div>

                    {/* Form Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-blue-100">
                        <button
                            type='button'
                            onClick={handleClose}
                            className='flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg 
                                     hover:bg-gray-200 transition duration-200 cursor-pointer 
                                     font-medium text-sm'
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type='submit'
                            disabled={loading || !categoryName.trim() || categoryName === category?.categoryName}
                            className={`flex-1 px-4 py-3 rounded-lg transition duration-200 cursor-pointer 
                                     font-medium text-sm flex items-center justify-center gap-2
                                     ${loading || !categoryName.trim() || categoryName === category?.categoryName
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
                                    <MdEdit className="w-4 h-4" />
                                    <span>Update Category</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default CategoryEdit;

// import React, {useState, useEffect} from 'react'

// import { motion } from 'framer-motion'
// import { api } from '../../https';
// import { toast } from 'react-toastify'
// import { IoCloseCircle } from 'react-icons/io5';

// const CategoryEdit = ({setIsEditCategoryModal, category}) => {
//     const handleClose = () => {
//         setIsEditCategoryModal(false)
//     };

//     const [categoryName, setCategoryName] = useState(category.categoryName);
    
//     const onSubmitHandler = async (event) => {
//         event.preventDefault();

//         try {
//             const formData = new FormData();

//             formData.append('categoryName', categoryName);
       
//             const { data } = await api.put(`/api/category/${category._id}`, formData
             
//             );

//             if (data.success) {
               
//                 // fetchCustomers();
//                 window.location.reload();
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
//                     <h2 className='text-[#1a1a1a] text-md font-bold'>Update Category</h2>
//                     <button onClick={handleClose} className='rounded-xs text-[#be3e3f] hover:bg-[#be3e3f]/30 cursor-pointer
//                         border-b border-[#be3e3f]'>
//                         <IoCloseCircle size={22} />
//                     </button>
//                 </div>


//                 {/*Modal Body*/}
//                 <form className='mt-3 space-y-6' onSubmit={onSubmitHandler}>

//                     <div className='flex items-center justify-between'>
//                         <label className='w-[20%] text-[#1a1a1a] block mb-2 mt-3 text-xs font-normal'>Category Name :</label>
//                         <div className='w-[80%] flex items-center rounded-xs p-3  bg-white shadow-xl'>
//                             <input
//                                 type='text'

//                                 value={categoryName}
//                                 onChange={(e) => setCategoryName(e.target.value)}

//                                 placeholder='Enter category name'
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
//                                          cursor-pointer '
//                     >
//                         Update Category
//                     </button>


//                 </form>

//             </motion.div>
//         </div>

//     );
// };


// export default CategoryEdit ;