import React, { useState , useEffect, useCallback, useRef } from 'react'
import { MdDeleteForever, MdOutlineAddToDrive } from "react-icons/md";
import { LiaEditSolid } from "react-icons/lia";
import { PiListMagnifyingGlassFill } from "react-icons/pi"
import { FaCcAmazonPay, FaUsers, FaSearch, FaFilter, FaEnvelope, FaPhone, FaMapMarkerAlt, FaWallet, FaEye, FaMoneyBillWave } from "react-icons/fa";
import { useDispatch } from 'react-redux'

import { toast } from 'react-toastify';

import BackButton from '../components/shared/BackButton';
import CustomerAdd from '../components/customers/CustomerAdd';
import BottomNav from '../components/shared/BottomNav';
import { setCustomer } from '../redux/slices/customerSlice';
import DetailsModal from '../components/customers/DetailsModal';
import CustomerPayment from '../components/customers/CustomerPayment';
import { api } from '../https';
import CustomerUpdate from '../components/customers/CustomerUpdate';
import { motion } from 'framer-motion';


const Customers = () => {
    const dispatch = useDispatch();

    const Button = [
        { label : 'New Customer' , icon : <MdOutlineAddToDrive className ='text-white' size={20} />, action :'customer' }
    ];

    const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);

    const handleOpenModal = (action) => {
        if(action === 'customer') setIsCustomerModalOpen(true);
    };
        
    // fetch customers - any error on .map or length check next function
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

    const [isEditCustomerModal, setIsEditCustomerModal] = useState(false);
    const [currentCustomer, setCurrentCustomer] = useState(null);

        const fetchCustomers = async (search = '') => {
            try {
                const response = await api.post('/api/customers/fetch',
                    {
                        search,
                        sort,
                        page: pagination.currentPage,
                        limit: pagination.itemsPerPage
                    }
                );
    
                if (response.data.success) {
                    setList(response.data.customers || response.data.data || []);
                    if (response.data.pagination) {
                        setPagination(prev => ({
                            ...prev,  // Keep existing values
                            currentPage: response.data.pagination.currentPage ?? prev.currentPage,
                            itemsPerPage: response.data.pagination.limit ?? prev.itemsPerPage,
                            totalItems: response.data.pagination.total ?? prev.totalItems,
                            totalPages: response.data.pagination.totalPages ?? prev.totalPages
                        }));
                    };
    
                } else {
                    toast.error(response.data.message || 'Empty customers list')
                }
    
            } catch (error) {
                console.log(error)
                toast.error(error.message)
            }
        }
    
        const isInitialMount = useRef(true);
        useEffect(() => {
            if (isInitialMount.current) {
                isInitialMount.current = false;
            } else {
                fetchCustomers();
            }
        }, [search, sort, pagination.currentPage, pagination.itemsPerPage]);
    
    // search - sorting - Debounce search to avoid too many API calls
        useEffect(() => {
            const timer = setTimeout(() => {
                fetchCustomers(search);
            }, 500); // 500ms delay
    
            return () => clearTimeout(timer);
        }, [search, sort]);
        

    // Handle edit
    const handleEdit = (customer) => {
        setCurrentCustomer(customer);
        setIsEditCustomerModal(true);
    };
    
    
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    const removeCustomer = async (id) => {
        try {
            const response = await api.post('/api/customers/remove', { id });
            if (response.data && response.data.success) {
                toast.success(response.data.message);
                await fetchCustomers();
            } else{
                // Handle case where response doesn't have success property
                const errorMessage = response.data?.message || 'Failed to delete customer';
                toast.error(errorMessage);
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    };

    const detailsButton = [
        { label : '' , icon : <PiListMagnifyingGlassFill className ='text-white' size={16} />, action :'details' }
    ]

    const [isDetailsModal, setIsDetailsModal] = useState(false);

    const handleDetailsModal = (customerId, customerName, balance, action) => {
        dispatch(setCustomer({ customerId, customerName, balance  }));
        if (action === 'details') setIsDetailsModal(true);
    };

    const paymentButton = [
        { label : 'Payment' , icon : <FaCcAmazonPay className ='text-white' size={16} />, action :'payment' }
    ]

    const [isPaymentModal, setIsPaymentModal] = useState(false);

    const handlePaymentModal = (customerId, customerName ,balance, action) => {
        dispatch(setCustomer({ customerId, customerName , balance }));
        if (action === 'payment') setIsPaymentModal(true);
    };

    // Calculate total balance
    const totalBalance = list.reduce((sum, customer) => sum + (Number(customer.balance) || 0), 0);
    const customersWithBalance = list.filter(customer => Number(customer.balance) !== 0).length;

    // pagination
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
            <div className="flex flex-col  sm:flex-row justify-between items-center mt-6 p-4 bg-gradient-to-r from-blue-50 to-white rounded-xl border border-blue-100">
                <div className="text-sm text-gray-600 mb-3 sm:mb-0">
                    Showing
                    <span className='font-semibold text-blue-700 mx-1'> {list.length} </span>
                    of
                    <span className='font-semibold text-blue-700 mx-1'> {pagination.totalItems} </span>
                    customers
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handlePageChange(pagination.currentPage - 1)}
                            disabled={pagination.currentPage === 1}
                            className="px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-blue-50 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                            Previous
                        </button>

                        <div className="px-3 py-2 bg-blue-50 rounded-lg">
                            <span className="text-sm font-medium text-blue-700">
                                Page {pagination.currentPage} of {pagination.totalPages}
                            </span>
                        </div>

                        <button
                            onClick={() => handlePageChange(pagination.currentPage + 1)}
                            disabled={pagination.currentPage === pagination.totalPages}
                            className="px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-blue-50 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                            Next
                        </button>
                    </div>

                    <select
                        value={pagination.itemsPerPage}
                        onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                        className="px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm font-medium text-gray-700 cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                <div className='bg-white rounded-xl shadow-lg mb-2 overflow-hidden border border-blue-100'>
                    <div className='flex flex-col md:flex-row justify-between items-start md:items-center p-4 md:p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white'>
                        <div className='flex items-center gap-3 mb-4 md:mb-0'>
                            <BackButton className="text-white" />
                            <div className='flex items-center gap-3'>
                                <div className='bg-white/20 p-2 rounded-lg'>
                                    <FaUsers className='text-white w-5 h-5' />
                                </div>
                                <div>
                                    <h1 className='text-lg md:text-xl font-bold'>Customers Management</h1>
                                    <p className='text-blue-100 text-sm'>Manage your customer database</p>
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-col sm:flex-row items-center gap-4'>
                            <div className='flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg'>
                                <FaUsers className='w-4 h-4 text-blue-200' />
                                <span className='text-sm font-medium text-blue-100'>
                                    {list.length} Customers
                                </span>
                            </div>
                            
                            <button 
                                onClick = {() => handleOpenModal('customer')}
                                className='flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition duration-200 cursor-pointer'
                            >
                                <MdOutlineAddToDrive className='text-white w-4 h-4' />
                                <span className='text-sm font-medium'>New Customer</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6'>
                    <div className='bg-white rounded-xl p-4 border border-blue-100 shadow-sm'>
                        <div className='flex items-center gap-3'>
                            <div className='p-2 bg-blue-100 rounded-lg'>
                                <FaUsers className='w-5 h-5 text-blue-600' />
                            </div>
                            <div>
                                <p className='text-xs text-gray-500'>Total Customers</p>
                                <p className='text-xl font-bold text-blue-800'>{list.length}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className='bg-white rounded-xl p-4 border border-blue-100 shadow-sm'>
                        <div className='flex items-center gap-3'>
                            <div className='p-2 bg-blue-100 rounded-lg'>
                                <FaWallet className='w-5 h-5 text-blue-600' />
                            </div>
                            <div>
                                <p className='text-xs text-gray-500'>Total Balance</p>
                                <p className={`text-xl font-bold ${totalBalance >= 0 ? 'text-blue-800' : 'text-green-600'}`}>
                                    {totalBalance.toFixed(2)} AED
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div className='bg-white rounded-xl p-4 border border-blue-100 shadow-sm'>
                        <div className='flex items-center gap-3'>
                            <div className='p-2 bg-blue-100 rounded-lg'>
                                <FaMoneyBillWave className='w-5 h-5 text-blue-600' />
                            </div>
                            <div>
                                <p className='text-xs text-gray-500'>With Balance</p>
                                <p className='text-xl font-bold text-red-600'>{customersWithBalance}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className='bg-white rounded-xl p-4 border border-blue-100 shadow-sm'>
                        <div className='flex items-center gap-3'>
                            <div className='p-2 bg-blue-100 rounded-lg'>
                                <FaEye className='w-5 h-5 text-blue-600' />
                            </div>
                            <div>
                                <p className='text-xs text-gray-500'>Active</p>
                                <p className='text-xl font-bold text-green-600'>{list.length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search and Filter Section */}
                <div className='bg-white rounded-xl shadow-lg border border-blue-100 p-4 mb-6'>
                    <div className='flex flex-col md:flex-row gap-4'>
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaSearch className="h-5 w-5 text-blue-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search by customer name, email, or phone..."
                                className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-xl bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition duration-200"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <select
                                    className="appearance-none bg-white border border-blue-200 rounded-xl px-4 py-3 pr-10 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition duration-200 cursor-pointer"
                                    value={sort}
                                    onChange={(e) => {
                                        setSort(e.target.value);
                                        setPagination(prev => ({ ...prev, currentPage: 1 }));
                                    }}
                                >
                                    <option value="-createdAt">Newest First</option>
                                    <option value="createdAt">Oldest First</option>
                                    <option value="customerName">By Name (A-Z)</option>
                                    <option value="-customerName">By Name (Z-A)</option>
                                    <option value='balance'>Balance (Low to High)</option>
                                </select>
                                <div className="absolute right-3 top-3.5 text-blue-500 pointer-events-none">
                                    <FaFilter className="w-4 h-4" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Loading Indicator */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                        <p className="text-gray-600 font-medium">Loading Customers...</p>
                        <p className="text-sm text-gray-500 mt-2">Please wait while we fetch customer data</p>
                    </div>
                )}

                {/* Customers Table/Cards */}
                {!loading && list.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-8 text-center">
                        <div className='mb-6 inline-flex p-4 bg-blue-50 rounded-full'>
                            <FaUsers className="w-12 h-12 text-blue-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">
                            {search ? 'No Customers Found' : 'No Customers Available'}
                        </h3>
                        <p className="text-gray-500 mb-6 max-w-md mx-auto">
                            {search
                                ? `No customers found matching "${search}"`
                                : 'Your customer list is empty. Start by adding new customers!'}
                        </p>
                        <button 
                            onClick={() => handleOpenModal('customer')}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg transition duration-200 cursor-pointer"
                        >
                            <MdOutlineAddToDrive className="w-4 h-4" />
                            <span className="font-medium">Add First Customer</span>
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Desktop Table */}
                        <div className="hidden lg:block bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden mb-6">
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead className="bg-gradient-to-r from-blue-50 to-blue-100">
                                        <tr>
                                            <th className="py-3 px-6 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Customer</th>
                                            <th className="py-3 px-6 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Contact</th>
                                            <th className="py-3 px-6 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Address</th>
                                            <th className="py-3 px-6 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Balance</th>
                                            <th className="py-3 px-6 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-blue-100">
                                        {list.map((customer, index) => (
                                            <tr key={customer._id || index} className="hover:bg-blue-50 transition duration-150">
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center">
                                                        <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
                                                            <FaUsers className="text-white w-4 h-4" />
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-semibold text-gray-900">{customer.customerName}</div>
                                                            <div className="text-xs text-gray-500">{customer.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="text-sm text-gray-900">{customer.contactNo || 'N/A'}</div>
                                                    <div className="text-xs text-gray-500">Phone</div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="text-sm text-gray-900 truncate max-w-xs">{customer.address || 'N/A'}</div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className={`text-sm font-semibold ${Number(customer.balance) === 0 ? 'text-green-600' : Number(customer.balance) > 0 ? 'text-red-600' : 'text-blue-600'}`}>
                                                        {Number(customer.balance).toFixed(2)} AED
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {Number(customer.balance) === 0 ? 'Paid' : Number(customer.balance) > 0 ? 'Due' : 'Credit'}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => handleEdit(customer)}
                                                            className="p-2 text-blue-600 hover:text-white hover:bg-blue-600 rounded-lg transition duration-200 cursor-pointer"
                                                            title="Edit"
                                                        >
                                                            <LiaEditSolid className="w-4 h-4" />
                                                        </button>
                                                        
                                                        <button
                                                            onClick={() => handleDetailsModal(customer._id, customer.customerName, customer.balance, 'details')}
                                                            className="p-2 text-green-600 hover:text-white hover:bg-green-600 rounded-lg transition duration-200 cursor-pointer"
                                                            title="View Details"
                                                        >
                                                            <PiListMagnifyingGlassFill className="w-4 h-4" />
                                                        </button>
                                                        
                                                        <button
                                                            onClick={() => handlePaymentModal(customer._id, customer.customerName, customer.balance, 'payment')}
                                                            className="p-2 text-blue-600 hover:text-white hover:bg-blue-600 rounded-lg transition duration-200 cursor-pointer"
                                                            title="Payment"
                                                        >
                                                            <FaCcAmazonPay className="w-4 h-4" />
                                                        </button>
                                                        
                                                        <button
                                                            onClick={() => {setSelectedCustomer(customer); setDeleteModalOpen(true); }}
                                                            className="p-2 text-red-500 hover:text-white hover:bg-red-500 rounded-lg transition duration-200 cursor-pointer"
                                                            title="Delete"
                                                        >
                                                            <MdDeleteForever className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Mobile Cards */}
                        <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            {list.map((customer, index) => (
                                <motion.div
                                    key={customer._id || index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="bg-white rounded-xl border border-blue-100 p-4 shadow-sm"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
                                                <FaUsers className="text-white w-5 h-5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-gray-800 text-lg truncate">
                                                    {customer.customerName}
                                                </h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                        Number(customer.balance) === 0
                                                            ? 'bg-green-100 text-green-700'
                                                            : Number(customer.balance) > 0
                                                                ? 'bg-red-100 text-red-700'
                                                                : 'bg-blue-100 text-blue-700'
                                                    }`}>
                                                        {Number(customer.balance) === 0 ? 'Paid' : 
                                                         Number(customer.balance) > 0 ? 'Due' : 'Credit'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                                                <FaEnvelope className="w-3.5 h-3.5 text-blue-500" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs text-gray-500">Email</p>
                                                <p className="text-sm font-medium text-gray-700 truncate">
                                                    {customer.email || 'N/A'}
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
                                                    {customer.contactNo || 'N/A'}
                                                </p>
                                            </div>
                                        </div>

                                        {customer.address && (
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                                                    <FaMapMarkerAlt className="w-3.5 h-3.5 text-blue-500" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs text-gray-500">Address</p>
                                                    <p className="text-sm font-medium text-gray-700 line-clamp-2">
                                                        {customer.address}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <FaWallet className="w-4 h-4 text-gray-400" />
                                                <span className="text-sm text-gray-500">Balance</span>
                                            </div>
                                            <span className={`text-lg font-bold ${
                                                Number(customer.balance) === 0
                                                    ? 'text-green-600'
                                                    : Number(customer.balance) > 0
                                                        ? 'text-red-600'
                                                        : 'text-blue-600'
                                            }`}>
                                                {Number(customer.balance).toFixed(2)} <span className="text-sm font-normal text-gray-500">AED</span>
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-blue-100">
                                        <div className="flex items-center justify-center gap-3">
                                            <button
                                                onClick={() => handleEdit(customer)}
                                                className="px-3 py-2 text-blue-600 hover:text-white hover:bg-blue-600 rounded-lg transition duration-200 cursor-pointer text-sm font-medium"
                                            >
                                                Edit
                                            </button>
                                            
                                            <button
                                                onClick={() => handleDetailsModal(customer._id, customer.customerName, customer.balance, 'details')}
                                                className="px-3 py-2 text-green-600 hover:text-white hover:bg-green-600 rounded-lg transition duration-200 cursor-pointer text-sm font-medium"
                                            >
                                                Details
                                            </button>
                                            
                                            <button
                                                onClick={() => handlePaymentModal(customer._id, customer.customerName, customer.balance, 'payment')}
                                                className="px-3 py-2 text-blue-600 hover:text-white hover:bg-blue-600 rounded-lg transition duration-200 cursor-pointer text-sm font-medium"
                                            >
                                                Payment
                                            </button>
                                            
                                            <button
                                                onClick={() => {setSelectedCustomer(customer); setDeleteModalOpen(true); }}
                                                className="px-3 py-2 text-red-500 hover:text-white hover:bg-red-500 rounded-lg transition duration-200 cursor-pointer text-sm font-medium"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <PaginationControls/>
                    </>
                )}
            </div>

            {/* Modals */}
            {isCustomerModalOpen && 
                <CustomerAdd 
                    setIsCustomerModalOpen ={setIsCustomerModalOpen} 
                    fetchCustomers ={fetchCustomers}
                />
            }
            
            {isDetailsModal && 
                <DetailsModal 
                    setIsDetailsModal={setIsDetailsModal} 
                />
            }
           
            {isPaymentModal && 
                <CustomerPayment 
                    setIsPaymentModal={setIsPaymentModal} 
                    fetchCustomers= {fetchCustomers}
                />
            }
            
            {isEditCustomerModal && currentCustomer && (
                <CustomerUpdate
                    customer= {currentCustomer}
                    setIsEditCustomerModal= {setIsEditCustomerModal}
                    fetchCustomers= {fetchCustomers}
                />
            )}

          
            <ConfirmModal
                open={deleteModalOpen}
                customerName={selectedCustomer?.customerName}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={() => {
                    removeCustomer(selectedCustomer._id);
                    setDeleteModalOpen(false);
                }}
            />
        </section>
    );
};

const ConfirmModal = ({ open, onClose, onConfirm, customerName }) => {
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
                        <h3 className='text-lg font-bold text-gray-800 mb-2'>Delete Customer</h3>
                        <p className='text-gray-600'>
                            Are you sure you want to delete <span className='font-semibold text-red-600'>{customerName}</span>?
                        </p>
                        <p className='text-sm text-gray-500 mt-2'>
                            This action cannot be undone. All customer data including transactions will be permanently removed.
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
                            Delete Customer
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Customers;


// import React, { useState , useEffect, useCallback, useRef } from 'react'
// import { MdDeleteForever, MdOutlineAddToDrive } from "react-icons/md";
// import { LiaEditSolid } from "react-icons/lia";
// import { PiListMagnifyingGlassFill } from "react-icons/pi"
// import { FaCcAmazonPay } from "react-icons/fa";
// import { useDispatch } from 'react-redux'

// import { toast } from 'react-toastify';

// import BackButton from '../components/shared/BackButton';
// import CustomerAdd from '../components/customers/CustomerAdd';
// import BottomNav from '../components/shared/BottomNav';
// import { setCustomer } from '../redux/slices/customerSlice';
// import DetailsModal from '../components/customers/DetailsModal';
// import CustomerPayment from '../components/customers/CustomerPayment';
// import { api } from '../https';
// import CustomerUpdate from '../components/customers/CustomerUpdate';


// const Customers = () => {
//     const dispatch = useDispatch();

//     const Button = [
//         { label : 'New Customer' , icon : <MdOutlineAddToDrive className ='text-yellow-700' size={20} />, action :'customer' }
//     ];

//     const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);

//     const handleOpenModal = (action) => {
//         if(action === 'customer') setIsCustomerModalOpen(true);
//     };
        
//     // fetch customers - any error on .map or length check next function
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

//     const [isEditCustomerModal, setIsEditCustomerModal] = useState(false);
//     const [currentCustomer, setCurrentCustomer] = useState(null);

//     const fetchCustomers = useCallback(async () => {
//         setLoading(true);
//         try {
//             const response = await api.post('/api/customers/fetch',
//                 {
//                     search,
//                     sort,
//                     page: pagination.currentPage,
//                     limit: pagination.itemsPerPage
//                 });
        
//             if (response.data.success) {
//                 setList(response.data.customers)
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
//                 toast.error(response.data.message || 'customer not found')
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
//             fetchCustomers();
//         }
//     }, [search, sort, pagination.currentPage, pagination.itemsPerPage]);

//     // Handle edit
//     const handleEdit = (customer) => {
//         setCurrentCustomer(customer);
//         setIsEditCustomerModal(true);
//     };
    
//     const [deleteModalOpen, setDeleteModalOpen] = useState(false);
//     const [selectedCustomer, setSelectedCustomer] = useState(null);

//     const removeCustomer = async (id) => {
              
//         try {
//             const response = api.post('/api/customers/remove', { id }, )
//             if (response.data.success){
//                 toast.success(response.data.message)
               
//                 //Update the LIST after Remove
//                 await fetchCustomers();
                
//             } else{
//                 toast.error(response.data.message)
//             }
            
//             } catch (error) {
//                 console.log(error)
//                 toast.error(error.message)
//             }
//     };

    
//     const detailsButton = [
//         { label : '' , icon : <PiListMagnifyingGlassFill className ='text-green-600' size={20} />, action :'details' }
//     ]

//     const [isDetailsModal, setIsDetailsModal] = useState(false);

//     const handleDetailsModal = (customerId, customerName, balance, action) => {
//         dispatch(setCustomer({ customerId, customerName, balance  }));
//         if (action === 'details') setIsDetailsModal(true);

//        // console.log(customerId)
//     };



//     const paymentButton = [
//         { label : 'Payment' , icon : <FaCcAmazonPay className ='text-[#0ea5e9]' size={20} />, action :'payment' }
//     ]

//     const [isPaymentModal, setIsPaymentModal] = useState(false);

//     const handlePaymentModal = (customerId, customerName ,balance, action) => {
//         dispatch(setCustomer({ customerId, customerName , balance }));
//         if (action === 'payment') setIsPaymentModal(true);

//        // console.log(customerId, customerName , balance)
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

//     return (
//         <section className ='h-[calc(100vh)] overflow-y-scroll scrollbar-hidden'>
            
//             <div className ='flex items-center justify-between px-5 py-2 shadow-xl mb-2'>
//                 <div className ='flex items-center gap-2'>
//                     <BackButton />
//                     <h1 className ='text-md font-semibold text-[#1a1a1a]'>Customers Management</h1>
//                 </div>
                                        
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
                                    
//                 {isCustomerModalOpen && 
//                 <CustomerAdd 
//                 setIsCustomerModalOpen ={setIsCustomerModalOpen} 
//                 fetchCustomers ={fetchCustomers}
//                 />} 
                                    
//             </div>

    
//             {/* Search and sorting and Loading */}
//                 <div className="flex items-center px-15 py-2 shadow-xl">
//                     <input
//                         type="text"
//                         placeholder="Search Customers..."
//                         className="border border-yellow-700 p-1 rounded-lg w-full text-xs font-semibold"
//                         // max-w-md
//                         value={search}
//                         onChange={(e) => setSearch(e.target.value)}
//                     />
//                     {/* Optional: Sort dropdown */}
//                     <select
//                         className="ml-4 border border-yellow-700 p-1  rounded-lg text-[#1a1a1a] text-xs font-semibold]"
//                         value={sort}

//                         onChange={(e) => {
//                             setSort(e.target.value);
//                             setPagination(prev => ({ ...prev, currentPage: 1 })); // Reset to first page when changing sort
//                         }}
//                     >
//                         <option value="-createdAt">Newest First</option>
//                         <option value="createdAt">Oldest First</option>
//                         <option value="customerName">By Name (A-Z)</option>
//                         <option value="-customerName">By Name (Z-A)</option>
//                         <option value ='balance'>Balance (Low to High)</option>
//                     </select>
//                 </div>

//             {/* Loading Indicator */}
//             {loading && (
//                 <div className="mt-4 flex justify-center">
//                     <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-700"></div>
//                     <span className="ml-2">Loading Customers...</span>
//                 </div>
//             )}

            
//             <div className ='mt-5 bg-white py-1 px-10'>
                      
//             <div className ='overflow-x-auto'>
//                 <table className ='text-left w-full'>
//                     <thead className =''>
//                         <tr className ='bg-white border-b-2 border-yellow-700 text-[#1a1a1a] text-xs font-normal'>
//                             <th className ='p-2'>Name</th>
//                             <th className ='p-2'>Email</th>
//                             <th className ='p-2'>Contact No</th>
//                             <th className ='p-2'>Address</th>
//                             <th className ='p-2'>Balance</th>
                        
//                             <th className ='p-1' style={{ marginRight: '0px'}}></th>  
//                         </tr>
//                     </thead>
                        
//                 <tbody>
                    
//                     {/* {list.length === 0 
//                     ? (<p className ='ml-5 mt-5 text-xs text-[#be3e3f] flex items-start justify-start'>Your customers list is empty . Start adding customers !</p>) 
//                     :list.map((customer, index) => ( */}
//                     {
//                     list.map((customer, index) => (
                    
//                     <tr
//                        // key ={index}
//                         className ='border-b-3 border-[#f5f5f5] text-xs font-normal text-[#1a1a1a] 
//                             hover:bg-[#F1E8D9] cursor-pointer'
//                     >
//                         <td className ='p-2' hidden>{customer._id}</td>
//                         <td className ='p-2'>{customer.customerName}</td>
//                         <td className ='p-2'>{customer.email}</td>
//                         <td className ='p-2'>{customer.contactNo}</td>
//                         <td className ='p-2'>{customer.address}</td>
//                         <td className ={`p-2 ${customer.balance === 0 ? 'text-green-600' : 'text-[#be3e3f]'}`}>
//                             {customer.balance.toFixed(2)}
//                             <span className ='text-[#1a1a1a] font-normal'> AED</span>
//                         </td>
                 
                        
//                         <td className ='p-1 flex flex-wrap gap-2 justify-center bg-zinc-1' style={{ marginRight: '0px'}}>

//                             <button className ={`cursor-pointer text-sm font-semibold `}>
//                                 <LiaEditSolid size ={20} 
//                                 className ='w-5 h-5 text-sky-600 rounded-full' 
//                                 onClick={() => handleEdit(customer)}
//                                 />
//                             </button>
                            
//                             <button 
//                                 className ={`text-[#be3e3f] cursor-pointer text-sm font-semibold`}>
//                                 <MdDeleteForever 
//                                 onClick={()=> {setSelectedCustomer(customer); setDeleteModalOpen(true); }} 
//                                 className ='w-5 h-5 text-[#be3e3f] rounded-full'/> 
//                             </button>
                           
//                                 {detailsButton.map(({ label, icon, action }) => {
//                                     return (
//                                         <button className='cursor-pointer 
//                                         rounded-lg text-green-600 font-semibold text-sm '
//                                             onClick={() => handleDetailsModal(customer._id, customer.customerName, customer.balance, action)}
//                                         >
//                                             {label} {icon}
//                                         </button>
//                                     )
//                                 })}


//                                 {paymentButton.map(({ label, icon, action }) => {
//                                     return (
//                                         <button className='cursor-pointer 
//                                         rounded-xs text-[#0ea5e9] text-xs font-normal flex items-center gap-1'
//                                             onClick={() => handlePaymentModal(customer._id, customer.customerName, customer.balance, action)}
//                                         >
//                                             {label} {icon}
//                                         </button>
//                                     )
//                                 })}
//                         </td>             
//                     </tr>
//                ))}
//                     </tbody>
//                         <tfoot>
//                             <tr className="bg-[#F1E8D9] border-t-2 border-yellow-700 text-yellow-600 text-xs font-semibold">
//                                 <td className="p-2 text-[#1a1a1a]">{list.length}<span className='font-normal'> Customer</span></td>

//                                 <td className="p-2" colSpan={3}></td>
//                                 <td className="p-2"></td>
//                                 <td className="p-2" colSpan={1}></td>
//                             </tr>
//                         </tfoot>
//                 </table>
//                 {!loading && list.length === 0 && (
//                     <p className ='ml-5 mt-5 text-xs text-[#be3e3f] flex items-start justify-start '>
//                         {search
//                         ? `No customers found for "${search}"` 
//                         : `Your customers list is empty . Start adding customers !`}
                        
//                     </p>
//                 )}


//         <PaginationControls/>
//             </div>
            
//             {isDetailsModal && 
//             <DetailsModal 
//             setIsDetailsModal={setIsDetailsModal} />} 
           
//             {isPaymentModal && 
//             <CustomerPayment 
//             setIsPaymentModal={setIsPaymentModal} 
//             fetchCustomers= {fetchCustomers}
//             />
//             }    
                     
//         </div>

//             {isEditCustomerModal && currentCustomer && (
//                 <CustomerUpdate
//                     customer= {currentCustomer}
//                     setIsEditCustomerModal= {setIsEditCustomerModal}
//                     fetchCustomers= {fetchCustomers}
//                 />
//             )}

//             <BottomNav />

//             {/* Place the ConfirmModal here */}
//             <ConfirmModal
//                 open={deleteModalOpen}
//                 customerName={selectedCustomer?.customerName}
//                 onClose={() => setDeleteModalOpen(false)}
//                 onConfirm={() => {
//                     removeCustomer(selectedCustomer._id);
//                     setDeleteModalOpen(false);
//                 }}
//             />

//         </section>
//     )
// };


// // You can put this at the bottom of your Services.jsx file or in a separate file
// const ConfirmModal = ({ open, onClose, onConfirm, customerName }) => {
//   if (!open) return null;
//   return (
//        <div
//       className="fixed inset-0 flex items-center justify-center z-50"
//       style={{ backgroundColor: 'rgba(243, 216, 216, 0.4)' }}  //rgba(0,0,0,0.4)
//     >
      
//       <div className="bg-white rounded-lg p-6 shadow-lg min-w-[300px]">
//         {/* <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2> */}
//         <p className="mb-6">Are you sure you want to remove <span className="font-semibold text-red-600">{customerName}</span>?</p>
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

// export default Customers ;