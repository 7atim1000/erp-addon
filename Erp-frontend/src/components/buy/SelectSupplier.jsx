import React, {useState, useEffect, useCallback} from 'react'
import { motion } from 'framer-motion'
import { IoCloseCircle } from 'react-icons/io5';
import { useDispatch } from 'react-redux'
import { PiUserCircleCheckLight } from "react-icons/pi";
import { FaSearch, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaWallet, FaFilter, FaUsers } from 'react-icons/fa';
import { toast } from 'react-toastify'
import { setSupplier } from '../../redux/slices/supplierSlice';
import { api } from '../../https';

const SelectSupplier = ({setIsSelectSupplierModalOpen}) => {
    const dispatch = useDispatch();
    
    const handleClose = (supplierId, supplierName, email, balance) => {
        dispatch(setSupplier({ supplierId, supplierName, email, balance }));
        setIsSelectSupplierModalOpen(false);
    };

    // fetch supplier - any error on .map or length check next function
    const [list, setList] = useState([]);
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('-createdAt');
    const [loading, setLoading] = useState(false);
    const [debouncedSearch, setDebouncedSearch] = useState('');

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 400);

        return () => clearTimeout(timer);
    }, [search]);

    const fetchSuppliers = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.post('/api/suppliers/fetch', {
                search: debouncedSearch,
                sort,
                page: 1,
                limit: 1000
            });
        
            if (response.data.success) {
                setList(response.data.suppliers)
                console.log(response.data.suppliers)
            } else {
                toast.error(response.data.message || 'Supplier not found')
            }

        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error(error.message);
            }
            console.error(error);

        } finally {
            setLoading(false);
        }
    }, [debouncedSearch, sort]);
        
 
    useEffect(() => {
        fetchSuppliers();
    }, [fetchSuppliers]);

    return (
        <div className='fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className='bg-gradient-to-b from-white to-blue-50 rounded-2xl shadow-2xl border border-blue-200 w-full max-w-6xl max-h-[90vh] flex flex-col'
            >
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-2xl">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-2.5 rounded-lg">
                            <FaUsers className="text-white w-5 h-5" />
                        </div>
                        <div>
                            <h2 className='text-white text-lg md:text-xl font-bold'>Select Supplier</h2>
                            <p className='text-blue-100 text-sm'>Choose a supplier for your purchase</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsSelectSupplierModalOpen(false)}
                        className='p-2 text-white hover:bg-white/20 rounded-lg transition-all duration-200 cursor-pointer'
                        aria-label="Close"
                    >
                        <IoCloseCircle size={28} />
                    </button>
                </div>

                {/* Search and Filter Section */}
                <div className='p-6 border-b border-blue-100'>
                    <div className='flex flex-col md:flex-row gap-4'>
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaSearch className="h-5 w-5 text-blue-400" />
                            </div>
                            <input
                                type='text'
                                placeholder='Search suppliers by name, email, or phone...'
                                className='w-full pl-10 pr-4 py-3 border border-blue-200 rounded-xl bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition duration-200'
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="flex items-center gap-2 px-4 py-3 bg-blue-50 text-blue-700 rounded-xl border border-blue-200 hover:bg-blue-100 transition duration-200 cursor-pointer">
                                <FaFilter className="w-4 h-4" />
                                <span className="text-sm font-medium">Sort</span>
                            </button>
                            <div className="text-sm text-gray-500 bg-blue-50 px-3 py-2 rounded-lg">
                                {list.length} suppliers
                            </div>
                        </div>
                    </div>
                </div>

                {/* Loading Indicator */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                        <p className="text-gray-600 font-medium">Loading Suppliers...</p>
                        <p className="text-sm text-gray-500 mt-2">Please wait while we fetch the supplier list</p>
                    </div>
                )}

                {/* Content Area */}
                <div className="flex-1 overflow-hidden">
                    {!loading && list.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                            <div className="mb-6 p-4 bg-blue-50 rounded-full">
                                <FaUsers className="w-12 h-12 text-blue-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                {debouncedSearch ? 'No Suppliers Found' : 'No Suppliers Available'}
                            </h3>
                            <p className="text-gray-500 max-w-md">
                                {debouncedSearch
                                    ? `No suppliers found matching "${debouncedSearch}"`
                                    : 'Your supplier list is empty. Start by adding new suppliers!'}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-y-auto h-full">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                                {list.map((supplier) => (
                                    <motion.div
                                        key={supplier._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="group bg-white border border-blue-100 rounded-xl p-5 hover:border-blue-300 hover:shadow-lg transition-all duration-300 cursor-pointer"
                                        onClick={() => handleClose(supplier._id, supplier.supplierName, supplier.email, supplier.balance)}
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
                                                    <FaUser className="text-white w-5 h-5" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-bold text-gray-800 text-lg truncate">
                                                        {supplier.supplierName}
                                                    </h3>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                            Number(supplier.balance) === 0
                                                                ? 'bg-green-100 text-green-700'
                                                                : 'bg-red-100 text-red-700'
                                                        }`}>
                                                            {Number(supplier.balance) === 0 ? 'Balance Clear' : 'Has Balance'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <PiUserCircleCheckLight className="w-7 h-7 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                                                    <FaEnvelope className="w-3.5 h-3.5 text-blue-500" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs text-gray-500">Email</p>
                                                    <p className="text-sm font-medium text-gray-700 truncate">
                                                        {supplier.email || 'Not provided'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                                                    <FaPhone className="w-3.5 h-3.5 text-blue-500" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs text-gray-500">Contact</p>
                                                    <p className="text-sm font-medium text-gray-700">
                                                        {supplier.contactNo || 'Not provided'}
                                                    </p>
                                                </div>
                                            </div>

                                            {supplier.address && (
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                                                        <FaMapMarkerAlt className="w-3.5 h-3.5 text-blue-500" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs text-gray-500">Address</p>
                                                        <p className="text-sm font-medium text-gray-700 line-clamp-2">
                                                            {supplier.address}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-5 pt-4 border-t border-blue-100">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <FaWallet className="w-4 h-4 text-gray-400" />
                                                    <span className="text-sm text-gray-500">Balance</span>
                                                </div>
                                                <span className={`text-lg font-bold ${
                                                    Number(supplier.balance) === 0
                                                        ? 'text-green-600'
                                                        : Number(supplier.balance) > 0
                                                            ? 'text-red-600'
                                                            : 'text-blue-600'
                                                }`}>
                                                    {Number(supplier.balance).toFixed(2)} <span className="text-sm font-normal text-gray-500">AED</span>
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mt-4 text-center">
                                            <button className="w-full py-2.5 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-lg font-medium text-sm hover:from-blue-100 hover:to-blue-200 transition duration-200 cursor-pointer">
                                                Select Supplier
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className='p-4 border-t border-blue-100 bg-gradient-to-r from-blue-50 to-white rounded-b-2xl'>
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span>Showing <span className="font-semibold text-blue-700">{list.length}</span> suppliers</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setIsSelectSupplierModalOpen(false)}
                                className="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200 cursor-pointer text-sm font-medium"
                            >
                                Cancel
                            </button>
                            <div className="text-xs text-gray-500">
                                Click on a supplier card to select
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default SelectSupplier;

// import React, {useState, useEffect, useCallback} from 'react'
// import { motion } from 'framer-motion'
// import { IoCloseCircle } from 'react-icons/io5';
// import { useDispatch } from 'react-redux'
// import { PiUserCircleCheckLight } from "react-icons/pi";
// import { toast } from 'react-toastify'

// import { setSupplier } from '../../redux/slices/supplierSlice';
// import { api } from '../../https';

// const SelectSupplier = ({setIsSelectSupplierModalOpen}) => {

//      const dispatch = useDispatch();
    
//     const handleClose = (supplierId, supplierName, email, balance) => {
//         dispatch(setSupplier({ supplierId, supplierName, email, balance }));
//         setIsSelectSupplierModalOpen(false);
//     };

//     // fetch supplier - any error on .map or length check next function
//     const [list, setList] = useState([]);
//     const [search, setSearch] = useState('');
//     const [sort, setSort] = useState('-createdAt');
//     const [loading, setLoading] = useState(false);
//     const [debouncedSearch, setDebouncedSearch] = useState('');

//     // Debounce search input
//     useEffect(() => {
//         const timer = setTimeout(() => {
//             setDebouncedSearch(search);
//         }, 400);

//         return () => clearTimeout(timer);
//     }, [search]);


//     const fetchSuppliers = useCallback(async () => {
//         setLoading(true);
//         try {
//             const response = await api.post('/api/suppliers/fetch', {
//                 search: debouncedSearch,
//                 sort,
//                 page: 1,
//                 limit: 1000
//             });
        
//             if (response.data.success) {
//                 setList(response.data.suppliers)
//                 console.log(response.data.suppliers)
//             } else {
//                 toast.error(response.data.message || 'supplier not found')
//             }


//         } catch (error) {
//             if (error.response && error.response.data && error.response.data.message) {
//                 toast.error(error.response.data.message);
//             } else {
//                 toast.error(error.message);
//             }
//             console.error(error);

//         } finally {
//             setLoading(false);
//         }
//     }, [debouncedSearch, sort]);
        
 
//     useEffect(() => {
//         fetchSuppliers();
//     }, [fetchSuppliers]  // was[fetchSuppliers()] have error :-

// );




//     return (
//         <div className='fixed inset-0 bg-opacity-50 flex items-center justify-center shadow-lg/30 z-50'
//             style={{ backgroundColor: 'rgba(20, 10, 10, 0.4)' }}>

//             <motion.div
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.9 }}
//                 transition={{ duration: 0.3, ease: 'easeInOut' }}
//                 className='bg-white p-3 rounded-lg shadow-lg/30 w-175 h-[calc(100vh-2rem)] md:mt-5 mt-5 
//                        border-b-3 border-yellow-700'
//             >


//                 {/*Modal Header */}
//                 <div className="flex justify-between items-center mb-2 shadow-xl p-2">
//                     <h2 className='text-[#1a1a1a] text-sm font-semibold underline'>Please select supplier</h2>
//                     <button
//                         onClick={() => setIsSelectSupplierModalOpen(false)}
//                         className='rounded-sm border-b border-[#be3e3f] text-[#be3e3f]
//                             cursor-pointer hover:bg-[#be3e3f]/30 transition-all duration-150 ease-in-out'
//                     >
//                         <IoCloseCircle size={25} />
//                     </button>
//                 </div>
//                 {/* Search Input */}
//                 <div className='flex items-center p-2 shadow-xl'>
//                     <input
//                         type='text'
//                         placeholder='Search suppliers'
//                         className='w-full border-b border-yellow-700 bg-[#F1E8D9] p-2 text-sm focus:outline-none rounded-sm'
//                         value={search}
//                         onChange={(e) => setSearch(e.target.value)}
//                     />
//                 </div>
//                 {/* Loading Indicator */}
//                 {loading && (
//                     <div className="mt-4 flex justify-center">
//                         <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-700"></div>
//                         <span className="ml-2">Loading Suppliers...</span>
//                     </div>
//                 )}


//                 {/*Modal Body*/}
//                 <div className='mt-5'>


//                     <div className='overflow-x-auto'>
//                         <table className='text-left w-full'>
//                             <thead>
//                                 <tr className='bg-white border-b-2 border-yellow-700 text-[#1a1a1a] text-xs font-normal'>
//                                     <th className='p-2'>Name</th>
//                                     <th className='p-2'>Email</th>
//                                     <th className='p-2'>Contact No</th>
//                                     <th className='p-2'>Address</th>
//                                     <th className='p-2'>Balance</th>
//                                     <th className='p-2'></th>
//                                 </tr>
//                             </thead>

//                             <tbody>

//                                 {list.map((supplier) => (

//                                     <tr
//                                         // key={supplier._id}
//                                         className='border-b-3 border-[#f5f5f5] text-xs font-normal text-[#1a1a1a] hover:bg-[#F1E8D9] cursor-pointer'
//                                     >
//                                         <td className='p-2' hidden>{supplier._id}</td>
//                                         <td className='p-4'>{supplier.supplierName}</td>
//                                         <td className='p-4'>{supplier.email}</td>
//                                         <td className='p-2'>{supplier.contactNo}</td>
//                                         <td className='p-2'>{supplier.address}</td>

//                                         <td
//                                             className={`p-2 ${supplier.balance === 0 ? 'text-[#1a1a1a]' : 'text-[#be3e3f]'} font-semibold`}>
//                                             {(Number(supplier.balance) || 0).toFixed(2)}
//                                         </td>

//                                         <td className='p-2'>
//                                             <button >
//                                                 <PiUserCircleCheckLight
//                                                     className='w-7 h-7 text-[#0ea5e9] rounded-full flex justify-end cursor-pointer'
//                                                     onClick={() => handleClose(supplier._id, supplier.supplierName, supplier.email, supplier.balance)} />
//                                             </button>
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                         {!loading && list.length === 0 && (
//                             <p className='ml-5 mt-5 text-xs text-[#be3e3f] flex items-start justify-start'>
//                                 {debouncedSearch
//                                     ? `No supplier found for "${debouncedSearch}"`
//                                     : 'Your supplier list is empty. Start adding supplier!'}
//                             </p>
//                         )}

//                     </div>
//                 </div>
//                 <div className='mt-4 pt-3 border-t border-gray-200 text-sm text-gray-500'>
//                     Showing {list.length} Supplier
//                 </div>

//             </motion.div>
//         </div>
//     );
// }
// export default SelectSupplier ;