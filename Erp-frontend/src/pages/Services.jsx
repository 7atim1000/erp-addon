import React ,{useState, useEffect, useRef, useCallback} from 'react'
import goods from '../assets/images/goods.jpg' 
import { MdDeleteForever, MdOutlineAddToDrive, MdEdit, MdInventory, MdCategory, MdAttachMoney, MdShoppingCart } from "react-icons/md";
import { FaBox, FaSearch, FaFilter, FaSortAmountDown } from "react-icons/fa";
import { api } from '../https';
import { toast } from 'react-toastify'
import BackButton from '../components/shared/BackButton';
import ServiceAdd from '../components/services/ServiceAdd';
import BottomNav from '../components/shared/BottomNav';
import ServiceEdit from '../components/services/ServiceEdit';
import { motion, AnimatePresence } from 'framer-motion';

const Services = () => {
    const addBtn = [{label :'New Item' , action :'items' , icon: <MdOutlineAddToDrive className='text-white' size={20} /> }]

    const [isAddItemModal, setIsAddItemModal] = useState(false)
    const handleAddItemModal = (action) => {
        if(action === 'items') setIsAddItemModal(true)
    };

    // State variables
    const [list, setList] = useState([]);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [sort, setSort] = useState('-createdAt');
    const [pagination, setPagination] = useState({
        currentPage: 1,
        itemsPerPage: 10,
        totalItems: 0,
        totalPages: 1
    });
    const [loading, setLoading] = useState(false);
    const [isEditItemModal, setIsEditItemModal] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState(null);

    // Fetch items
    const fetchItems = async () => {
        setLoading(true);
        try {
            const response = await api.post('/api/services/fetch', {
                category,
                search,
                sort,
                page: pagination.currentPage,
                limit: pagination.itemsPerPage
            });

            if (response.data.success) {
                setList(response.data.data || []);
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
                toast.error(response.data.message || 'Empty items list');
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Debounced search
    const isInitialMount = useRef(true);
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (isInitialMount.current) {
                isInitialMount.current = false;
                fetchItems();
            } else {
                fetchItems();
            }
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [search, sort, pagination.currentPage, pagination.itemsPerPage]);

    // Handle edit
    const handleEdit = (item) => {
        setCurrentItem(item);
        setIsEditItemModal(true);
    };

    // Remove item
    const removeItem = async (id) => {
        try {
            const response = await api.post('/api/services/remove', { id });
            if (response.data.success) {
                toast.success(response.data.message);
                await fetchItems();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    // Calculate statistics
    const totalItems = list.length;
    const totalValue = list.reduce((sum, item) => sum + (Number(item.price) * Number(item.qty || 0)), 0);
    const lowStockItems = list.filter(item => Number(item.qty || 0) <= 5).length;

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
            <div className=" flex flex-col sm:flex-row justify-between items-center gap-4 mt-4 p-4 bg-white rounded-xl border border-blue-100 shadow-sm">
                <div className="text-sm text-gray-600">
                    Showing <span className="font-semibold text-blue-700">{list.length}</span> of{' '}
                    <span className="font-semibold text-blue-700">{pagination.totalItems}</span> items
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
        <section className='min-h-screen w-full bg-gradient-to-b from-blue-50 to-white p-4 md:p-6'>
            <div className='max-w-7xl mx-auto'>
                {/* Header Section */}
                <div className='bg-white rounded-2xl shadow-xl mb-6 overflow-hidden border border-blue-100'>
                    <div className='flex flex-col md:flex-row justify-between items-start md:items-center p-4 md:p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white'>
                        <div className='flex items-center gap-3 mb-4 md:mb-0'>
                            <BackButton className="text-white hover:bg-white/20" />
                            <div className='flex items-center gap-3'>
                                <div className='bg-white/20 p-2 rounded-lg'>
                                    <FaBox className='w-6 h-6 text-white' />
                                </div>
                                <div>
                                    <h1 className='text-xl md:text-2xl font-bold'>Items Management</h1>
                                    <p className='text-blue-100 text-sm'>Manage your inventory items efficiently</p>
                                </div>
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleAddItemModal('items')}
                            className='flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-3 rounded-lg transition duration-200 cursor-pointer whitespace-nowrap'
                        >
                            <MdOutlineAddToDrive className='text-white w-5 h-5' />
                            <span className='font-medium'>Add New Item</span>
                        </motion.button>
                    </div>
                </div>

                {/* Stats Section */}
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6'>
                    <div className='bg-white rounded-xl p-4 border border-blue-100 shadow-sm'>
                        <div className='flex items-center gap-3'>
                            <div className='p-2 bg-blue-100 rounded-lg'>
                                <MdInventory className='w-5 h-5 text-blue-600' />
                            </div>
                            <div>
                                <p className='text-xs text-gray-500'>Total Items</p>
                                <p className='text-xl font-bold text-blue-800'>{totalItems}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className='bg-white rounded-xl p-4 border border-blue-100 shadow-sm'>
                        <div className='flex items-center gap-3'>
                            <div className='p-2 bg-blue-100 rounded-lg'>
                                <MdAttachMoney className='w-5 h-5 text-blue-600' />
                            </div>
                            <div>
                                <p className='text-xs text-gray-500'>Inventory Value</p>
                                <p className='text-xl font-bold text-green-600'>{totalValue.toFixed(2)} AED</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className='bg-white rounded-xl p-4 border border-blue-100 shadow-sm'>
                        <div className='flex items-center gap-3'>
                            <div className='p-2 bg-blue-100 rounded-lg'>
                                <MdShoppingCart className='w-5 h-5 text-blue-600' />
                            </div>
                            <div>
                                <p className='text-xs text-gray-500'>Low Stock Items</p>
                                <p className='text-xl font-bold text-red-600'>{lowStockItems}</p>
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
                                placeholder="Search items by name, category, or description..."
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
                                <option value="category">By Category (A-Z)</option>
                                <option value="serviceName">By Name (A-Z)</option>
                                <option value="-serviceName">By Name (Z-A)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Loading Indicator */}
                {loading && (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-3 text-gray-600">Loading items...</span>
                    </div>
                )}

                {/* Items Table */}
                {!loading && (
                    <div className='bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden'>
                        <div className='p-4 md:p-6'>
                            <div className='overflow-x-auto'>
                                <table className='w-full'>
                                    <thead>
                                        <tr className='bg-gradient-to-r from-blue-50 to-blue-100 text-left'>
                                            <th className='p-3 text-xs font-semibold text-blue-700 uppercase tracking-wider'>
                                                <div className='flex items-center gap-2'>
                                                    <MdCategory className='w-3 h-3' />
                                                    Category
                                                </div>
                                            </th>
                                            <th className='p-3 text-xs font-semibold text-blue-700 uppercase tracking-wider'>Item Name</th>
                                            <th className='p-3 text-xs font-semibold text-blue-700 uppercase tracking-wider'>Sale Price</th>
                                            <th className='p-3 text-xs font-semibold text-blue-700 uppercase tracking-wider'>Buy Price</th>
                                            <th className='p-3 text-xs font-semibold text-blue-700 uppercase tracking-wider'>Quantity</th>
                                            <th className='p-3 text-xs font-semibold text-blue-700 uppercase tracking-wider'>Image</th>
                                            <th className='p-3 text-xs font-semibold text-blue-700 uppercase tracking-wider text-center'>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className='divide-y divide-blue-100'>
                                        <AnimatePresence>
                                            {list.map((item, index) => (
                                                <motion.tr
                                                    key={item._id || index}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -20 }}
                                                    transition={{ duration: 0.2, delay: index * 0.05 }}
                                                    className='hover:bg-blue-50/50 transition-colors duration-150'
                                                >
                                                    <td className='p-3'>
                                                        <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
                                                            {item.category || 'Uncategorized'}
                                                        </span>
                                                    </td>
                                                    <td className='p-3'>
                                                        <div className='font-medium text-gray-800'>{item.serviceName}</div>
                                                    </td>
                                                    <td className='p-3'>
                                                        <div className='flex items-center gap-1'>
                                                            <span className='font-semibold text-green-600'>{item.price || '0.00'}</span>
                                                            <span className='text-xs text-gray-500'>AED</span>
                                                        </div>
                                                    </td>
                                                    <td className='p-3'>
                                                        <div className='flex items-center gap-1'>
                                                            <span className='font-semibold text-blue-600'>{item.buyingPrice || '0.00'}</span>
                                                            <span className='text-xs text-gray-500'>AED</span>
                                                        </div>
                                                    </td>
                                                    <td className='p-3'>
                                                        <div className='flex items-center gap-2'>
                                                            <span className={`font-semibold ${Number(item.qty || 0) <= 5 ? 'text-red-600' : 'text-gray-800'}`}>
                                                                {item.qty || 0}
                                                            </span>
                                                            <span className='text-xs text-gray-500'>{item.unit}</span>
                                                            {Number(item.qty || 0) <= 5 && (
                                                                <span className='text-xs text-red-500 font-medium'>Low Stock</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className='p-3'>
                                                        <div className='w-10 h-10 rounded-full overflow-hidden border-2 border-blue-200'>
                                                            <img 
                                                                src={item.image || goods} 
                                                                alt={item.serviceName}
                                                                className='w-full h-full object-cover'
                                                            />
                                                        </div>
                                                    </td>
                                                    <td className='p-3'>
                                                        <div className='flex items-center justify-center gap-2'>
                                                            <button
                                                                onClick={() => handleEdit(item)}
                                                                className='p-1.5 text-blue-600 hover:text-white hover:bg-blue-600 rounded-lg transition-all duration-200 cursor-pointer'
                                                                title="Edit Item"
                                                            >
                                                                <MdEdit className='w-4 h-4' />
                                                            </button>
                                                            <button
                                                                onClick={() => { setSelectedService(item); setDeleteModalOpen(true); }}
                                                                className='p-1.5 text-red-500 hover:text-white hover:bg-red-500 rounded-lg transition-all duration-200 cursor-pointer'
                                                                title="Delete Item"
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

                                {/* Empty State */}
                                {list.length === 0 && !loading && (
                                    <div className='text-center py-12'>
                                        <div className='mb-4 inline-flex p-4 bg-blue-50 rounded-full'>
                                            <FaBox className='w-12 h-12 text-blue-400' />
                                        </div>
                                        <h3 className='text-lg font-semibold text-gray-700 mb-2'>
                                            {search ? 'No items found' : 'No items available'}
                                        </h3>
                                        <p className='text-gray-500 mb-6 max-w-md mx-auto'>
                                            {search 
                                                ? `No items match your search for "${search}". Try different keywords.`
                                                : 'Your items list is empty. Start by adding your first item to manage your inventory.'
                                            }
                                        </p>
                                        {!search && (
                                            <button
                                                onClick={() => handleAddItemModal('items')}
                                                className='inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg transition duration-200 cursor-pointer'
                                            >
                                                <MdOutlineAddToDrive className='w-4 h-4' />
                                                <span className='font-medium'>Add First Item</span>
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
                                <span>Total: {pagination.totalItems} items • Inventory Value: {totalValue.toFixed(2)} AED</span>
                            </div>
                        </div>
                        <div className='text-xs text-gray-500'>
                            Last updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {isAddItemModal && (
                <ServiceAdd
                    setIsAddItemModal={setIsAddItemModal}
                    fetchItems={fetchItems}
                />
            )}

            {isEditItemModal && currentItem && (
                <ServiceEdit
                    item={currentItem}
                    setIsEditItemModal={setIsEditItemModal}
                    fetchItems={fetchItems}
                />
            )}

            <ConfirmModal
                open={deleteModalOpen}
                serviceName={selectedService?.serviceName}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={() => {
                    removeItem(selectedService?._id);
                    setDeleteModalOpen(false);
                }}
            />

        </section>
    );
};

const ConfirmModal = ({ open, onClose, onConfirm, serviceName }) => {
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
                        <h3 className='text-lg font-bold text-gray-800 mb-2'>Delete Item</h3>
                        <p className='text-gray-600'>
                            Are you sure you want to delete <span className='font-semibold text-red-600'>{serviceName}</span>?
                        </p>
                        <p className='text-sm text-gray-500 mt-2'>
                            This action cannot be undone. All item data will be permanently removed from inventory.
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
                            Delete Item
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Services;

// import React ,{useState, useEffect, useRef, useCallback,} from 'react'
// import goods from '../assets/images/goods.jpg' 

// import { MdDeleteForever, MdOutlineAddToDrive } from "react-icons/md";
// import { LiaEditSolid } from "react-icons/lia";

// import { api } from '../https';
// import { toast } from 'react-toastify'
// import BackButton from '../components/shared/BackButton';

// import ServiceAdd from '../components/services/ServiceAdd';
// import BottomNav from '../components/shared/BottomNav';
// import ServiceEdit from '../components/services/ServiceEdit';


// const Services = () => {
   
//     const addBtn = [{label :'New Item' , action :'items' , icon: <MdOutlineAddToDrive className='text-yellow-700' size={20} /> }   ]

//     const [isAddItemModal, setIsAddItemModal] = useState(false)
//     const handleAddItemModal = (action) => {
//         if(action === 'items') setIsAddItemModal(true)
//     };

//     //fetch items and editing
    
//     // const [isEditItemModal, setIsEditItemModal] = useState(false);
//     // const [currentItem, setCurrentItem] = useState(null);

//     // const [list, setList] = useState([]);
//     // const [filters, setFilters] = useState({
//     //     category: 'all',
//     //     search: '',
//     //     sort: '-createdAt',
//     //     page: 1,
//     //     limit: 10
//     // });
//     // const [pagination, setPagination] = useState({
//     //     currentPage: 1,
//     //     itemsPerPage: 10,
//     //     totalItems: 0,
//     //     totalPages: 1
//     // });
//     // const [loading, setLoading] = useState(false);
//     // const [searchInput, setSearchInput] = useState('');

//     // // Debounced search
//     // useEffect(() => {
//     //     const timeoutId = setTimeout(() => {
//     //         setFilters(prev => ({ ...prev, search: searchInput, page: 1 }));
//     //     }, 500);
//     //     return () => clearTimeout(timeoutId);
//     // }, [searchInput]);

//     // // Fetch when filters change
//     // useEffect(() => {
//     //     const fetchItems = async () => {
//     //         setLoading(true);
//     //         try {
//     //             const response = await api.post('/api/services/fetch', filters);

//     //             if (response.data.success) {
//     //                 setList(response.data.data || []);
//     //                 if (response.data.pagination) {
//     //                     setPagination(prev => ({
//     //                         ...prev,
//     //                         ...response.data.pagination
//     //                     }));
//     //                 }
//     //             }
//     //         } catch (error) {
//     //             toast.error(error.message);
//     //         } finally {
//     //             setLoading(false);
//     //         }
//     //     };

//     //     fetchItems();
//     // }, [filters]);

//     // // Handler functions
//     // const handleCategoryChange = (newCategory) => {
//     //     setFilters(prev => ({ ...prev, category: newCategory, page: 1 }));
//     // };

//     // const handleSortChange = (newSort) => {
//     //     setFilters(prev => ({ ...prev, sort: newSort, page: 1 }));
//     // };

//     // const handlePageChange = (newPage) => {
//     //     setFilters(prev => ({ ...prev, page: newPage }));
//     // };

//     //fetch items
//         const [list, setList] = useState([]);
//         const [search, setSearch] = useState('');
//         const [category, setCategory] = useState('');
//         const [sort, setSort] = useState('-createdAt');
    
//         const [pagination, setPagination] = useState({
//             currentPage: 1,
//             itemsPerPage: 10,
//             totalItems: 0,
//             totalPages: 1
//         });
    
//         const [loading, setLoading] = useState(false);
    
//         const [isEditItemModal, setIsEditItemModal] = useState(false);
//         const [currentItem, setCurrentItem] = useState(null);
    
//         const fetchItems = async () => {
//             setLoading(true);
    
//             try {
//                 const response = await api.post('/api/services/fetch',
//                     {
//                         category,
//                         search,
//                         sort,

//                         page: pagination.currentPage,
//                         limit: pagination.itemsPerPage
//                     }
//                 )
    
//                 if (response.data.success) {
//                     setList(response.data.data || []);
//                     console.log(response.data.data)
    
//                     if (response.data.pagination) {
//                         setPagination(prev => ({
//                             ...prev,  // Keep existing values
//                             currentPage: response.data.pagination.currentPage ?? prev.currentPage,
//                             itemsPerPage: response.data.pagination.limit ?? prev.itemsPerPage,
//                             totalItems: response.data.pagination.total ?? prev.totalItems,
//                             totalPages: response.data.pagination.totalPages ?? prev.totalPages
//                         }));
//                     };
    
//                 } else {
//                     toast.error(response.data.message || 'Empty products list')
//                 }
    
//             } catch (error) {
//                 console.log(error)
//                 toast.error(error.message)
//             } 
//             finally {
//                 setLoading(false);
//             }
    
//         }
    
//         const isInitialMount = useRef(true);
//         useEffect(() => {
//             if (isInitialMount.current) {
//                 isInitialMount.current = false;
//             } else {
//                 fetchItems();
//             }
//         }, [search, sort, pagination.currentPage, pagination.itemsPerPage]);
    
        
        



//     // Handle edit
//     const handleEdit = (item) => {
//         setCurrentItem(item);
//         setIsEditItemModal(true);
//     };



//     // remove 
//     const [deleteModalOpen, setDeleteModalOpen] = useState(false);
//     const [selectedService, setSelectedService] = useState(null);


//     const removeItem = async (id) => {

//         try {
//             const response = await api.post('/api/services/remove', { id },)

//             if (response.data.success) {
//                 toast.success(response.data.message)

//                 //Update the LIST after Remove
//                 await fetchItems();

//             } else {
//                 toast.error(response.data.message)
//             }

//         } catch (error) {
//             console.log(error)
//             toast.error(error.message)
//         }
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
//         <section className ='overflow-y-scroll scrollbar-hidden h-[calc(100vh)]'>

//             <div className='flex justify-between items-center px-5 py-2 shadow-xl'>
//                 <div className='flex items-center'>
//                     <BackButton />
//                     <h1 className='text-md font-semibold text-[#1a1a1a]'>Items Management</h1>
//                 </div>

//                 <div className='flex gap-2 items-center justify-around gap-3 hover:bg-yellow-700 shadow-lg/30 bg-white'>
//                     {addBtn.map(({ label, icon, action }) => {
//                         return (
//                             <button className='bg-white px-4 py-2 text-[#1a1a1a] cursor-pointer
//                                     font-semibold text-xs flex items-center gap-2 rounded-full'
//                                 onClick={() => handleAddItemModal(action)}
//                             >
//                                 {label} {icon}
//                             </button>
//                         )
//                     })}

//                 </div>

//             {isAddItemModal && 
//                 <ServiceAdd
//                 setIsAddItemModal ={setIsAddItemModal} 
//                 fetchItems ={fetchItems}
                
//             />} 

//             </div>
//              {/* Search and sorting */}
//             <div className="flex items-center px-15 py-2 shadow-xl">
//                 <input
//                     type="text"
//                     placeholder="Search Items..."
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
//                     <option value="category">By Categories (A-Z)</option>
//                     <option value="serviceName">By Name (A-Z)</option>
//                     <option value="-serviceName">By Name (Z-A)</option>
//                 </select>

//             </div>

//             {/* Loading Indicator */}
//             {loading && (
//                 <div className="mt-4 flex justify-center">
//                     <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-700"></div>
//                     <span className="ml-2">Loading Items...</span>
//                 </div>
//             )}


//             {/** table  */}
//             <div className='mt-5 bg-white py-1 px-10'>

//                 <div className='overflow-x-auto'>
//                     <table className='text-left w-full'>
//                         <thead>
//                             <tr className='bg-white border-b-2 border-yellow-700 text-[#1a1a1a] text-xs font-normal'>
//                                 <th className='p-1'></th>
//                                 <th className='p-1'>Item Name</th>
//                                 <th className='p-1'>Sale Price</th>
//                                 <th className='p-1'>Buy Price</th>
//                                 <th className='p-1'>Available Quantity</th>
                                
//                                 <th className='p-1'></th>
//                                 <th className='p-1'></th>
//                             </tr>
//                         </thead>

//                         <tbody>

//                             {/* {list.length === 0
//                                 ? (<p className='ml-5 mt-5 text-xs text-[#be3e3f] flex items-start justify-start'>Your items list is empty . Start adding items !</p>)
//                                 : list.map((item, index) => ( */}
//                                 {
//                                 list.map((item, index) => (
//                                     <tr
//                                         // key ={index}
//                                         className='border-b-3 border-[#f5f5f5] text-xs font-normal text-[#1a1a1a] 
//                                         hover:bg-[#F1E8D9] cursor-pointer'
//                                     >
//                                         <td className='p-1' hidden>{item._id}</td>
//                                         <td className='p-1  bg-[#F1E8D9]'>{item.category}</td>
//                                         <td className='p-1'>{item.serviceName}</td>
                                        
                                        
//                                         <td className='p-1'>{item.price}<span className='text-xs font-normal text-yellow-700'> AED</span></td>
//                                         <td className='p-1'>{item.buyingPrice} <span className='text-xs font-normal text-yellow-700'> AED</span></td>
//                                         <td className='p-1'>{item.qty}
//                                             <span> {item.unit}</span>
//                                         </td>
                                      
//                                         <td className='p-1'>
//                                             <img className='rounded-full border-b-2 border-yellow-700 w-9 h-9' 
//                                             src={item.image || goods} />
//                                         </td>
//                                         <td className='p-1'>

//                                             <button className={`text-[#0ea5e9] cursor-pointer text-sm font-semibold `}>
//                                                 <LiaEditSolid size={20} 
//                                                 className='w-5 h-5 text-[#0ea5e9] rounded-full'
//                                                 onClick={() => handleEdit(item)}
//                                                 />
//                                             </button>

//                                             <button className={`text-[#be3e3f] cursor-pointer text-sm font-semibold`}>
//                                                 <MdDeleteForever
//                                                     onClick={() => { setSelectedService(item); setDeleteModalOpen(true); }} size={20}
//                                                     className='w-5 h-5 text-[#be3e3f] rounded-full'
//                                                 />
//                                             </button>
//                                         </td>
//                                     </tr>

//                                 ))}
//                         </tbody>
//                         <tfoot>
//                             <tr className="bg-[#F1E8D9] border-t-2 border-emerald-600 text-xs font-semibold text-[#1a1a1a]">

//                                 <td className="p-2 text-[#1a1a1a]">{list.length}<span className ='font-normal'> Items</span></td>

//                                 <td className="p-1" colSpan={6}></td>
                              
//                             </tr>
//                         </tfoot>
//                     </table>
//                     {!loading && list.length === 0 && (
                        
//                         <p className='ml-5 mt-5 text-xs text-[#be3e3f] flex items-start justify-start'>
//                             {search
//                                 ? `No items found for "${search}"`
//                                 : `Your items list is empty . Start adding items !`}
//                         </p>

//                     )}
//                     {/* Pagination  */}
//                     {list.length > 0 && <PaginationControls />}
//                 </div>
//             </div>

//             {/* Edit Service Modal */}
//             {isEditItemModal && currentItem && (
//                 <ServiceEdit
//                     item ={currentItem}
//                     setIsEditItemModal ={setIsEditItemModal}
//                     fetchItems ={fetchItems}
//                 />
//             )}




//             <ConfirmModal

//                 open={deleteModalOpen}
//                 serviceName={selectedService?.serviceName}
//                 onClose={() => setDeleteModalOpen(false)}
//                 onConfirm={() => {
//                     removeItem(selectedService._id);
//                     setDeleteModalOpen(false);
//                 }}
//             />
//             <BottomNav/>
//         </section>
//     );
// };


// const ConfirmModal = ({ open, onClose, onConfirm, serviceName }) => {
//   if (!open) return null;
//   return (
//        <div
//       className="fixed inset-0 flex items-center justify-center z-50"
//       style={{ backgroundColor: 'rgba(56, 2, 2, 0.4)' }}  //rgba(0,0,0,0.4)
//     >
      
//       <div className="bg-white rounded-lg p-6 shadow-lg min-w-[300px]">
//         {/* <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2> */}
//         <p className="mb-6">Are you sure you want to remove <span className="font-semibold text-red-600">{serviceName}</span>?</p>
//         <div className="flex justify-end gap-3">
//           <button
//             className="px-4 py-2 rounded bg-white hover:bg-gray-300 cursor-pointer shadow-lg/30"
//             onClick={onClose}
//           >
//             Cancel
//           </button>
//           <button
//             className="px-4 py-2 rounded bg-red-600 text-white hover:bg-[#be3e3f] cursor-pointer shadow-lg/30"
//             onClick={onConfirm}
//           >
//             Delete
//           </button>
//         </div>
//       </div>

//     </div>
//   )};


// export default Services ;