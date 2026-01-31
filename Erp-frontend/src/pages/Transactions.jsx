import React, {useState, useEffect, useRef, useCallback} from 'react' 
import { api } from '../https';
import { toast } from 'react-toastify'
import { MdDeleteForever, MdPrint, MdAttachMoney, MdTrendingUp, MdTrendingDown } from 'react-icons/md';
import { IoIosAddCircle } from 'react-icons/io'; 
import { FaFilter, FaSearch, FaChartPie, FaExchangeAlt } from 'react-icons/fa';
import BackButton from '../components/shared/BackButton';
import TransactionAdd from '../components/transactions/TransactionAdd';
import TransactionUpdate from '../components/transactions/TransactionUpdate';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

const Transactions = () => {
    const Button = [
        { label: 'New Transaction', icon: <IoIosAddCircle className='text-white w-5 h-5' />, action: 'transaction' }
    ];

    const [isAddTransactionModalOpen, setIsAddTransactionModalOpen] = useState(false);
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState(''); 
    const [sort, setSort] = useState('-createdAt');
    const [paymentMethod, setPaymentMethod] = useState('all');
    const [frequency, setFrequency] = useState(366);
    const [type, setType] = useState('all');
    const [shift, setShift] = useState('all');
    const [isEditTransactionModal, setIsEditTransactionModal] = useState(false);
    
    const [currentTransaction, setCurrentTransaction] = useState(null);
    
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);

    const handleOpenModal = (action) => {
        if (action === 'transaction') setIsAddTransactionModalOpen(true);
    };

     const [pagination, setPagination] = useState({
            currentPage: 1,
            itemsPerPage: 10,
            totalItems: 0,
            totalPages: 1
        });
    
    
    const fetchTransactions = async (searchParam = '') => {
        setLoading(true);
        try {
            const response = await api.post('/api/transactions/get-transactions', {
                frequency,
                type: type === 'all' ? '' : type,
                shift: shift === 'all' ? '' : shift,
                paymentMethod: paymentMethod === 'all' ? '' : paymentMethod,
                search: searchParam || search,
                sort,
                page: pagination.currentPage,
                limit: pagination.itemsPerPage
            });

            if (response.data.success) {
                setList(response.data.data || response.data.transactions || []);

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
                toast.error(response.data.message || 'Transactions not found');
                setList([]);
            }
        } catch (error) {
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Failed to fetch transactions');
            }
            console.error('Error fetching transactions:', error);
            setList([]);
        } finally {
            setLoading(false);
        }
    }

    // Fetch on mount and when filters change
    useEffect(() => {
        fetchTransactions();
    }, [frequency, type, shift, paymentMethod, sort, pagination.currentPage]);

    // Debounced search effect
    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== '') {
                // Reset to page 1 when searching
                setPagination(prev => ({ ...prev, currentPage: 1 }));
                fetchTransactions(search);
            } else if (search === '') {
                fetchTransactions('');
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    // If you need to refetch when pagination changes (page size)
    useEffect(() => {
        // Reset to page 1 when changing items per page
        setPagination(prev => ({ ...prev, currentPage: 1 }));
    }, [pagination.itemsPerPage]);

    // Optional: Handle pagination changes
    const handlePageChange = (newPage) => {
        setPagination(prev => ({ ...prev, currentPage: newPage }));
    };

    const handleItemsPerPageChange = (newLimit) => {
        setPagination(prev => ({ ...prev, itemsPerPage: newLimit, currentPage: 1 }));
    };



    const handleEdit = (transaction) => {
        setCurrentTransaction(transaction);
        setIsEditTransactionModal(true);
    };

    const removeTransaction = async (id) => {
        try {
            const response = await api.post('/api/transactions/remove', { id });
            if (response.data.success) {
                toast.success(response.data.message);
                await fetchTransactions();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    // Statistics calculations
    const totalTransaction = list.length;
    const totalIncomeTransactions = list.filter(transaction => transaction.type === "Income");
    const totalExpenseTransactions = list.filter(transaction => transaction.type === "Expense");
    const totalTurnover = list.reduce((acc, transaction) => acc + (transaction.amount || 0), 0);
    const totalIncomeTurnover = totalIncomeTransactions.reduce((acc, transaction) => acc + (transaction.amount || 0), 0);
    const totalExpenseTurnover = totalExpenseTransactions.reduce((acc, transaction) => acc + (transaction.amount || 0), 0);
    const netBalance = totalIncomeTurnover - totalExpenseTurnover;
    
    const totalIncomePercent = totalTransaction > 0 ? (totalIncomeTransactions.length / totalTransaction) * 100 : 0;
    const totalExpensePercent = totalTransaction > 0 ? (totalExpenseTransactions.length / totalTransaction) * 100 : 0;
    const totalIncomeTurnoverPercent = totalTurnover > 0 ? (totalIncomeTurnover / totalTurnover) * 100 : 0;
    const totalExpenseTurnoverPercent = totalTurnover > 0 ? (totalExpenseTurnover / totalTurnover) * 100 : 0;

    const chartData = [
        { name: 'Income', value: totalIncomeTurnover, color: '#10b981' },
        { name: 'Expense', value: totalExpenseTurnover, color: '#ef4444' }
    ];

    // Printing
    const invoiceRef = useRef(null)
    const handlePrint = () => {
        const printContent = invoiceRef.current.innerHTML;
        const WinPrint = window.open("", "", "width=900, height=650");

        WinPrint.document.write(` 
            <html>
                <head>
                    <title>Transactions Management</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        .receipt-container { width: 100%; }
                        h2 { text-align: center; }
                        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                        th { background-color: #f2f2f2; }
                        .IdTd {display: none ;}
                        .buttonTd {display: none ;}
                        .buttonTr {display: none ;}
                        .userTr {display: none ;}
                        .userTd {display: none ;}
                        .footTd {display: none ;}
                        .controls { display: none; }
                        .button { display: none; }
                        .backButton {display: none; }
                        .search {display : none; } 
                    </style>
                </head>
                <body>
                    ${printContent}
                </body>
            </html>
        `);

        WinPrint.document.close();
        WinPrint.focus();
        setTimeout(() => {
            WinPrint.print();
            WinPrint.close();
        }, 1000);
    };

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
                                    <FaExchangeAlt className='w-6 h-6 text-white' />
                                </div>
                                <div>
                                    <h1 className='text-xl md:text-2xl font-bold'>Financial Management</h1>
                                    <p className='text-blue-100 text-sm'>Track and manage all your financial transactions</p>
                                </div>
                            </div>
                        </div>

                        <div className='flex items-center gap-3'>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handlePrint}
                                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-3 rounded-lg transition duration-200 cursor-pointer"
                            >
                                <MdPrint className="w-4 h-4" />
                                <span className='text-sm font-medium'>Print Report</span>
                            </motion.button>
                            
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleOpenModal('transaction')}
                                className='flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-3 rounded-lg transition duration-200 cursor-pointer whitespace-nowrap'
                            >
                                <IoIosAddCircle className='text-white w-5 h-5' />
                                <span className='font-medium'>New Transaction</span>
                            </motion.button>
                        </div>
                    </div>
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                    {/* Left Column - Main Table */}
                    <div className='lg:col-span-2'>
                        <div ref={invoiceRef} className='bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden'>
                            {/* Search and Filters */}
                            <div className='p-4 md:p-6 border-b border-blue-100'>
                                <div className='flex flex-col md:flex-row gap-4'>
                                    <div className='flex-1 relative'>
                                        <input
                                            type="text"
                                            placeholder="Search transactions by reference, category, or amount..."
                                            className="w-full pl-10 pr-4 py-2.5 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                        />
                                        <div className='absolute left-3 top-1/2 transform -translate-y-1/2'>
                                            <FaSearch className='w-4 h-4 text-gray-400' />
                                        </div>
                                    </div>
                                    
                                    <select
                                        value={sort}
                                        onChange={(e) => setSort(e.target.value)}
                                        className="border border-blue-200 px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="-createdAt">Newest First</option>
                                        <option value="createdAt">Oldest First</option>
                                        <option value="type">By Type (A-Z)</option>
                                        <option value="-type">By Type (Z-A)</option>
                                        <option value="amount">Amount: Low to High</option>
                                        <option value="-amount">Amount: High to Low</option>
                                    </select>
                                </div>
                            </div>

                            {/* Loading State */}
                            {loading && (
                                <div className="flex justify-center items-center py-12">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                    <span className="ml-3 text-gray-600">Loading transactions...</span>
                                </div>
                            )}

                            {/* Transactions Table */}
                            {!loading && (
                                <div className='overflow-x-auto'>
                                    <table className='w-full'>
                                        <thead>
                                            <tr className='bg-gradient-to-r from-blue-50 to-blue-100 text-left'>
                                                <th className='p-3 text-xs font-semibold text-blue-700 uppercase tracking-wider'>Date</th>
                                                <th className='p-3 text-xs font-semibold text-blue-700 uppercase tracking-wider'>Payment</th>
                                                <th className='p-3 text-xs font-semibold text-blue-700 uppercase tracking-wider'>Type</th>
                                                <th className='p-3 text-xs font-semibold text-blue-700 uppercase tracking-wider'>Shift</th>
                                                <th className='p-3 text-xs font-semibold text-blue-700 uppercase tracking-wider'>Amount</th>
                                                <th className='p-3 text-xs font-semibold text-blue-700 uppercase tracking-wider'>Category</th>
                                                <th className='p-3 text-xs font-semibold text-blue-700 uppercase tracking-wider'>Reference</th>
                                                <th className='p-3 text-xs font-semibold text-blue-700 uppercase tracking-wider'>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className='divide-y divide-blue-100'>
                                            <AnimatePresence>
                                                {list.map((transaction, index) => (
                                                    <motion.tr
                                                        key={transaction._id || index}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -20 }}
                                                        transition={{ duration: 0.2, delay: index * 0.05 }}
                                                        className='hover:bg-blue-50/50 transition-colors duration-150'
                                                    >
                                                        <td className='p-3 text-sm text-gray-600'>
                                                            {transaction.date ? new Date(transaction.date).toLocaleDateString('en-GB') : 'N/A'}
                                                        </td>
                                                        <td className='p-3'>
                                                            <span className='text-sm font-medium text-gray-700'>{transaction.paymentMethod || 'N/A'}</span>
                                                        </td>
                                                        <td className='p-3'>
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                                transaction.type === 'Income' 
                                                                    ? 'bg-green-100 text-green-800' 
                                                                    : 'bg-red-100 text-red-800'
                                                            }`}>
                                                                {transaction.type}
                                                            </span>
                                                        </td>
                                                        <td className='p-3'>
                                                            <span className={`text-sm font-medium ${
                                                                transaction.shift === 'Morning' 
                                                                    ? 'text-amber-600' 
                                                                    : 'text-blue-600'
                                                            }`}>
                                                                {transaction.shift || 'N/A'}
                                                            </span>
                                                        </td>
                                                        <td className='p-3'>
                                                            <div className={`text-sm font-semibold ${
                                                                transaction.type === 'Income' 
                                                                    ? 'text-green-600' 
                                                                    : 'text-red-600'
                                                            }`}>
                                                                ${(transaction.amount || 0).toFixed(2)}
                                                            </div>
                                                        </td>
                                                        <td className='p-3 text-sm text-gray-600'>{transaction.category || 'N/A'}</td>
                                                        <td className='p-3 text-sm text-gray-600'>{transaction.refrence || 'N/A'}</td>
                                                        <td className='p-3'>
                                                            <div className='flex items-center gap-2'>
                                                                <button
                                                                    onClick={() => handleEdit(transaction)}
                                                                    className='p-1.5 text-blue-600 hover:text-white hover:bg-blue-600 rounded-lg transition-all duration-200 cursor-pointer'
                                                                    title="Edit Transaction"
                                                                >
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                    </svg>
                                                                </button>
                                                                <button
                                                                    onClick={() => { setSelectedTransaction(transaction); setDeleteModalOpen(true); }}
                                                                    className='p-1.5 text-red-500 hover:text-white hover:bg-red-500 rounded-lg transition-all duration-200 cursor-pointer'
                                                                    title="Delete Transaction"
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
                                                <FaExchangeAlt className='w-12 h-12 text-blue-400' />
                                            </div>
                                            <h3 className='text-lg font-semibold text-gray-700 mb-2'>
                                                {search ? 'No transactions found' : 'No transactions available'}
                                            </h3>
                                            <p className='text-gray-500 mb-6 max-w-md mx-auto'>
                                                {search 
                                                    ? `No transactions match your search for "${search}". Try different keywords.`
                                                    : 'Your transaction list is empty. Start by adding your first financial transaction.'
                                                }
                                            </p>
                                            {!search && (
                                                <button
                                                    onClick={() => handleOpenModal('transaction')}
                                                    className='inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg transition duration-200 cursor-pointer'
                                                >
                                                    <IoIosAddCircle className='w-4 h-4' />
                                                    <span className='font-medium'>Add First Transaction</span>
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Stats and Filters */}
                    <div className='lg:col-span-1 space-y-6'>
                        {/* Filters Card */}
                        <div className='bg-white rounded-2xl shadow-lg border border-blue-100 p-4 md:p-6'>
                            <h3 className='text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2'>
                                <FaFilter className='w-5 h-5 text-blue-600' />
                                Filters
                            </h3>
                            
                            <div className='space-y-4'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Time Period</label>
                                    <select 
                                        value={frequency} 
                                        onChange={(e) => setFrequency(e.target.value)}
                                        className='w-full border border-blue-200 px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                    >
                                        <option value='1'>Today</option>
                                        <option value='7'>Last 7 Days</option>
                                        <option value='30'>Last 30 Days</option>
                                        <option value='90'>Last 90 Days</option>
                                        <option value='366'>All Time</option>
                                    </select>
                                </div>
                                
                                <div className='grid grid-cols-2 gap-3'>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-1'>Type</label>
                                        <select 
                                            value={type} 
                                            onChange={(e) => setType(e.target.value)}
                                            className='w-full border border-blue-200 px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                        >
                                            <option value='all'>All Types</option>
                                            <option value='Income'>Income</option>
                                            <option value='Expense'>Expense</option>
                                        </select>
                                    </div>
                                    
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-1'>Shift</label>
                                        <select 
                                            value={shift} 
                                            onChange={(e) => setShift(e.target.value)}
                                            className='w-full border border-blue-200 px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                        >
                                            <option value='all'>All Shifts</option>
                                            <option value='Morning'>Morning</option>
                                            <option value='Evening'>Evening</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Payment Method</label>
                                    <select 
                                        value={paymentMethod} 
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className='w-full border border-blue-200 px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                    >
                                        <option value='all'>All Methods</option>
                                        <option value='Cash'>Cash</option>
                                        <option value='Credit Card'>Credit Card</option>
                                        <option value='Debit Card'>Debit Card</option>
                                        <option value='Bank Transfer'>Bank Transfer</option>
                                        <option value='Digital Wallet'>Digital Wallet</option>
                                        <option value='Check'>Check</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Statistics Card */}
                        <div className='bg-white rounded-2xl shadow-lg border border-blue-100 p-4 md:p-6'>
                            <h3 className='text-lg font-semibold text-gray-800 mb-4'>Transaction Statistics</h3>
                            
                            <div className='space-y-4'>
                                <div className='grid grid-cols-2 gap-3'>
                                    <div className='bg-blue-50 p-3 rounded-lg'>
                                        <p className='text-xs text-gray-500 mb-1'>Total Transactions</p>
                                        <p className='text-lg font-bold text-blue-800'>{totalTransaction}</p>
                                    </div>
                                    <div className='bg-green-50 p-3 rounded-lg'>
                                        <p className='text-xs text-gray-500 mb-1'>Income Count</p>
                                        <p className='text-lg font-bold text-green-800'>{totalIncomeTransactions.length}</p>
                                    </div>
                                    <div className='bg-red-50 p-3 rounded-lg'>
                                        <p className='text-xs text-gray-500 mb-1'>Expense Count</p>
                                        <p className='text-lg font-bold text-red-800'>{totalExpenseTransactions.length}</p>
                                    </div>
                                    <div className='bg-purple-50 p-3 rounded-lg'>
                                        <p className='text-xs text-gray-500 mb-1'>Total Amount</p>
                                        <p className='text-lg font-bold text-purple-800'>${totalTurnover.toFixed(2)}</p>
                                    </div>
                                </div>
                                
                                <div className='border-t border-blue-100 pt-4 space-y-3'>
                                    <div className='flex justify-between items-center'>
                                        <div className='flex items-center gap-2'>
                                            <MdTrendingUp className='w-4 h-4 text-green-600' />
                                            <span className='text-sm font-medium text-gray-700'>Total Income</span>
                                        </div>
                                        <span className='text-lg font-bold text-green-600'>${totalIncomeTurnover.toFixed(2)}</span>
                                    </div>
                                    
                                    <div className='flex justify-between items-center'>
                                        <div className='flex items-center gap-2'>
                                            <MdTrendingDown className='w-4 h-4 text-red-600' />
                                            <span className='text-sm font-medium text-gray-700'>Total Expense</span>
                                        </div>
                                        <span className='text-lg font-bold text-red-600'>${totalExpenseTurnover.toFixed(2)}</span>
                                    </div>
                                    
                                    <div className='flex justify-between items-center mt-4 pt-3 border-t border-blue-100'>
                                        <div className='flex items-center gap-2'>
                                            <MdAttachMoney className='w-4 h-4 text-blue-600' />
                                            <span className='text-sm font-bold text-gray-800'>Net Balance</span>
                                        </div>
                                        <span className={`text-lg font-bold ${netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            ${netBalance.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Chart Card */}
                        <div className='bg-white rounded-2xl shadow-lg border border-blue-100 p-4 md:p-6'>
                            <h3 className='text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2'>
                                <FaChartPie className='w-5 h-5 text-blue-600' />
                                Income vs Expense
                            </h3>
                            
                            <div className='h-48'>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={chartData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={40}
                                            outerRadius={60}
                                            paddingAngle={2}
                                            dataKey="value"
                                        >
                                            {chartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            formatter={(value) => [`$${value.toFixed(2)}`, 'Amount']}
                                        />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            
                            <div className='grid grid-cols-2 gap-4 mt-4'>
                                <div className='text-center'>
                                    <div className='flex items-center justify-center gap-2 mb-1'>
                                        <div className='w-3 h-3 bg-green-500 rounded-full'></div>
                                        <span className='text-sm font-medium text-gray-700'>Income</span>
                                    </div>
                                    <div className='text-lg font-bold text-green-600'>${totalIncomeTurnover.toFixed(2)}</div>
                                    <div className='text-xs text-green-600 font-semibold'>{totalIncomeTurnoverPercent.toFixed(0)}%</div>
                                </div>
                                <div className='text-center'>
                                    <div className='flex items-center justify-center gap-2 mb-1'>
                                        <div className='w-3 h-3 bg-red-500 rounded-full'></div>
                                        <span className='text-sm font-medium text-gray-700'>Expense</span>
                                    </div>
                                    <div className='text-lg font-bold text-red-600'>${totalExpenseTurnover.toFixed(2)}</div>
                                    <div className='text-xs text-red-600 font-semibold'>{totalExpenseTurnoverPercent.toFixed(0)}%</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Summary Footer */}
                <div className='mt-6 bg-white rounded-xl shadow-lg border border-blue-100 p-4'>
                    <div className='flex flex-col md:flex-row items-center justify-between gap-4'>
                        <div className='text-sm text-gray-600'>
                            <div className='flex items-center gap-2'>
                                <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
                                <span>Total Transactions: {totalTransaction} • Net Balance: ${netBalance.toFixed(2)}</span>
                            </div>
                        </div>
                        <div className='text-xs text-gray-500'>
                            Last updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {isAddTransactionModalOpen && (
                <TransactionAdd 
                    setIsAddTransactionModalOpen={setIsAddTransactionModalOpen} 
                    fetchTransactions={fetchTransactions}
                />
            )}

            {isEditTransactionModal && currentTransaction && (
                <TransactionUpdate
                    transaction={currentTransaction}
                    setIsEditTransactionModal={setIsEditTransactionModal}
                    fetchTransactions={fetchTransactions}
                />
            )}

            <ConfirmModal
                open={deleteModalOpen}
                Type={selectedTransaction?.type}
                Amount={selectedTransaction?.amount}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={() => {
                    removeTransaction(selectedTransaction?._id);
                    setDeleteModalOpen(false);
                }}
            />
        </section>
    );
};

const ConfirmModal = ({ open, onClose, onConfirm, Type, Amount }) => {
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
                        <h3 className='text-lg font-bold text-gray-800 mb-2'>Delete Transaction</h3>
                        <p className='text-gray-600'>
                            Are you sure you want to delete this transaction?
                        </p>
                        <div className='mt-3 bg-blue-50 p-3 rounded-lg'>
                            <p className='text-sm font-medium text-gray-700'>
                                Type: <span className={`font-semibold ${Type === 'Income' ? 'text-green-600' : 'text-red-600'}`}>{Type}</span>
                            </p>
                            <p className='text-sm font-medium text-gray-700'>
                                Amount: <span className='font-semibold text-gray-800'>${(Amount || 0).toFixed(2)}</span>
                            </p>
                        </div>
                        <p className='text-sm text-gray-500 mt-3'>
                            This action cannot be undone. Transaction data will be permanently removed.
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
                            Delete Transaction
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Transactions;


// import React, {useState, useEffect, useRef, useCallback} from 'react' 
// import { api } from '../https';
// import { toast } from 'react-toastify'
// import { MdDeleteForever } from 'react-icons/md';
// import { IoIosAddCircle } from 'react-icons/io'; 
// import { BiSolidEditAlt } from 'react-icons/bi';
// import BackButton from '../components/shared/BackButton';
// import TransactionAdd from '../components/transactions/TransactionAdd';
// import {Progress} from 'antd'   
// import { LuPrinterCheck } from "react-icons/lu";
// import TransactionUpdate from '../components/transactions/TransactionUpdate';

// import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

// const Transactions = () => {
    
//     const Button = [
//         { label: 'New Transaction', icon: <IoIosAddCircle className='text-yellow-700  w-6 h-6' />, action: 'transaction' }
//     ];

//     const [isAddTransactionModalOpen, setIsAddTransactionModalOpen] = useState(false);

//     const handleOpenModal = (action) => {
//         if (action === 'transaction') setIsAddTransactionModalOpen(true);
//     };

//     // fetch
//     const [list, setList] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [search, setSearch] = useState(''); 
//     const [sort, setSort] = useState('-createdAt');
//     const [paymentMethod, setPaymentMethod] = useState('all');
//     const [frequency, setFrequency] = useState(366);
//     const [type, setType] = useState('all');
//     const [shift, setShift] = useState('all');

//     const [pagination, setPagination] = useState({
//         currentPage: 1,
//         itemsPerPage: 10,
//         totalItems: 0,
//         totalPages: 1
//     });

//     const [isEditTransactionModal, setIsEditTransactionModal] = useState(false);
//     const [currentTransaction, setCurrentTransaction] = useState(null);


//     const fetchTransactions = useCallback(async () => {
//         setLoading(true);
//         try {

//             const response = await api.post('/api/transactions/get-transactions',
//                 // { sort }, { params: {search} }
//                 {
//                     paymentMethod,
//                     frequency,
//                     type,
//                     shift,
//                     search,
//                     sort,
//                     page: 1,
//                     limit: 1000
//                 }
//             );

//             if (response.data.success) {
//                 //setList(response.data.employees)
//                 setList(response.data.data || response.data.transactions || []);
//                 console.log(response.data.data)
              


//             } else {
//                 toast.error(response.data.message || 'Transactions is not found')
//             }

//         } catch (error) {
//             // Show backend error message if present in error.response
//             if (error.response && error.response.data && error.response.data.message) {
//                 toast.error(error.response.data.message);
//             } else {
//                 toast.error(error.message)
//             }
//             console.log(error)
//         } finally{
//             setLoading(false);
//         }

//     });

 
//     const isInitialMount = useRef(true);

//     useEffect(() => {
//         if (isInitialMount.current) {
//             isInitialMount.current = false;
//         } else {
//             fetchTransactions();
//         }
//     }, [paymentMethod, frequency, shift, type, search, sort]);

//      // Handle edit
//     const handleEdit = (transaction) => {
//         setCurrentTransaction(transaction);
//         setIsEditTransactionModal(true);
//     };


//     // Removing
//     const [deleteModalOpen, setDeleteModalOpen] = useState(false);    // for remove
//     const [selectedTransaction, setSelectedTransaction] = useState(null);   // for remove

//     const removeTransaction = async (id) => {

//         try {
//             const response = await api.post('/api/transactions/remove', { id },)
//             if (response.data.success) {
//                 toast.success(response.data.message)

//                 //Update the LIST after Remove
//                 await fetchTransactions();

//             } else {
//                 toast.error(response.data.message)
//             }

//         } catch (error) {
//             console.log(error)
//             toast.error(error.message)
//         }
//     };


//     // search - sorting - Debounce search to avoid too many API calls
//     useEffect(() => {
//         const timer = setTimeout(() => {
//             fetchTransactions(search);
//         }, 500); // 500ms delay

//         return () => clearTimeout(timer);
//     }, [search, sort]);

    

//     // Percentage and count
//     const totalTransaction = list.length;

//     const totalIncomeTransactions = list.filter(
//         (transaction) => transaction.type === "Income"
//     );
//     const totalExpenseTransactions = list.filter(
//         (transaction) => transaction.type === "Expense"
//     );
//     const totalIncomePercent = (totalIncomeTransactions.length / totalTransaction) * 100;
//     const totalExpensePercent = (totalExpenseTransactions.length / totalTransaction) * 100;

//     // Total amount 
//     const totalTurnover = list.reduce((acc, transaction) => acc + transaction.amount, 0);
//     const totalIncomeTurnover = list.filter(transaction => transaction.type === 'Income').reduce((acc, transaction) => acc + transaction.amount, 0);
//     const totalExpenseTurnover = list.filter(transaction => transaction.type === 'Expense').reduce((acc, transaction) => acc + transaction.amount, 0);

//     const totalIncomeTurnoverPercent = (totalIncomeTurnover / totalTurnover) * 100;
//     const totalExpenseTurnoverPercent = (totalExpenseTurnover / totalTurnover) * 100;

//     const data = [
//         { name: 'Income', value: totalIncomeTurnover, color: '#10b981' },
//         { name: 'Expense', value: totalExpenseTurnover, color: '#ef4444' }
//     ];


//     // const data = {
//     //     labels: ['Income', 'Expense'],
//     //     datasets: [
//     //         {
//     //             data: [totalIncomeTurnover, totalExpenseTurnover],
//     //             backgroundColor: ['#10b981', '#ef4444'],
//     //             borderColor: ['#10b981', '#ef4444'],
//     //             borderWidth: 1,
//     //         },
//     //     ],
//     // };

//     // const options = {
//     //     responsive: true,
//     //     maintainAspectRatio: false,
//     //     plugins: {
//     //         legend: {
//     //             position: 'bottom',
//     //         },
//     //         tooltip: {
//     //             callbacks: {
//     //                 label: function(context) {
//     //                     return `${context.label}: $${context.raw.toFixed(2)}`;
//     //                 }
//     //             }
//     //         }
//     //     },
//     //     cutout: '60%',
//     // };


//     //  const data = [
//     //     { x: 'Income', y: totalIncomeTurnover, color: '#10b981' },
//     //     { x: 'Expense', y: totalExpenseTurnover, color: '#ef4444' }
//     // ];

//     // Printing
//     const invoiceRef = useRef(null)
//     const handlePrint = () => {
//         const printContent = invoiceRef.current.innerHTML
//         const WinPrint = window.open("", "", "width=900, height=650")

//         WinPrint.document.write(` 
//                     <html>
//                         <head>
//                             <title>Transactions Management</title>
//                             <style>
//                                 body { font-family: Arial, sans-serif; padding: 20px; }
//                                 .receipt-container { width: 100%; }
//                                 h2 { text-align: center; }
//                                 table { width: 100%; border-collapse: collapse; margin-top: 10px; }
//                                 th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                                
//                                 th { background-color: #f2f2f2; }
//                                 .IdTd {display: none ;}
//                                 .buttonTd {display: none ;}
//                                 .buttonTr {display: none ;}
//                                 .userTr {display: none ;}
//                                 .userTd {display: none ;}
//                                 .footTd {display: none ;}
//                                 .controls { display: none; }
//                                 .button { display: none; }
//                                 .backButton {display: none; }
//                                 .search {display : none; } 
                                
//                             </style>
//                         </head>
//                         <body>
//                             ${printContent}
//                         </body>
//                     </html>
//                 `)

//         WinPrint.document.close()
//         WinPrint.focus()
//         setTimeout(() => {
//             WinPrint.print()
//             WinPrint.close()
//         }, 1000)
//     };

//     return(
//         <section className ='flex gap-3 h-[calc(100vh)] overflow-y-scroll scrollbar-hidden bg-[#f5f5f5]'>
//             <div className ='flex-[3] bg-white h-[100vh] overflow-y-scroll scrollbar-hidden '>
//                 <div ref={invoiceRef} className=''>
                
//                 <div className='flex items-center justify-between px-5 py-2 shadow-xl mb-2'>
//                     <div className='flex items-center'>
//                             <div className='backButton flex items-center gap-2'>
//                                 <BackButton />
//                                 <h1 className='text-md font-semibold text-[#1a1a1a]'>Financial Management</h1>
//                             </div>
                            
//                     </div>

//                         <div className='Button gap-2 flex items-center justify-between'>
//                             <div className='flex justify-end button  items-center cursor-pointer gap-3'>
//                                 <button
//                                     onClick={handlePrint}
//                                     className="bg-blue-500 cursor-pointer hover:bg-blue-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
//                                 >
//                                     <LuPrinterCheck className="w-4 h-4" />
//                                     Print
//                                 </button>
//                             </div>


//                             <div className='flex gap-2 items-center justify-around gap-3 hover:bg-yellow-700 shadow-lg/30 bg-white'>
//                                 {Button.map(({ label, icon, action }) => {
//                                     return (
//                                         <button
//                                             className='bg-white px-4 py-2 text-[#1a1a1a] cursor-pointer
//                                     font-semibold text-xs flex items-center gap-2 rounded-full'

//                                             onClick={() => handleOpenModal(action)}
//                                         >
//                                             {label} {icon}
//                                         </button>
//                                     )
//                                 })}


//                             </div>
//                         </div>

//                     {isAddTransactionModalOpen && 
//                     <TransactionAdd 
//                     setIsAddTransactionModalOpen={setIsAddTransactionModalOpen} 
//                     fetchTransactions ={fetchTransactions}
                    
//                     />} 

//                 </div>
//                 {/* Search and sorting */}
//                 <div className="search flex gap-2 items-center px-15 py-2 shadow-xl bg-white text-[#1a1a1a]">
//                     <input
//                         type="text"
//                         placeholder="Search..."
//                         className="text-[#1a1a1a] border border-yellow-700 p-1 rounded-sm w-full text-xs font-semibold"
//                         // max-w-md
//                         value={search}
//                         onChange={(e) => setSearch(e.target.value)}
//                     />

//                     {/* Optional: Sort dropdown */}
//                     <select
//                         className="border  border-yellow-700 p-1 rounded-sm text-[#1a1a1a] text-xs font-normal cursor-pointer"
//                         value={sort}

//                         onChange={(e) => {
//                             setSort(e.target.value);
//                             setPagination(prev => ({ ...prev, currentPage: 1 })); // Reset to first page when changing sort
//                         }}
//                     >
//                         <option value="-createdAt">Newest First</option>
//                         <option value="createdAt">Oldest First</option>
//                         <option value="type">By type (A-Z)</option>
//                         <option value="-type">By type (Z-A)</option>
//                     </select>
//                 </div>

//                 {loading && (
//                     <div className="mt-4 flex justify-center">
//                         <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-700"></div>
//                         <span className="ml-2">Loading Transactions...</span>
//                     </div>
//                 )}

//                 <div className='mt-5 bg-white py-1 px-10' >
//                     <div className='overflow-x-auto'>
//                         <table className='text-left w-full' >
//                             <thead>
//                                 <tr className ='bg-white border-b-2 border-yellow-700 text-[#1a1a1a] text-xs font-normal'> {/**bg-[#D2B48C] */}
//                                     <th className='p-1'></th>
//                                     <th className='p-1'></th>
//                                     <th className='p-3'></th>
//                                     <th className='p-1'></th>
                                    
//                                     <th className='p-1'>Amount</th>
//                                     <th className='p-1'>Category</th>
//                                     <th className='p-1'>Refrence</th>
//                                     <th className='p-1'></th>
//                                     <th className='p-1 userTr'>By</th>
                                
//                                     <th className='buttonTr p-1' style={{ marginRight: '0px' }}></th>
//                                 </tr>
//                             </thead>

//                             <tbody>

//                                 {list.length === 0
//                                     ? (<p className='ml-5 mt-5 text-xs text-[#be3e3f] flex items-start justify-start'>Your transaction list is empty .</p>)
//                                     : list.map((transaction, index) => (

//                                         <tr
//                                              key ={index}
//                                             className='border-b-3 border-[#f5f5f5] text-xs font-normal text-[#1a1a1a] 
//                                             hover:bg-[#F1E8D9] cursor-pointer'
//                                         >
//                                             <td className='IdTd p-1' hidden>{transaction._id}</td>
//                                             <td className='p-1'>{transaction.date ? new Date(transaction.date).toLocaleDateString('en-GB') : ''}</td>
//                                             <td className='p-1'>{transaction.paymentMethod}</td>
//                                             <td className= {`${transaction.type === 'Expense' ? "bg-[#be3e3f]/50 text-white" 
//                                                 : "bg-green-600/80 text-white"} p-2`}>
//                                                 {transaction.type}
//                                             </td>
                                           
//                                            <td className={`${transaction.shift === 'Morning' ? 'text-[#e6b100]' : 
//                                                 'text-[#0ea5e9]'
//                                             } p-1`}>{transaction.shift}<span className ='text-[#1a1a1a]'></span></td>

//                                             <td className='p-1'>{transaction.amount.toFixed(2)}</td>
//                                             <td className='p-1'>{transaction.category}</td>
//                                             <td className='p-1'>{transaction.refrence}</td>
//                                             <td className={`${transaction.status === 'updated' ? 'text-emerald-600' : 'text-white'}`}>
//                                                 {transaction.status}</td>
//                                             <td className='userTd p-1'>{transaction.user.name} / 
//                                                 <span className ='text-[#0ea5e9]'>  {transaction.user.role}</span>
//                                             </td>
                                        

//                                             <td className='buttonTd py-1 px-5  flex gap-2  justify-center' 
//                                                 style={{ marginRight: '0px' }}>
//                                                 <button className={`cursor-pointer text-sm font-semibold `}>
//                                                     <BiSolidEditAlt
//                                                         onClick={() => handleEdit(transaction)}
//                                                         className ='w-5 h-5 text-[#0ea5e9] 
//                                                         hover:bg-[#0ea5e9]/30 hover:rounded-full    
//                                                         ' />
//                                                 </button>

//                                                 <button className={`text-[#be3e3f] cursor-pointer text-sm font-semibold`}>
//                                                     <MdDeleteForever
//                                                         onClick={() => { setSelectedTransaction(transaction); setDeleteModalOpen(true); }}
//                                                         className ='w-5 h-5 text-[#be3e3f] border-b border-[#be3e3f]
//                                                         hover:bg-[#be3e3f]/30 hover:rounded-full
//                                                         ' />
//                                                 </button>
//                                             </td>

//                                         </tr>
//                                     ))}
//                             </tbody>

//                             {/* Footer Section */}
//                             {list.length > 0 && (

                            
//                                     <tfoot className='bg-[#F1E8D9] border-t-2 border-yellow-700 text-[#1a1a1a] text-xs font-normal'>
//                                         <tr>
//                                             <td className='p-2' colSpan={1}>{list.length} Process</td>
                                            
                                          
//                                             <td className='p-2' colSpan={3}>
//                                                Expense : 
//                                                <span className ='text-[#be3e3f] font-semibold'> {list.filter(t => t.type === 'Expense').reduce((sum, t) => sum + t.amount, 0).toFixed(2)}</span> 
//                                             </td>

                                            
//                                             <td className='p-2' colSpan={3}>
//                                                 Income : 
//                                                 <span className ='text-[#0ea5e9] font-semibold'> {list.filter(t => t.type === 'Income').reduce((sum, t) => sum + t.amount, 0).toFixed(2)}</span> 
//                                             </td>

                                           
                                          
//                                             {/* <td className='p-2' >Net Result :</td> */}
//                                             <td className='p-2 font-semibold' colSpan={3}>
//                                                 {(
//                                                     list.filter(t => t.type === 'Income').reduce((sum, t) => sum + t.amount, 0) -
//                                                     list.filter(t => t.type === 'Expense').reduce((sum, t) => sum + t.amount, 0)
//                                                 ).toFixed(2)} AED
//                                             </td>

//                                         </tr>
//                                         {/* <tr>
//                                             <td className='p-2' colSpan={2}>Expense Total</td>
//                                             <td className='p-2' colSpan={2}>
//                                                 {list.filter(t => t.type === 'Expense').reduce((sum, t) => sum + t.amount, 0).toFixed(2)} AED
//                                             </td>

//                                             <td className='p-2' colSpan={2}>Income Total</td>
//                                             <td className='p-2' colSpan={2}>
//                                                 {list.filter(t => t.type === 'Income').reduce((sum, t) => sum + t.amount, 0).toFixed(2)} AED
//                                             </td>
//                                         </tr>
//                                         <tr>
//                                             <td className='p-2' colSpan={2}>Net Result</td>
//                                             <td className='p-2' colSpan={6}>
//                                                 {(
//                                                     list.filter(t => t.type === 'Income').reduce((sum, t) => sum + t.amount, 0) -
//                                                     list.filter(t => t.type === 'Expense').reduce((sum, t) => sum + t.amount, 0)
//                                                 ).toFixed(2)} AED
//                                             </td>
//                                         </tr> */}
//                                     </tfoot>
//                             )}

//                         </table>

//                     </div>

                
//                     {/* Edit Employee Modal */}
//                     {isEditTransactionModal && currentTransaction && (
//                         <TransactionUpdate
//                             transaction ={currentTransaction}
//                             setIsEditTransactionModal ={setIsEditTransactionModal}
//                             fetchTransactions ={fetchTransactions}
//                         />
//                     )}


//                 </div>
//                 </div>
 
//             </div>
//             <div className ='flex-[1] bg-white px-2 py-3'>
//                 <div className="flex gap-2 items-center px-15 py-2 shadow-xl text-white">
//                     <select id='frequency' value={frequency} onChange={(e) => setFrequency(e.target.value)}
//                         className='border border-yellow-700 rounded-md px-2 py-1 text-xs text-[#1f1f1f] '>
//                         <option value='1'>1 Day</option>
//                         <option value='7'> 7 Days</option>
//                         <option value='30'> 30 Days</option>
//                         <option value='90'> 90 Days</option>

//                     </select>
//                     <select id='type' value={type} onChange={(e) => setType(e.target.value)}
//                         className='border border-yellow-700 rounded-md px-2 py-1 text-xs text-[#1f1f1f] '>
//                         <option value='all'>All</option>
//                         <option value='Income'>Income</option>
//                         <option value='Expense'>Expense</option>

//                     </select>
//                     <select id='shift' value={shift} onChange={(e) => setShift(e.target.value)}
//                         className='border border-yellow-700  rounded-md px-2 py-1 text-xs text-[#1f1f1f] '>
//                         <option value='all'>All</option>
//                         <option value='Morning'>Morning</option>
//                         <option value='Evening'>Evening</option>
//                     </select>
//                     <select id='paymentMmethod' value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}
//                         className='border border-yellow-700  rounded-md px-2 py-1 text-xs text-[#1f1f1f] '>
//                         <option value='all'>All</option>
//                         <option value='Cash'>Cash</option>
//                         <option value='Credit Card'>Credit Card</option>
//                         <option value='Debit Card'>Debit Card</option>
//                         <option value='Bank Transfer'>Bank Transfer</option>
//                         <option value='Digital Wallet'>Digital Wallet</option>
//                         <option value='Check'>Check</option>
//                     </select>
//                 </div>

//                 <div className='flex flex-col items-start mt-2 shadow-xl'>
                    
//                     <p className='text-xs text-[#0ea5e9] font-semibold ml-2 mb-2 mt-2'>Count of transactions :-</p>
//                     <div className='flex items-center justify-between w-full px-5'>

//                         <div className='flex  items-center justify-center gap-3'>
//                             <span className='text-xs font-normal text-[#1a1a1a] '>Incomes : </span>
//                             <p className='font-semibold text-md text-green-600 p-1'>
//                                 {totalIncomeTransactions.length} 
//                                 <span className ='text-[#1a1a1a] text-xs font-normal'> Process</span>
//                             </p>
//                         </div>
//                         {/* {totalExpenseTransactions.length} */}
//                         <div className='flex  items-center justify-center gap-3'>
//                             <span className='text-xs font-normal text-[#1a1a1a] '>Expenses : </span>
//                             <p className='font-semibold text-md text-[#be3e3f] p-1'>
//                                 {totalExpenseTransactions.length}
//                                 <span className='text-[#1a1a1a] text-xs font-normal'> Process</span>
//                             </p>
//                         </div>

//                     </div>
//                 </div>

//                 <div className='flex flex-col items-start mt-2 shadow-xl '>

//                     <p className='text-xs text-[#0ea5e9] font-semibold ml-2 mb-2 mt-2'>Amounts Totals :-</p>
//                     <div className='flex flex-col gap-5 justify-between w-full px-5'>

//                         <div className='flex  items-center justify-center gap-3'>
//                             <span className='text-xs font-normal text-[#1a1a1a] '>Incomes : </span>
//                             <p className='font-semibold text-md text-green-600 p-1'>
//                                 {totalIncomeTurnover.toFixed(2)}
//                                 <span className='text-[#1a1a1a] text-xs font-normal'> AED</span>
//                             </p>
//                         </div>

//                         <div className='flex  items-center justify-center gap-3'>
//                             <span className='text-xs font-normal text-[#1a1a1a] '>Expenses : </span>
//                             <p className='font-semibold text-md text-[#be3e3f] p-1'>
//                                 {totalExpenseTurnover.toFixed(2)}
//                                 <span className='text-[#1a1a1a] text-xs font-normal'> AED</span>
//                             </p>
//                         </div>

//                         <div className='flex  items-center justify-center gap-3'>
//                             <span className='text-xs font-normal text-[#1a1a1a] '>Balance : </span>
//                             <p className='font-semibold text-md text-[#0ea5e9] p-1'>
//                                 {(totalIncomeTurnover - totalExpenseTurnover).toFixed(2)}
//                                 <span className='text-[#1a1a1a] text-xs font-normal'> AED</span>
//                             </p>
//                         </div>

//                     </div>
//                 </div>

//                 {/* <div className='flex flex-col items-start mt-2 shadow-xl'>

//                     <p className='text-xs text-[#0ea5e9] font-semibold ml-2 mb-2 mt-2'>Percentage of transactions :-</p>
//                     <div className='flex items-center justify-between w-full px-5'>

//                         <div className='flex  items-center justify-center gap-3'>
//                             <span className='text-xs font-normal text-[#1a1a1a] '>Incomes : </span>
//                             <p className='font-semibold text-md text-green-600 p-1'>
//                                 {totalIncomeTurnoverPercent.toFixed(0)}
//                                 <span className='text-[#1a1a1a] text-xs font-normal'> %</span>
//                             </p>
//                         </div>
                      
//                         <div className='flex  items-center justify-center gap-3'>
//                             <span className='text-xs font-normal text-[#1a1a1a]'>Expenses : </span>
//                             <p className='font-semibold text-md text-[#be3e3f] p-1'>
//                                 {totalExpenseTurnoverPercent.toFixed(0)} 
//                                 <span className='text-[#1a1a1a] text-xs font-normal'> %</span>
//                             </p>
//                         </div>

//                     </div>
//                 </div> */}


//                 {/* <div className='flex flex-col items-start mt-15 '>
//                     <p className='text-xs text-[#0ea5e9] font-semibold ml-2 mb-5 mt-2'>Graphical Explanation :-</p>
//                     <div className='flex items-center justify-between w-full px-15'>
//                         <div className='flex items-start justify-start bg-sky-50 p-1 rounded-sm '>
//                             <Progress type='circle' strokeColor={'green'} size={90} percent={totalIncomeTurnoverPercent.toFixed(0)} />
//                         </div>
//                         <div className='flex items-end justify-end bg-sky-50 rounded-sm  p-1'>
//                             <Progress type='circle' strokeColor={'#be3e3f'} size={90} percent={totalExpenseTurnoverPercent.toFixed(0)} />
//                         </div>
//                     </div>
//                 </div> */}






//                 <div className='flex flex-col items-start mt-5'>
//                     <p className='text-xs text-[#0ea5e9] font-semibold ml-2 mb-2 mt-2'>Graphical Explanation :-</p>

//                     <div className='w-full h-50'>
//                         <ResponsiveContainer width="100%" height="100%">
//                             <PieChart>
//                                 <Pie
//                                     data={data}
//                                     cx="50%"
//                                     cy="50%"
//                                     innerRadius={60}
//                                     outerRadius={80}
//                                     paddingAngle={5}
//                                     dataKey="value"
//                                 >
//                                     {data.map((entry, index) => (
//                                         <Cell key={`cell-${index}`} fill={entry.color} />
//                                     ))}
//                                 </Pie>
//                                 <Tooltip
//                                     formatter={(value) => [`$${value.toFixed(2)}`, 'Amount']}
//                                 />
//                                 <Legend />
//                             </PieChart>
//                         </ResponsiveContainer>
//                     </div>

//                     <div className='flex justify-between w-full mt-4 text-xs'>
//                         <div className='text-center'>
//                             <div className='w-4 h-4 bg-green-500 rounded-full mx-auto mb-1'></div>
//                             <div>Income: AED {totalIncomeTurnover.toFixed(2)}</div>
//                             <div className='text-green-600 font-semibold'>{totalIncomeTurnoverPercent.toFixed(0)}%</div>
//                         </div>
//                         <div className='text-center'>
//                             <div className='w-4 h-4 bg-red-500 rounded-full mx-auto mb-1'></div>
//                             <div>Expense: AED {totalExpenseTurnover.toFixed(2)}</div>
//                             <div className='text-red-600 font-semibold'>{totalExpenseTurnoverPercent.toFixed(0)}%</div>
//                         </div>
//                     </div>
//                 </div> 




//                 {/* <div className='flex flex-col items-start mt-15'>
//                     <p className='text-xs text-[#0ea5e9] font-semibold ml-2 mb-5 mt-2'>Graphical Explanation :-</p>

//                     <div className='w-full h-64'>
//                         <Doughnut data={data} options={options} />
//                     </div>

//                     <div className='flex justify-between w-full mt-4 text-xs'>
//                         <div className='text-center'>
//                             <div className='text-green-600 font-bold text-lg'>{totalIncomeTurnoverPercent.toFixed(0)}%</div>
//                             <div>Income</div>
//                         </div>
//                         <div className='text-center'>
//                             <div className='text-red-600 font-bold text-lg'>{totalExpenseTurnoverPercent.toFixed(0)}%</div>
//                             <div>Expense</div>
//                         </div>
//                     </div>
//                 </div> */}




//                 {/* <div className='flex flex-col items-start mt-15'>
//                     <p className='text-xs text-[#0ea5e9] font-semibold ml-2 mb-5 mt-2'>Graphical Explanation :-</p>

//                     <div className='w-full h-64'>
//                         <VictoryPie
//                             data={data}
//                             colorScale={['#10b981', '#ef4444']}
//                             innerRadius={100}
//                             labelRadius={120}
//                             style={{
//                                 labels: { fill: 'white', fontSize: 12, fontWeight: 'bold' }
//                             }}
//                             labelComponent={
//                                 <VictoryTooltip
//                                     flyoutStyle={{ fill: 'white', stroke: '#ccc' }}
//                                 />
//                             }
//                             containerComponent={<VictoryContainer responsive={true} />}
//                             events={[{
//                                 target: "data",
//                                 eventHandlers: {
//                                     onMouseOver: () => ({
//                                         target: "labels",
//                                         mutation: () => ({ active: true })
//                                     }),
//                                     onMouseOut: () => ({
//                                         target: "labels",
//                                         mutation: () => ({ active: false })
//                                     })
//                                 }
//                             }]}
//                         />
//                     </div>

//                     <div className='flex justify-between w-full mt-4 text-xs'>
//                         <div className='text-center'>
//                             <div className='w-3 h-3 bg-green-500 rounded-full mx-auto mb-1'></div>
//                             <div className='font-semibold'>Income</div>
//                             <div>${totalIncomeTurnover.toFixed(2)}</div>
//                             <div className='text-green-600'>{totalIncomeTurnoverPercent.toFixed(0)}%</div>
//                         </div>
//                         <div className='text-center'>
//                             <div className='w-3 h-3 bg-red-500 rounded-full mx-auto mb-1'></div>
//                             <div className='font-semibold'>Expense</div>
//                             <div>${totalExpenseTurnover.toFixed(2)}</div>
//                             <div className='text-red-600'>{totalExpenseTurnoverPercent.toFixed(0)}%</div>
//                         </div>
//                     </div>
//                 </div> */}



                

//             </div>

//             <ConfirmModal
//                 open={deleteModalOpen}
//                 Type={selectedTransaction?.type}
//                 Amount={selectedTransaction?.amount}

//                 onClose={() => setDeleteModalOpen(false)}
//                 onConfirm={() => {
//                     removeTransaction(selectedTransaction._id);
//                     setDeleteModalOpen(false);
//                 }}
//             />

//         </section>
//     );
// };



// // You can put this at the bottom of your Services.jsx file or in a separate file
// const ConfirmModal = ({ open, onClose, onConfirm, Type, Amount }) => {
//     if (!open) return null;
//     return (
//         <div
//             className="fixed inset-0 flex items-center justify-center z-50"
//             style={{ backgroundColor: 'rgba(243, 216, 216, 0.4)' }}  //rgba(0,0,0,0.4)
//         >

//             <div className="bg-white rounded-lg p-6 shadow-lg min-w-[300px]">
//                 {/* <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2> */}
//                 <p className="mb-6">Are you sure you want to remove <span className="font-semibold text-[#0ea5e9]">{Type}</span>
//                 , Amount <span className ='text-md font-semibold text-[#be3e3f]'>{Amount.toFixed(2)} </span>
//                  <span className ='text-xs font-normal'>AED</span>?</p>
//                 <div className="flex justify-end gap-3">
//                     <button
//                         className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 cursor-pointer"
//                         onClick={onClose}
//                     >
//                         Cancel
//                     </button>
//                     <button
//                         className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 cursor-pointer"
//                         onClick={onConfirm}
//                     >
//                         Delete
//                     </button>
//                 </div>
//             </div>

//         </div>
//     );
// };


// export default Transactions


