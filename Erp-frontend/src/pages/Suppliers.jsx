import React, { useState, useEffect, useCallback, useRef } from 'react'
import { MdDeleteForever, MdOutlineAddToDrive, MdEdit, MdBusiness, MdEmail, MdPhone, MdLocationOn, MdAttachMoney } from "react-icons/md";
import { FaSearch, FaFilter, FaUserCircle, FaEye, FaCreditCard } from "react-icons/fa";
import { toast } from 'react-toastify';
import BackButton from '../components/shared/BackButton';
import SupplierAdd from '../components/suppliers/SupplierAdd';
import BottomNav from '../components/shared/BottomNav';
import { setSupplier } from '../redux/slices/supplierSlice';
import SupplierPayment from '../components/suppliers/SupplierPayment';
import DetailsModalSupplier from '../components/suppliers/DetailsModalSupplier';
import { useDispatch } from 'react-redux'
import { api } from '../https';
import SupplierEdit from '../components/suppliers/SupplierEdit';
import { motion, AnimatePresence } from 'framer-motion';

const Suppliers = () => {
    const dispatch = useDispatch();

    const Button = [
        { label: 'New Supplier', icon: <MdOutlineAddToDrive className='text-white' size={20} />, action: 'supplier' }
    ];

    const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
    const [list, setList] = useState([]);
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('-createdAt');
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        itemsPerPage: 10,
        totalItems: 0,
        totalPages: 1
    });
    const [isEditSupplierModal, setIsEditSupplierModal] = useState(false);
    const [currentSupplier, setCurrentSupplier] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [isDetailsModal, setIsDetailsModal] = useState(false);
    const [isPaymentModal, setIsPaymentModal] = useState(false);

    const handleOpenModal = (action) => {
        if (action === 'supplier') setIsSupplierModalOpen(true);
    };

    const fetchSuppliers = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.post('/api/suppliers/fetch', {
                search,
                sort,
                page: pagination.currentPage,
                limit: pagination.itemsPerPage
            });

            if (response.data.success) {
                setList(response.data.suppliers || []);
                if (response.data.pagination) {
                    setPagination(prev => ({
                        ...prev,
                        currentPage: response.data.pagination.currentPage ?? prev.currentPage,
                        itemsPerPage: response.data.pagination.limit ?? prev.itemsPerPage,
                        totalItems: response.data.pagination.total ?? prev.totalItems,
                        totalPages: response.data.pagination.totalPages ?? prev.totalPages
                    }));
                }
            } else {
                toast.error(response.data.message || 'Suppliers not found');
            }
        } catch (error) {
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error(error.message);
            }
            console.log(error);
        } finally {
            setLoading(false);
        }
    });

    const isInitialMount = useRef(true);
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            fetchSuppliers();
        }
    }, [search, sort, pagination.currentPage, pagination.itemsPerPage]);

    const handleEdit = (supplier) => {
        setCurrentSupplier(supplier);
        setIsEditSupplierModal(true);
    };

    const removeSupplier = async (id) => {
        try {
            const response = await api.post('/api/suppliers/remove', { id });
            if (response.data.success) {
                toast.success(response.data.message);
                await fetchSuppliers();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    const handleDetailsModal = (supplierId, supplierName, balance, email, action) => {
        dispatch(setSupplier({ supplierId, supplierName, balance, email }));
        if (action === 'details') setIsDetailsModal(true);
    };

    const handlePaymentModal = (supplierId, supplierName, balance, action) => {
        dispatch(setSupplier({ supplierId, supplierName, balance }));
        if (action === 'payment') setIsPaymentModal(true);
    };

    // Calculate statistics
    const totalSuppliers = list.length;
    const totalBalance = list.reduce((sum, supplier) => sum + (Number(supplier.balance) || 0), 0);
    const suppliersWithBalance = list.filter(supplier => (Number(supplier.balance) || 0) > 0).length;

    // Pagination controls
    const PaginationControls = () => {
        const handlePageChange = (newPage) => {
            setPagination(prev => ({
                ...prev,
                currentPage: newPage
            }));
        };

        const handleItemsPerPageChange = (newItemsPerPage) => {
            setPagination(prev => ({
                ...prev,
                itemsPerPage: newItemsPerPage,
                currentPage: 1
            }));
        };

        return (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4 p-4 bg-white rounded-xl border border-blue-100 shadow-sm">
                <div className="text-sm text-gray-600">
                    Showing <span className="font-semibold text-blue-700">{list.length}</span> of{' '}
                    <span className="font-semibold text-blue-700">{pagination.totalItems}</span> suppliers
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handlePageChange(pagination.currentPage - 1)}
                            disabled={pagination.currentPage === 1}
                            className="px-3 py-1.5 border border-blue-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                        >
                            Previous
                        </button>
                        <span className="text-sm text-gray-700">
                            Page <span className="font-semibold text-blue-700">{pagination.currentPage}</span> of{' '}
                            <span className="font-semibold text-blue-700">{pagination.totalPages}</span>
                        </span>
                        <button
                            onClick={() => handlePageChange(pagination.currentPage + 1)}
                            disabled={pagination.currentPage === pagination.totalPages}
                            className="px-3 py-1.5 border border-blue-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                        >
                            Next
                        </button>
                    </div>
                    <select
                        value={pagination.itemsPerPage}
                        onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                        className="border border-blue-200 rounded-lg px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="5">5 per page</option>
                        <option value="10">10 per page</option>
                        <option value="20">20 per page</option>
                        <option value="50">50 per page</option>
                    </select>
                </div>
            </div>
        );
    };

    return (
        <section className='min-h-screen w-full bg-gradient-to-b from-blue-50 to-white p-4 md:p-1'>
            <div className='max-w-7xl mx-auto'>
                {/* Header Section */}
                <div className='bg-white rounded-2xl shadow-xl mb-2 overflow-hidden border border-blue-100'>
                    <div className='flex flex-col md:flex-row justify-between items-start md:items-center p-4 md:p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white'>
                        <div className='flex items-center gap-3 mb-4 md:mb-0'>
                            <BackButton className="text-white hover:bg-white/20" />
                            <div className='flex items-center gap-3'>
                                <div className='bg-white/20 p-2 rounded-lg'>
                                    <MdBusiness className='w-6 h-6 text-white' />
                                </div>
                                <div>
                                    <h1 className='text-xl md:text-2xl font-bold'>Suppliers Management</h1>
                                    <p className='text-blue-100 text-sm'>Manage your supplier relationships efficiently</p>
                                </div>
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleOpenModal('supplier')}
                            className='flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-3 rounded-lg transition duration-200 cursor-pointer whitespace-nowrap'
                        >
                            <MdOutlineAddToDrive className='text-white w-5 h-5' />
                            <span className='font-medium'>Add New Supplier</span>
                        </motion.button>
                    </div>
                </div>

                {/* Stats Section */}
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6'>
                    <div className='bg-white rounded-xl p-4 border border-blue-100 shadow-sm'>
                        <div className='flex items-center gap-3'>
                            <div className='p-2 bg-blue-100 rounded-lg'>
                                <FaUserCircle className='w-5 h-5 text-blue-600' />
                            </div>
                            <div>
                                <p className='text-xs text-gray-500'>Total Suppliers</p>
                                <p className='text-xl font-bold text-blue-800'>{totalSuppliers}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className='bg-white rounded-xl p-4 border border-blue-100 shadow-sm'>
                        <div className='flex items-center gap-3'>
                            <div className='p-2 bg-blue-100 rounded-lg'>
                                <MdAttachMoney className='w-5 h-5 text-blue-600' />
                            </div>
                            <div>
                                <p className='text-xs text-gray-500'>Total Balance</p>
                                <p className='text-xl font-bold text-gray-800'>{totalBalance.toFixed(2)} AED</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className='bg-white rounded-xl p-4 border border-blue-100 shadow-sm'>
                        <div className='flex items-center gap-3'>
                            <div className='p-2 bg-blue-100 rounded-lg'>
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className='text-xs text-gray-500'>With Balance</p>
                                <p className='text-xl font-bold text-amber-600'>{suppliersWithBalance}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search and Filters Section */}
                <div className='bg-white rounded-2xl shadow-lg border border-blue-100 p-4 md:p-6 mb-6'>
                    <div className='flex flex-col md:flex-row gap-4'>
                        <div className='flex-1 relative'>
                            <input
                                type="text"
                                placeholder="Search suppliers by name, email, or contact..."
                                className="w-full pl-10 pr-4 py-2.5 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <div className='absolute left-3 top-1/2 transform -translate-y-1/2'>
                                <FaSearch className='w-4 h-4 text-gray-400' />
                            </div>
                        </div>
                        
                        <div className='flex items-center gap-3'>
                            <select
                                value={sort}
                                onChange={(e) => {
                                    setSort(e.target.value);
                                    setPagination(prev => ({ ...prev, currentPage: 1 }));
                                }}
                                className="border border-blue-200 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="-createdAt">Newest First</option>
                                <option value="createdAt">Oldest First</option>
                                <option value="supplierName">By Name (A-Z)</option>
                                <option value="-supplierName">By Name (Z-A)</option>
                                <option value='balance'>Balance (Low to High)</option>
                                <option value='-balance'>Balance (High to Low)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Loading Indicator */}
                {loading && (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-3 text-gray-600">Loading suppliers...</span>
                    </div>
                )}

                {/* Suppliers Table */}
                {!loading && (
                    <div className='bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden'>
                        <div className='p-4 md:p-6'>
                            <div className='overflow-x-auto'>
                                <table className='w-full'>
                                    <thead>
                                        <tr className='bg-gradient-to-r from-blue-50 to-blue-100 text-left'>
                                            <th className='p-3 text-xs font-semibold text-blue-700 uppercase tracking-wider'>Supplier Name</th>
                                            <th className='p-3 text-xs font-semibold text-blue-700 uppercase tracking-wider'>Contact Info</th>
                                            <th className='p-3 text-xs font-semibold text-blue-700 uppercase tracking-wider'>Address</th>
                                            <th className='p-3 text-xs font-semibold text-blue-700 uppercase tracking-wider'>Balance</th>
                                            <th className='p-3 text-xs font-semibold text-blue-700 uppercase tracking-wider text-center'>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className='divide-y divide-blue-100'>
                                        <AnimatePresence>
                                            {list.map((supplier, index) => (
                                                <motion.tr
                                                    key={supplier._id || index}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -20 }}
                                                    transition={{ duration: 0.2, delay: index * 0.05 }}
                                                    className='hover:bg-blue-50/50 transition-colors duration-150'
                                                >
                                                    <td className='p-3'>
                                                        <div className='flex items-center gap-2'>
                                                            <div className='p-1.5 bg-blue-100 rounded-md'>
                                                                <MdBusiness className='w-3 h-3 text-blue-600' />
                                                            </div>
                                                            <div>
                                                                <div className='font-medium text-gray-800'>{supplier.supplierName}</div>
                                                                {supplier.email && (
                                                                    <div className='text-xs text-gray-500 flex items-center gap-1 mt-1'>
                                                                        <MdEmail className='w-3 h-3' />
                                                                        {supplier.email}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className='p-3'>
                                                        <div className='text-sm text-gray-700'>
                                                            <div className='flex items-center gap-1'>
                                                                <MdPhone className='w-3 h-3 text-gray-400' />
                                                                <span>{supplier.contactNo || 'N/A'}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className='p-3'>
                                                        <div className='text-sm text-gray-600 flex items-start gap-1'>
                                                            <MdLocationOn className='w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0' />
                                                            <span className='line-clamp-2'>{supplier.address || 'N/A'}</span>
                                                        </div>
                                                    </td>
                                                    <td className='p-3'>
                                                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                                            (supplier.balance || 0) === 0 
                                                                ? 'bg-green-100 text-green-800' 
                                                                : 'bg-red-100 text-red-800'
                                                        }`}>
                                                            {(supplier.balance || 0).toFixed(2)} AED
                                                        </div>
                                                    </td>
                                                    <td className='p-3'>
                                                        <div className='flex items-center justify-center gap-2'>
                                                            <button
                                                                onClick={() => handleEdit(supplier)}
                                                                className='p-1.5 text-blue-600 hover:text-white hover:bg-blue-600 rounded-lg transition-all duration-200 cursor-pointer'
                                                                title="Edit Supplier"
                                                            >
                                                                <MdEdit className='w-4 h-4' />
                                                            </button>
                                                            <button
                                                                onClick={() => { setSelectedSupplier(supplier); setDeleteModalOpen(true); }}
                                                                className='p-1.5 text-red-500 hover:text-white hover:bg-red-500 rounded-lg transition-all duration-200 cursor-pointer'
                                                                title="Delete Supplier"
                                                            >
                                                                <MdDeleteForever className='w-4 h-4' />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDetailsModal(supplier._id, supplier.supplierName, supplier.balance, supplier.email, 'details')}
                                                                className='p-1.5 text-green-600 hover:text-white hover:bg-green-600 rounded-lg transition-all duration-200 cursor-pointer'
                                                                title="View Details"
                                                            >
                                                                <FaEye className='w-4 h-4' />
                                                            </button>
                                                            <button
                                                                onClick={() => handlePaymentModal(supplier._id, supplier.supplierName, supplier.balance, 'payment')}
                                                                className='p-1.5 text-purple-600 hover:text-white hover:bg-purple-600 rounded-lg transition-all duration-200 cursor-pointer'
                                                                title="Make Payment"
                                                            >
                                                                <FaCreditCard className='w-4 h-4' />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </AnimatePresence>
                                    </tbody>
                                </table>

                                {/* Empty State */}
                                {list.length === 0 && !loading && (
                                    <div className='text-center py-12'>
                                        <div className='mb-4 inline-flex p-4 bg-blue-50 rounded-full'>
                                            <MdBusiness className='w-12 h-12 text-blue-400' />
                                        </div>
                                        <h3 className='text-lg font-semibold text-gray-700 mb-2'>
                                            {search ? 'No suppliers found' : 'No suppliers available'}
                                        </h3>
                                        <p className='text-gray-500 mb-6 max-w-md mx-auto'>
                                            {search 
                                                ? `No suppliers match your search for "${search}". Try different keywords.`
                                                : 'Your suppliers list is empty. Start by adding your first supplier to manage business relationships.'
                                            }
                                        </p>
                                        {!search && (
                                            <button
                                                onClick={() => handleOpenModal('supplier')}
                                                className='inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg transition duration-200 cursor-pointer'
                                            >
                                                <MdOutlineAddToDrive className='w-4 h-4' />
                                                <span className='font-medium'>Add First Supplier</span>
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Pagination */}
                        {list.length > 0 && <PaginationControls />}
                    </div>
                )}

                {/* Footer Section */}
                <div className='mt-6 bg-white rounded-xl shadow-lg border border-blue-100 p-4'>
                    <div className='flex flex-col md:flex-row items-center justify-between gap-4'>
                        <div className='text-sm text-gray-600'>
                            <div className='flex items-center gap-2'>
                                <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
                                <span>Total: {totalSuppliers} suppliers • Total Balance: {totalBalance.toFixed(2)} AED</span>
                            </div>
                        </div>
                        <div className='text-xs text-gray-500'>
                            Last updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {isSupplierModalOpen && (
                <SupplierAdd
                    setIsSupplierModalOpen={setIsSupplierModalOpen}
                    fetchSuppliers={fetchSuppliers}
                />
            )}

            {isEditSupplierModal && currentSupplier && (
                <SupplierEdit
                    supplier={currentSupplier}
                    setIsEditSupplierModal={setIsEditSupplierModal}
                    fetchSuppliers={fetchSuppliers}
                />
            )}

            {isDetailsModal && <DetailsModalSupplier setIsDetailsModal={setIsDetailsModal} />}
            {isPaymentModal && <SupplierPayment setIsPaymentModal={setIsPaymentModal} fetchSuppliers={fetchSuppliers} />}

          
            <ConfirmModal
                open={deleteModalOpen}
                supplierName={selectedSupplier?.supplierName}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={() => {
                    removeSupplier(selectedSupplier?._id);
                    setDeleteModalOpen(false);
                }}
            />
        </section>
    );
};

const ConfirmModal = ({ open, onClose, onConfirm, supplierName }) => {
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
                        <h3 className='text-lg font-bold text-gray-800 mb-2'>Delete Supplier</h3>
                        <p className='text-gray-600'>
                            Are you sure you want to delete <span className='font-semibold text-red-600'>{supplierName}</span>?
                        </p>
                        <p className='text-sm text-gray-500 mt-2'>
                            This action cannot be undone. All supplier data and transaction history will be permanently removed.
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
                            Delete Supplier
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Suppliers;

// import React, { useState , useEffect ,useCallback, useRef  } from 'react'
// import { MdDeleteForever, MdOutlineAddToDrive } from "react-icons/md";
// import { LiaEditSolid } from "react-icons/lia";
// import { PiListMagnifyingGlassFill } from "react-icons/pi"
// import { TfiWrite } from "react-icons/tfi";
// import { FaCcAmazonPay } from "react-icons/fa";

// import { toast } from 'react-toastify';
// import BackButton from '../components/shared/BackButton';
// import SupplierAdd from '../components/suppliers/SupplierAdd';
// import BottomNav from '../components/shared/BottomNav';
// import { setSupplier } from '../redux/slices/supplierSlice';

// import SupplierPayment from '../components/suppliers/SupplierPayment';
// import DetailsModalSupplier from '../components/suppliers/DetailsModalSupplier';
// import { useDispatch } from 'react-redux'
// import { api } from '../https';
// import SupplierEdit from '../components/suppliers/SupplierEdit';

// const Suppliers = () => {

//     const dispatch = useDispatch();

//     const Button = [
//         { label : 'New Supplier' , icon : <MdOutlineAddToDrive className ='text-yellow-700' size={20} />, action :'supplier' }
//     ];

//     const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);

//     const handleOpenModal = (action) => {
//         if (action === 'supplier') setIsSupplierModalOpen(true)
//     }

            
//     const [list, setList] = useState([]);
//     const [search, setSearch] = useState('');
//     const [sort, setSort] = useState('-createdAt');
//     const [loading, setLoading] = useState(false);
//     const [pagination, setPagination] = useState({
//         currentPage: 1,
//         itemsPerPage: 10,
//         totalItems: 0,
//         totalPages: 1
//     });
    
//     const [isEditSupplierModal, setIsEditSupplierModal] = useState(false);
//     const [currentSupplier, setCurrentSupplier] = useState(null);

//     const fetchSuppliers = useCallback(async () => {
//         setLoading(true);
//         try {
//             const response = await api.post('/api/suppliers/fetch',
//                 {
//                     search,
//                     sort,
//                     page: pagination.currentPage,
//                     limit: pagination.itemsPerPage
//                 });

//             if (response.data.success) {
//                 setList(response.data.suppliers)

//                 if (response.data.pagination) {
//                     setPagination(prev => ({
//                         ...prev,  // Keep existing values
//                         currentPage: response.data.pagination.currentPage ?? prev.currentPage,
//                         itemsPerPage: response.data.pagination.limit ?? prev.itemsPerPage,
//                         totalItems: response.data.pagination.total ?? prev.totalItems,
//                         totalPages: response.data.pagination.totalPages ?? prev.totalPages
//                     }));
//                 };
//             } else {
//                 toast.error(response.data.message || 'supplier not found')
//             }

//         } catch (error) {
//             // Show backend error message if present in error.response
//             if (error.response && error.response.data && error.response.data.message) {
//                 toast.error(error.response.data.message);
//             } else {
//                 toast.error(error.message)
//             }
//             console.log(error)
//         } finally {
//             setLoading(false);
//         }
//     });

//     const isInitialMount = useRef(true);
//     useEffect(() => {
//         if (isInitialMount.current) {
//             isInitialMount.current = false;
//         } else {
//             fetchSuppliers();
//         }
//     }, [search, sort, pagination.currentPage, pagination.itemsPerPage]);


//     // Handle edit
//     const handleEdit = (supplier) => {
//         setCurrentSupplier(supplier);
//         setIsEditSupplierModal(true);
//     };

                
//     const [deleteModalOpen, setDeleteModalOpen] = useState(false);
//     const [selectedSupplier, setSelectedSupplier] = useState(null);
    
//     const removeSupplier = async (id) => {
                      
//         try {
                
//         const response = await api.post('/api/suppliers/remove', { id }, )
//         if (response.data.success){
//         toast.success(response.data.message)
                       
//         //Update the LIST after Remove
//         await fetchSuppliers();
                        
//         } else{
//             toast.error(response.data.message)
//         }
                    
//         } catch (error) {
//             console.log(error)
//             toast.error(error.message)
//         }
//     };



//     const detailsButton = [
//         { label: '', icon: <PiListMagnifyingGlassFill className='text-green-600' size={20} />, action: 'details' }
//     ]

//     const [isDetailsModal, setIsDetailsModal] = useState(false);

//     const handleDetailsModal = (supplierId, supplierName, balance, email, action) => {

//         dispatch(setSupplier({ supplierId, supplierName, balance, email }));
//         if (action === 'details') setIsDetailsModal(true);

//         // console.log(customerId)
//     };

//     const paymentButton = [
//         { label: '', icon: <FaCcAmazonPay className='text-[#0ea5e9]' size={20} />, action: 'payment' }
//     ]

//     const [isPaymentModal, setIsPaymentModal] = useState(false);

//     const handlePaymentModal = (supplierId, supplierName, balance, action) => {

//         dispatch(setSupplier({ supplierId, supplierName, balance }));
//         if (action === 'payment') setIsPaymentModal(true);

//         // console.log(customerId, customerName , balance)

//     };


//     // pagination
//     const PaginationControls = () => {

//         const handlePageChange = (newPage) => {
//             setPagination(prev => ({
//                 ...prev,
//                 currentPage: newPage
//             }));
//         };

//         const handleItemsPerPageChange = (newItemsPerPage) => {
//             setPagination(prev => ({
//                 ...prev,
//                 itemsPerPage: newItemsPerPage,
//                 currentPage: 1  // Reset to first page only when items per page changes
//             }));
//         };


//         return (  //[#0ea5e9]
//             <div className="flex justify-between items-center mt-2 py-2 px-5 bg-white shadow-lg/30 rounded-lg
//             text-xs font-medium border-b border-yellow-700 border-t border-yellow-700">
//                 <div>
//                     Showing
//                     <span className='text-yellow-700'> {list.length} </span>
//                     of
//                     <span className='text-yellow-700'> {pagination.totalItems} </span>
//                     records
//                 </div>
//                 <div className="flex gap-2">
//                     <button
//                         onClick={() => handlePageChange(pagination.currentPage - 1)}
//                         disabled={pagination.currentPage === 1}
//                         className="px-2 py-1 shadow-lg/30 border-b border-yellow-700
//                         text-xs font-normal disabled:opacity-50"
//                     >
//                         Previous
//                     </button>

//                     <span className="px-3 py-1">
//                         Page
//                         <span className='text-yellow-700'> {pagination.currentPage} </span>
//                         of
//                         <span className='text-yellow-700'> {pagination.totalPages} </span>
//                     </span>

//                     <button
//                         onClick={() => handlePageChange(pagination.currentPage + 1)}
//                         disabled={pagination.currentPage === pagination.totalPages}
//                         className="px-2 py-1 shadow-lg/30 border-b border-yellow-700 text-xs font-normal disabled:opacity-50"
//                     >
//                         Next
//                     </button>

//                     <select
//                         value={pagination.itemsPerPage}
//                         onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
//                         className="border-b border-yellow-700 px-2 font-normal shadow-lg/30"
//                     >
//                         <option value="5">5 per page</option>
//                         <option value="10">10 per page</option>
//                         <option value="20">20 per page</option>
//                         <option value="50">50 per page</option>
//                     </select>
//                 </div>
//             </div>
//         );
//     };

//     return(
//         <section className ='h-[100vh] overflow-y-scroll scrollbar-hidden'>

//             <div className='flex items-center justify-between px-5 py-2 shadow-xl mb-2'>
//                 <div className='flex items-center gap-2'>
//                     <BackButton />
//                     <h1 className='text-md font-semibold text-[#1a1a1a]'>Suppliers Management</h1>
//                 </div>
                                                                
//                 <div className ='flex gap-2 items-center justify-around gap-3 hover:bg-yellow-700 shadow-lg/30 bg-white'>
//                     {Button.map(({ label, icon, action}) => {
//                         return(
//                         <button 
//                             onClick = {() => handleOpenModal(action)}
//                             className ='bg-white px-4 py-2 text-[#1a1a1a] cursor-pointer
//                                     font-semibold text-xs flex items-center gap-2 rounded-full'> 
//                             {label} {icon}
//                         </button>
//                         )
//                     })}
//                 </div>
                                                            
//                 {isSupplierModalOpen && 
//                 <SupplierAdd 
//                 setIsSupplierModalOpen ={setIsSupplierModalOpen} 
//                 fetchSuppliers ={fetchSuppliers}
//                 />
//                 }
                                                            
//             </div>

//             {/* Search and sorting and Loading */}
//             <div className="flex items-center px-15 py-2 shadow-xl">
//                 <input
//                     type="text"
//                     placeholder="Search Suppliers..."
//                     className="border border-yellow-700 p-1 rounded-lg w-full text-xs font-semibold"
//                     // max-w-md
//                     value={search}
//                     onChange={(e) => setSearch(e.target.value)}
//                 />
//                 {/* Optional: Sort dropdown */}
//                 <select
//                     className="ml-4 border border-yellow-700 p-1  rounded-lg text-[#1a1a1a] text-xs font-semibold]"
//                     value={sort}

//                     onChange={(e) => {
//                         setSort(e.target.value);
//                         setPagination(prev => ({ ...prev, currentPage: 1 })); // Reset to first page when changing sort
//                     }}
//                 >
//                     <option value="-createdAt">Newest First</option>
//                     <option value="createdAt">Oldest First</option>
//                     <option value="supplierName">By Name (A-Z)</option>
//                     <option value="-supplierName">By Name (Z-A)</option>
//                     <option value='balance'>Balance (Low to High)</option>
//                 </select>
//             </div>

//             {/* Loading Indicator */}
//             {loading && (
//                 <div className="mt-4 flex justify-center">
//                     <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-700"></div>
//                     <span className="ml-2">Loading Suppliers...</span>
//                 </div>
//             )}


//             <div className='mt-5 bg-white py-1 px-10' >

//                 <div className='overflow-x-auto'>
//                     <table className='text-left w-full'>
//                         <thead>
//                             <tr className='bg-white border-b-2 border-yellow-700 text-[#1a1a1a] text-xs font-normal'>
//                                 <th className='p-2'>Name</th>
//                                 <th className='p-2'>Email</th>
//                                 <th className='p-2'>Contact No</th>
//                                 <th className='p-2'>Address</th>
//                                 <th className='p-2'>Balance</th>

//                                 <th className='p-2'></th>
//                             </tr>
//                         </thead>

//                         <tbody>

//                             {/* {list.length === 0 
//                         ? (<p className ='ml-5 mt-5 text-xs text-red-700 flex items-start justify-start'>Your supplieres list is empty . Start adding suppliers !</p>) 
//                         :
//                          */}

//                             {
//                                 list.map((supplier, index) => (

//                                     <tr
//                                         // key ={index}
//                                         className='border-b-3 border-[#f5f5f5] text-xs font-normal text-[#1a1a1a] 
//                             hover:bg-[#F1E8D9] cursor-pointer'
//                                     >
//                                         <td className='p-2' hidden>{supplier._id}</td>
//                                         <td className='p-2'>{supplier.supplierName}</td>
//                                         <td className='p-2'>{supplier.email}</td>
//                                         <td className='p-2'>{supplier.contactNo}</td>
//                                         <td className='p-2'>{supplier.address}</td>
//                                         <td className={`p-2 ${supplier.balance === 0 ? 'text-green-600' : 'text-[#be3e3f]'}`}>
//                                             {supplier.balance.toFixed(2)}
//                                             <span className='text-[#1a1a1a] font-normal'> AED</span>
//                                         </td>


//                                         <td className='p-1 text-center flex gap-1'>
//                                             <button
//                                             >
//                                                 <LiaEditSolid size={20}
//                                                     className='w-5 h-5 text-[#0ea5e9] rounded-full flex justify-end cursor-pointer hover:bg-[#0ea5e9]/30'
//                                                     onClick={() => handleEdit(supplier)}
//                                                 />
//                                             </button>

//                                             <button
//                                             >
//                                                 <MdDeleteForever onClick={() => { setSelectedSupplier(supplier); setDeleteModalOpen(true); }}
//                                                     size={20}
//                                                     className='w-5 h-5 text-[#be3e3f] rounded-full cursor-pointer hover:bg-[#be3e3f]/30' />
//                                             </button>

//                                             {detailsButton.map(({ label, icon, action }) => {

//                                                 return (
//                                                     <button
//                                                         className='cursor-pointer hover:bg-emerald-600/30 rounded-full'
//                                                         onClick={() => handleDetailsModal(supplier._id, supplier.supplierName, supplier.balance, supplier.email,action)}
//                                                     >
//                                                         {label} {icon}
//                                                     </button>
//                                                 )
//                                             })}


//                                             {paymentButton.map(({ label, icon, action }) => {

//                                                 return (
//                                                     <button
//                                                         className='cursor-pointer rounded-full  text-xs font-semibold text-sm flex 
//                                                         items-center ml-1'
//                                                         onClick={() => handlePaymentModal(supplier._id, supplier.supplierName, supplier.balance, action)}
//                                                     >
//                                                         {label} {icon}
//                                                     </button>
//                                                 )
//                                             })}

//                                         </td>


//                                     </tr>
//                                 ))}
//                         </tbody>
//                         <tfoot>
//                             <tr className="bg-[#F1E8D9] border-t-2 border-yellow-700 text-yellow-600 text-xs font-semibold">
//                                 <td className="p-2 text-[#1a1a1a]">{list.length}<span className='font-normal'> Supplier</span></td>

//                                 <td className="p-2" colSpan={3}></td>
//                                 <td className="p-2"></td>
//                                 <td className="p-2" colSpan={1}></td>
//                             </tr>
//                         </tfoot>
//                     </table>
//                     {!loading && list.length === 0 && (
//                         <p className='ml-5 mt-5 text-xs text-[#be3e3f] flex items-start justify-start '>
//                             {search
//                                 ? `No supplier found for "${search}"`
//                                 : `Your suppliers list is empty . Start adding suppliers !`}

//                         </p>
//                     )}
//                 </div>
//                 <PaginationControls />
//             </div>

//             {isEditSupplierModal && currentSupplier && (
//                 <SupplierEdit
//                     supplier= {currentSupplier}
//                     setIsEditSupplierModal= {setIsEditSupplierModal}
//                     fetchSuppliers= {fetchSuppliers}
//                 />
//             )}

               
//             {isDetailsModal && <DetailsModalSupplier setIsDetailsModal={setIsDetailsModal} />} 
            
//             {isPaymentModal && 
//             <SupplierPayment 
//             setIsPaymentModal={setIsPaymentModal} 
//             fetchSuppliers ={fetchSuppliers}
//             />
//             }    
                         
            

//             <BottomNav />

//             {/* Place the ConfirmModal here */}
//             <ConfirmModal
//                 open={deleteModalOpen}
//                 supplierName={selectedSupplier?.supplierName}
//                 onClose={() => setDeleteModalOpen(false)}
//                 onConfirm={() => {
//                     removeSupplier(selectedSupplier._id);
//                     setDeleteModalOpen(false);
//                 }}
//             />

//         </section>
//     );
// };

// // You can put this at the bottom of your Services.jsx file or in a separate file
// const ConfirmModal = ({ open, onClose, onConfirm, supplierName }) => {
//   if (!open) return null;
//   return (
//        <div
//       className="fixed inset-0 flex items-center justify-center z-50"
//       style={{ backgroundColor: 'rgba(243, 216, 216, 0.4)' }}  //rgba(0,0,0,0.4)
//     >
      
//       <div className="bg-white rounded-lg p-6 shadow-lg min-w-[300px]">
//         {/* <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2> */}
//         <p className="mb-6">Are you sure you want to remove <span className="font-semibold text-red-600">{supplierName}</span>?</p>
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
// export default Suppliers ;