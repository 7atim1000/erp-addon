import React, { useState, useEffect } from 'react'
import BackButton from '../components/shared/BackButton';
import { MdDelete, MdOutlineAddToDrive, MdScale, MdEdit, MdGridOn } from "react-icons/md";
import { FaRulerCombined, FaBalanceScale } from "react-icons/fa";
import UnitAdd from '../components/units/UnitAdd';
import { toast } from 'react-toastify'
import BottomNav from '../components/shared/BottomNav';
import { api } from '../https';
import UnitUpdate from '../components/units/UnitUpdate';
import { motion, AnimatePresence } from 'framer-motion';

const Units = () => {
    const Button = [
        { label: 'New Unit', icon: <MdOutlineAddToDrive className='text-white' size={20} />, action: 'unit' }
    ];
    
    const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isEditUnitModal, setIsEditUnitModal] = useState(false);
    const [currentUnit, setCurrentUnit] = useState(null);
    const [list, setList] = useState([]);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedUnit, setSelectedUnit] = useState(null);

    const handleOpenModal = (action) => {
        if (action === 'unit') setIsUnitModalOpen(true);
    };

    // Fetch units
    const fetchUnits = async () => {
        setLoading(true);
        try {
            const response = await api.get('/api/units/');
            if (response.data.success) {
                setList(response.data.units || []);
            } else {
                toast.error(response.data.message || 'Failed to load units');
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message || 'Failed to fetch units');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUnits();
    }, []);

    // Handle edit
    const handleEdit = (unit) => {
        setCurrentUnit(unit);
        setIsEditUnitModal(true);
    };

    // Remove unit
    const removeUnit = async (id) => {
        try {
            const response = await api.post('/api/units/remove', { id });
            if (response.data.success) {
                toast.success(response.data.message);
                await fetchUnits();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    // Calculate statistics
    const totalUnits = list.length;
    const uniqueUnits = new Set(list.map(unit => unit.unitType)).size;

    return (
        <section className='min-h-screen w-full bg-gradient-to-b from-blue-50 to-white p-4 md:p-1'>
            <div className='max-w-7xl mx-auto'>
                {/* Header Section */}
                <div className='bg-white rounded-2xl shadow-xl mb-6 overflow-hidden border border-blue-100'>
                    <div className='flex flex-col md:flex-row justify-between items-start md:items-center p-4 md:p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white'>
                        <div className='flex items-center gap-3 mb-4 md:mb-0'>
                            <BackButton className="text-white hover:bg-white/20" />
                            <div className='flex items-center gap-3'>
                                <div className='bg-white/20 p-2 rounded-lg'>
                                    <FaBalanceScale className='w-6 h-6 text-white' />
                                </div>
                                <div>
                                    <h1 className='text-xl md:text-2xl font-bold'>Units Management</h1>
                                    <p className='text-blue-100 text-sm'>Manage measurement units for your products</p>
                                </div>
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleOpenModal('unit')}
                            className='flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-3 rounded-lg transition duration-200 cursor-pointer whitespace-nowrap'
                        >
                            <MdOutlineAddToDrive className='text-white w-5 h-5' />
                            <span className='font-medium'>Add New Unit</span>
                        </motion.button>
                    </div>
                </div>

                {/* Stats Section */}
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6'>
                    <div className='bg-white rounded-xl p-4 border border-blue-100 shadow-sm'>
                        <div className='flex items-center gap-3'>
                            <div className='p-2 bg-blue-100 rounded-lg'>
                                <MdScale className='w-5 h-5 text-blue-600' />
                            </div>
                            <div>
                                <p className='text-xs text-gray-500'>Total Units</p>
                                <p className='text-xl font-bold text-blue-800'>{totalUnits}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className='bg-white rounded-xl p-4 border border-blue-100 shadow-sm'>
                        <div className='flex items-center gap-3'>
                            <div className='p-2 bg-blue-100 rounded-lg'>
                                <MdGridOn className='w-5 h-5 text-blue-600' />
                            </div>
                            <div>
                                <p className='text-xs text-gray-500'>Unique Types</p>
                                <p className='text-xl font-bold text-green-600'>{uniqueUnits}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className='bg-white rounded-xl p-4 border border-blue-100 shadow-sm'>
                        <div className='flex items-center gap-3'>
                            <div className='p-2 bg-blue-100 rounded-lg'>
                                <FaRulerCombined className='w-5 h-5 text-blue-600' />
                            </div>
                            <div>
                                <p className='text-xs text-gray-500'>Status</p>
                                <p className='text-sm font-bold text-green-600'>Active</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-3 text-gray-600">Loading units...</span>
                    </div>
                )}

                {/* Units Grid */}
                {!loading && (
                    <div className='bg-white rounded-2xl shadow-lg border border-blue-100 p-4 md:p-6'>
                        <div className='flex items-center justify-between mb-6'>
                            <div className='flex items-center gap-2'>
                                <MdScale className='w-5 h-5 text-blue-600' />
                                <h2 className='text-lg font-semibold text-gray-800'>All Measurement Units</h2>
                            </div>
                            <div className='text-sm text-gray-500'>
                                Showing {totalUnits} units
                            </div>
                        </div>

                        {totalUnits === 0 ? (
                            <div className='text-center py-12'>
                                <div className='mb-4 inline-flex p-4 bg-blue-50 rounded-full'>
                                    <FaBalanceScale className='w-12 h-12 text-blue-400' />
                                </div>
                                <h3 className='text-lg font-semibold text-gray-700 mb-2'>No Units Found</h3>
                                <p className='text-gray-500 mb-6 max-w-md mx-auto'>
                                    Your units list is empty. Start by adding measurement units to categorize your products effectively.
                                </p>
                                <button
                                    onClick={() => handleOpenModal('unit')}
                                    className='inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg transition duration-200 cursor-pointer'
                                >
                                    <MdOutlineAddToDrive className='w-4 h-4' />
                                    <span className='font-medium'>Add First Unit</span>
                                </button>
                            </div>
                        ) : (
                            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
                                <AnimatePresence>
                                    {list.map((unit, index) => (
                                        <motion.div
                                            key={unit._id || index}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3, delay: index * 0.05 }}
                                            whileHover={{ y: -5 }}
                                            className='group bg-gradient-to-br from-white to-blue-50 border border-blue-100 rounded-xl p-4 hover:border-blue-300 hover:shadow-md transition-all duration-300'
                                        >
                                            <div className='flex items-start justify-between mb-3'>
                                                <div className='flex items-center gap-3'>
                                                    <div className='p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg'>
                                                        <MdScale className='text-white w-4 h-4' />
                                                    </div>
                                                    <div className='flex-1 min-w-0'>
                                                        <h3 className='text-sm font-bold text-gray-800 truncate'>
                                                            {unit.unitName}
                                                        </h3>
                                                        {unit.unitType && (
                                                            <p className='text-xs text-gray-500 mt-1'>
                                                                Type: <span className='font-medium text-blue-600'>{unit.unitType}</span>
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {unit.description && (
                                                <div className='mb-3'>
                                                    <p className='text-xs text-gray-600 line-clamp-2'>
                                                        {unit.description}
                                                    </p>
                                                </div>
                                            )}
                                            
                                            <div className='mt-4 pt-3 border-t border-blue-100'>
                                                <div className='flex items-center justify-between'>
                                                    <div className='flex items-center gap-2'>
                                                        <button
                                                            onClick={() => handleEdit(unit)}
                                                            className='p-2 text-blue-600 hover:text-white hover:bg-blue-600 rounded-lg transition-all duration-200 cursor-pointer'
                                                            title="Edit Unit"
                                                        >
                                                            <MdEdit className='w-4 h-4' />
                                                        </button>
                                                        
                                                        <button
                                                            onClick={() => { setSelectedUnit(unit); setDeleteModalOpen(true); }}
                                                            className='p-2 text-red-500 hover:text-white hover:bg-red-500 rounded-lg transition-all duration-200 cursor-pointer'
                                                            title="Delete Unit"
                                                        >
                                                            <MdDelete className='w-4 h-4' />
                                                        </button>
                                                    </div>
                                                    
                                                    <div className='text-xs text-gray-500'>
                                                        ID: {unit._id?.slice(-6) || 'N/A'}
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className='mt-3 text-center'>
                                                <div className='text-xs text-gray-400 bg-blue-50 px-2 py-1 rounded-full inline-block'>
                                                    Measurement Unit
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                )}

                {/* Footer Section */}
                <div className='mt-6 bg-white rounded-xl shadow-lg border border-blue-100 p-4'>
                    <div className='flex flex-col md:flex-row items-center justify-between gap-4'>
                        <div className='text-sm text-gray-600'>
                            <div className='flex items-center gap-2'>
                                <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
                                <span>Total: {totalUnits} units • Last updated: Just now</span>
                            </div>
                        </div>
                        <div className='text-xs text-gray-500'>
                            Add units to organize your products by measurement
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {isUnitModalOpen && <UnitAdd setIsUnitModalOpen={setIsUnitModalOpen} fetchUnits={fetchUnits} />}
            
            {isEditUnitModal && currentUnit && (
                <UnitUpdate
                    unit={currentUnit}
                    setIsEditUnitModal={setIsEditUnitModal}
                    fetchUnits={fetchUnits}
                />
            )}

      
            <ConfirmModal
                open={deleteModalOpen}
                unitName={selectedUnit?.unitName}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={() => {
                    removeUnit(selectedUnit?._id);
                    setDeleteModalOpen(false);
                }}
            />
        </section>
    );
};

const ConfirmModal = ({ open, onClose, onConfirm, unitName }) => {
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
                            <MdDelete className='w-8 h-8 text-red-600' />
                        </div>
                        <h3 className='text-lg font-bold text-gray-800 mb-2'>Delete Unit</h3>
                        <p className='text-gray-600'>
                            Are you sure you want to delete <span className='font-semibold text-red-600'>{unitName}</span>?
                        </p>
                        <p className='text-sm text-gray-500 mt-2'>
                            This action cannot be undone. This unit will be removed from all associated products.
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
                            Delete Unit
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Units;


// import React, { useState, useEffect  } from 'react'
// import BackButton from '../components/shared/BackButton';
// import { MdDelete, MdOutlineAddToDrive } from "react-icons/md";
// import { FiEdit3 } from "react-icons/fi";
// import UnitAdd from '../components/units/UnitAdd';

// import { toast } from 'react-toastify'

// import { getBgColor } from '../utils';
// import BottomNav from '../components/shared/BottomNav';
// import { api } from '../https';
// import UnitUpdate from '../components/units/UnitUpdate';


// const Units = () => {
//     const Button = [
//         { label : 'New Unit' , icon : <MdOutlineAddToDrive className ='text-yellow-700' size={20} />, action :'unit' }
//     ];
    
//     const [isUnitModalOpen, setIsUnitModalOpen] = useState(false)
//     const handleOpenModal = (action) => {
//         if (action === 'unit') setIsUnitModalOpen(true)
//     };


//     const [loading, setLoading] = useState(false);
//     const [isEditUnitModal, setIsEditUnitModal] = useState(false);
//     const [currentUnit, setCurrentUnit] = useState(null);


//     //fetch units
//     const [list, setList] = useState([])
//     const fetchUnits = async() => {
//         setLoading(true);
        
//         try {
//         const response = await api.get('/api/units/')
                   
//         if (response.data.success){
//             setList(response.data.units)
            
//         } else{
//             toast.error(response.data.message)
//         }
        
//         } catch (error) {
//             console.log(error)
//             toast.error(error.message)
//             }finally {
//             setLoading(false);
//         }

//         }
        
    
//     useEffect(()=>{
//         fetchUnits() 
//     },[])


//     // Handle edit
//     const handleEdit = (unit) => {
//         setCurrentUnit(unit);
//         setIsEditUnitModal(true);
//     };


//     const [deleteModalOpen, setDeleteModalOpen] = useState(false);
//     const [selectedUnit, setSelectedUnit] = useState(null);

//     const removeUnit = async (id) => {
              
//         try {
//         const response = await api.post('/api/units/remove', { id }, )
            
//         if (response.data.success){
//             toast.success(response.data.message)
               
//             //Update the LIST after Remove
//             await fetchUnits();
                
//         } else{
//             toast.error(response.data.message)
//         }
            
//         } catch (error) {
//             console.log(error)
//             toast.error(error.message)
//             }
//         };
    


    
//     return (
//         <section className ='h-[calc(100vh-5rem)] overflow-y-scroll scrollbar-hidden'>
            
//            <div className ='flex items-center justify-between px-8 py-2 shadow-xl mb-2'>
//                 <div className ='flex items-center gap-2'>
//                     <BackButton />
//                     <h1 className ='text-md font-semibold text-[#1a1a1a]'>Units Management</h1>
//                 </div>
               
//                 {/* Loading Indicator */}
//                 {loading && (
//                     <div className="mt-4 flex justify-center">
//                         <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-700"></div>
//                         <span className="ml-2">Loading Units...</span>
//                     </div>
//                 )}
                            
//                 <div className ='flex gap-2 items-center justify-around gap-3 hover:bg-yellow-700 shadow-lg/30 bg-white'>
//                     {Button.map(({ label, icon, action}) => {
//                         return(
//                             <button 
//                                 onClick = {() => handleOpenModal(action)}
//                                 className ='bg-white px-4 py-2 text-[#1a1a1a] cursor-pointer
//                                     font-semibold text-xs flex items-center gap-2 rounded-full'> 
//                                 {label} {icon}
//                             </button>
//                             )
//                         })}
//                 </div>
                        
//                 {isUnitModalOpen && <UnitAdd setIsUnitModalOpen={setIsUnitModalOpen} />} 
                
                     
//             </div>
            

//             <div className ='grid grid-cols-5 gap-4 px-10 py-4 mt-0 w-[100%] bg-white'>
                                    
//                 {list.length === 0 
//                 ? (<p className ='ml-5 mt-5 text-xs text-[#be3e3f] flex items-start justify-start'>Your units list is empty . Start adding new one !</p>) 
//                 :list.map((unit, index) => (
                                                           
//                 <div key={unit.unitName} 
//                 className ='flex items-center justify-between bg-[#f5f5f5] px-3 rounded-xs h-[70px] cursor-pointer
//                     shadow-lg/10 hover:bg-[#F1E8D9]'
//                     // style = {{backgroundColor : getBgColor()}}
//                 >
                                                  
//                 <div className ='flex justify-between w-full shadow-lg/30 '>
//                     <div className ='items-start px-3'>
//                         <h1 className ='text-xs font-semibold text-[#1a1a1a]'>{unit.unitName}</h1> 
//                     </div>
//                     <div className ='items-end flex gap-1 px-3'>
//                         <FiEdit3   
//                         onClick={() => handleEdit(unit)}
//                         className ='w-6 h-6 text-[#0ea5e9] rounded-full hover:bg-[#0ea5e9]/30'/>  
//                         <MdDelete 
//                         onClick={()=> {setSelectedUnit(unit); setDeleteModalOpen(true); }} 
//                         className ='w-6 h-6 text-[#be3e3f] rounded-full hover:bg-[#be3e3f]/30'/>
//                     </div>
                                                              
//                 </div>
//                 </div>
                                             
//                 ))}     
                                     
//             </div>

//             {isEditUnitModal && currentUnit && (
//                 <UnitUpdate
//                     unit ={currentUnit}
//                     setIsEditUnitModal ={setIsEditUnitModal}
//                     fetchUnits ={fetchUnits}
//                 />
//             )}
            
//         <BottomNav />

        
//             <ConfirmModal
//                 open= {deleteModalOpen}
//                 unitName= {selectedUnit?.unitName}
//                 onClose={() => setDeleteModalOpen(false)}
//                 onConfirm={() => {
//                     removeUnit(selectedUnit._id);
//                     setDeleteModalOpen(false);
//                 }}
//             />

//         </section>
//     );
// };

// const ConfirmModal = ({ open, onClose, onConfirm, unitName }) => {
//   if (!open) return null;
//   return (
//        <div
//       className="fixed inset-0 flex items-center justify-center z-50"
//       style={{ backgroundColor: 'rgba(243, 216, 216, 0.4)' }}  //rgba(0,0,0,0.4)
//     >
      
//       <div className="bg-white rounded-lg p-6 shadow-lg min-w-[300px]">
//         {/* <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2> */}
//         <p className="mb-6">Are you sure you want to remove <span className="font-semibold text-red-600">{unitName}</span>?</p>
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


// export default Units;