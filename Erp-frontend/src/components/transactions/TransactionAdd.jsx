import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { IoCloseCircle } from "react-icons/io5";
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify';
import { api } from '../../https';
import { MdAttachMoney, MdCategory, MdDescription, MdDateRange, MdPayment, MdReceipt } from "react-icons/md";
import { FaArrowUp, FaArrowDown, FaMoneyBillWave } from "react-icons/fa";

const TransactionAdd = ({ setIsAddTransactionModalOpen, fetchTransactions }) => {
    const userData = useSelector((state) => state.user);
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        amount: "",
        type: "",
        category: "",
        refrence: "",
        description: "",
        transactionNumber: `${Date.now()}`,
        date: new Date().toISOString().slice(0, 10),
        user: userData._id,
        paymentMethod: "Cash"
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleClose = () => {
        setIsAddTransactionModalOpen(false);
    };

    function getCurrentShift() {
        const hour = new Date().getHours();
        return (hour >= 6 && hour < 18) ? 'Morning' : 'Evening';
    }

    const formDataWithShift = {
        ...formData,
        shift: getCurrentShift(),
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const response = await api.post('/api/transactions/add-transaction', formDataWithShift);

            if (response.data.success) {
                toast.success(response.data.message);
                fetchTransactions();
                setIsAddTransactionModalOpen(false);
            } else {
                toast.error(response.data.message || 'Failed to add transaction!');
            }
        } catch (error) {
            toast.error('Failed to add new transaction!');
        } finally {
            setLoading(false);
        }
    };

    // Fetch expenses for selection
    const [list, setList] = useState([]);
    const fetchList = async () => {
        try {
            const response = await api.get('/api/expenses/');
            if (response.data.success) {
                setList(response.data.expenses);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    // Fetch incomes for selection
    const [incomes, setIncome] = useState([]);
    const fetchIncomes = async () => {
        try {
            const response = await api.get('/api/incomes/');
            if (response.data.success) {
                setIncome(response.data.incomes);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    useEffect(() => {
        fetchList();
        fetchIncomes();
    }, []);

    // Payment method options
    const paymentMethods = [
        { value: "Cash", label: "Cash", icon: "💵" },
        { value: "Credit Card", label: "Credit Card", icon: "💳" },
        { value: "Debit Card", label: "Debit Card", icon: "🏦" },
        { value: "Bank Transfer", label: "Bank Transfer", icon: "↗️" },
        { value: "Digital Wallet", label: "Digital Wallet", icon: "📱" },
        { value: "Check", label: "Check", icon: "📝" }
    ];

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className='bg-gradient-to-b from-white to-blue-50 rounded-xl shadow-2xl border border-blue-200 
                          w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col'
            >
                {/* Modal Header */}
                <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 to-blue-700 p-4 sm:p-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-2 rounded-lg">
                                <MdReceipt className="text-white w-5 h-5" />
                            </div>
                            <div>
                                <h2 className='text-lg sm:text-xl font-bold text-white'>Add New Transaction</h2>
                                <p className='text-blue-100 text-xs sm:text-sm'>Record financial transaction</p>
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
                        {/* Type Selection */}
                        <div className="mb-5">
                            <label className='text-sm font-medium text-gray-700 flex items-center gap-2 mb-3'>
                                <FaMoneyBillWave className="text-blue-600 w-4 h-4" />
                                Transaction Type
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type='button'
                                    onClick={() => setFormData(prev => ({ ...prev, type: 'Income' }))}
                                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border 
                                             transition duration-200 cursor-pointer text-sm font-medium
                                             ${formData.type === 'Income'
                                                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white border-green-600 shadow-md'
                                                : 'bg-white border-blue-200 text-gray-700 hover:bg-green-50'
                                             }`}
                                    disabled={loading}
                                >
                                    <FaArrowUp className="w-4 h-4" />
                                    Income
                                </button>
                                <button
                                    type='button'
                                    onClick={() => setFormData(prev => ({ ...prev, type: 'Expense' }))}
                                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border 
                                             transition duration-200 cursor-pointer text-sm font-medium
                                             ${formData.type === 'Expense'
                                                ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white border-red-600 shadow-md'
                                                : 'bg-white border-blue-200 text-gray-700 hover:bg-red-50'
                                             }`}
                                    disabled={loading}
                                >
                                    <FaArrowDown className="w-4 h-4" />
                                    Expense
                                </button>
                            </div>
                            {formData.type && (
                                <p className={`text-xs mt-2 font-medium text-center
                                    ${formData.type === 'Income' ? 'text-green-600' : 'text-red-600'}`}>
                                    Selected: {formData.type}
                                </p>
                            )}
                        </div>

                        {/* Category Selection */}
                        {(formData.type === 'Income' || formData.type === 'Expense') && (
                            <div className="mb-4">
                                <label className='text-sm font-medium text-gray-700 flex items-center gap-2 mb-2'>
                                    <MdCategory className="text-blue-600 w-4 h-4" />
                                    Category
                                </label>
                                <div className="relative">
                                    <select
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        name='category'
                                        className='w-full px-4 py-3 pl-10 bg-white border border-blue-200 rounded-lg 
                                                 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 
                                                 focus:border-transparent transition duration-200 appearance-none'
                                        disabled={loading}
                                    >
                                        <option value="">
                                            {formData.type === 'Income' 
                                                ? 'Select Income Category' 
                                                : 'Select Expense Category'}
                                        </option>
                                        {(formData.type === 'Income' ? incomes : list).map((item, index) => (
                                            <option key={index} value={item[formData.type === 'Income' ? 'incomeName' : 'expenseName']}>
                                                {item[formData.type === 'Income' ? 'incomeName' : 'expenseName']}
                                            </option>
                                        ))}
                                    </select>
                                    <MdCategory className='absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600' />
                                </div>
                            </div>
                        )}

                        {/* Payment Method */}
                        <div className="mb-4">
                            <label className='text-sm font-medium text-gray-700 flex items-center gap-2 mb-2'>
                                <MdPayment className="text-blue-600 w-4 h-4" />
                                Payment Method
                            </label>
                            <div className="relative">
                                <select
                                    value={formData.paymentMethod}
                                    onChange={handleInputChange}
                                    name='paymentMethod'
                                    className='w-full px-4 py-3 pl-10 bg-white border border-blue-200 rounded-lg 
                                             text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 
                                             focus:border-transparent transition duration-200 appearance-none'
                                    disabled={loading}
                                >
                                    {paymentMethods.map((method, index) => (
                                        <option key={index} value={method.value}>
                                            {method.icon} {method.label}
                                        </option>
                                    ))}
                                </select>
                                <MdPayment className='absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600' />
                            </div>
                        </div>

                        {/* Amount */}
                        <div className="mb-4">
                            <label className='text-sm font-medium text-gray-700 flex items-center gap-2 mb-2'>
                                <MdAttachMoney className="text-blue-600 w-4 h-4" />
                                Amount
                            </label>
                            <div className="relative">
                                <input
                                    type='number'
                                    name='amount'
                                    value={formData.amount}
                                    onChange={handleInputChange}
                                    placeholder='Enter amount'
                                    className='w-full px-4 py-3 pl-10 pr-12 bg-white border border-blue-200 rounded-lg 
                                             text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 
                                             focus:border-transparent transition duration-200'
                                    required
                                    min="0"
                                    step="0.01"
                                    disabled={loading}
                                />
                                <MdAttachMoney className='absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600' />
                                <span className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm'>
                                    AED
                                </span>
                            </div>
                        </div>

                        {/* Reference */}
                        <div className="mb-4">
                            <label className='text-sm font-medium text-gray-700 flex items-center gap-2 mb-2'>
                                <MdReceipt className="text-blue-600 w-4 h-4" />
                                Reference
                            </label>
                            <div className="relative">
                                <input
                                    type='text'
                                    name='refrence'
                                    value={formData.refrence}
                                    onChange={handleInputChange}
                                    placeholder='Enter reference (invoice number, receipt ID, etc.)'
                                    className='w-full px-4 py-3 pl-10 bg-white border border-blue-200 rounded-lg 
                                             text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 
                                             focus:border-transparent transition duration-200'
                                    required
                                    disabled={loading}
                                />
                                <MdReceipt className='absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600' />
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mb-4">
                            <label className='text-sm font-medium text-gray-700 flex items-center gap-2 mb-2'>
                                <MdDescription className="text-blue-600 w-4 h-4" />
                                Description
                            </label>
                            <div className="relative">
                                <input
                                    type='text'
                                    name='description'
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder='Enter transaction description'
                                    className='w-full px-4 py-3 pl-10 bg-white border border-blue-200 rounded-lg 
                                             text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 
                                             focus:border-transparent transition duration-200'
                                    required
                                    disabled={loading}
                                />
                                <MdDescription className='absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600' />
                            </div>
                        </div>

                        {/* Date */}
                        <div className="mb-6">
                            <label className='text-sm font-medium text-gray-700 flex items-center gap-2 mb-2'>
                                <MdDateRange className="text-blue-600 w-4 h-4" />
                                Transaction Date
                            </label>
                            <div className="relative">
                                <input
                                    type='date'
                                    name='date'
                                    value={formData.date}
                                    onChange={handleInputChange}
                                    className='w-full px-4 py-3 pl-10 bg-white border border-blue-200 rounded-lg 
                                             text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 
                                             focus:border-transparent transition duration-200'
                                    required
                                    disabled={loading}
                                />
                                <MdDateRange className='absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600' />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type='submit'
                            disabled={loading || !formData.type || !formData.amount || !formData.category}
                            className={`w-full py-3 rounded-lg transition duration-200 cursor-pointer 
                                     font-medium text-sm flex items-center justify-center gap-2
                                     ${loading || !formData.type || !formData.amount || !formData.category
                                        ? 'bg-blue-400 cursor-not-allowed' 
                                        : formData.type === 'Income'
                                            ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                                            : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                                     } text-white shadow-sm hover:shadow-md`}
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    <span>Adding Transaction...</span>
                                </>
                            ) : (
                                <>
                                    <MdReceipt className="w-4 h-4" />
                                    <span>Add Transaction</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <div className="border-t border-blue-200 bg-blue-50 p-4">
                    <button
                        onClick={handleClose}
                        disabled={loading}
                        className='w-full py-2.5 bg-white border border-blue-300 text-blue-700 rounded-lg 
                                 hover:bg-blue-50 transition duration-200 cursor-pointer font-medium text-sm'
                    >
                        Cancel
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default TransactionAdd;

// import React, { useState, useEffect } from 'react'
// import { motion } from 'framer-motion'
// import { IoCloseCircle } from "react-icons/io5";
// import { useSelector } from 'react-redux'

// import { toast } from 'react-toastify';
// import moment from 'moment-hijri'
// import { api } from '../../https';

// const TransactionAdd = ({ setIsAddTransactionModalOpen, fetchTransactions }) => {

//     const userData = useSelector((state) => state.user); 
//     const [formData, setFormData] = useState({
//         amount: "", 
//         type: "", 
//         category: "", 
//         refrence: "", 
//         description: "", 
//         transactionNumber: `${Date.now()}`,
//         date: new Date().toISOString().slice(0, 10),
//         user: userData._id,
//         paymentMethod: "Cash" // Default payment method
//     });

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prev) => ({ ...prev, [name]: value }));
//     };

//     const handleClose = () => {
//         setIsAddTransactionModalOpen(false)
//     };

//     function getCurrentShift() {
//         const hour = new Date().getHours();
//         return (hour >= 6 && hour < 18) ? 'Morning' : 'Evening';
//     }

//     const formDataWithShift = {
//         ...formData,
//         shift: getCurrentShift(),
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const response = await api.post('/api/transactions/add-transaction', formDataWithShift)

//             if (response.data.success) {
//                 toast.success(response.data.message);
//                 fetchTransactions();
//                 setIsAddTransactionModalOpen(false);
//             } else {
//                 toast.error(response.data.message || 'Failed to add transaction!');
//             }

//         } catch (error) {
//             toast.error('Failed to add new transaction!')
//         }
//     };

//     // Fetch expenses for selection
//     const [list, setList] = useState([])
//     const fetchList = async () => {
//         try {
//             const response = await api.get('/api/expenses/')
//             if (response.data.success) {
//                 setList(response.data.expenses);
//             } else {
//                 toast.error(response.data.message)
//             }
//         } catch (error) {
//             console.log(error)
//             toast.error(error.message)
//         }
//     };

//     // Fetch incomes for selection
//     const [incomes, setIncome] = useState([])
//     const fetchIncomes = async () => {
//         try {
//             const response = await api.get('/api/incomes/')
//             if (response.data.success) {
//                 setIncome(response.data.incomes);
//             } else {
//                 toast.error(response.data.message)
//             }
//         } catch (error) {
//             console.log(error)
//             toast.error(error.message)
//         }
//     };

//     useEffect(() => {
//         fetchList();
//         fetchIncomes();
//     }, [])

//     // Payment method options
//     const paymentMethods = [
//         { value: "Cash", label: "Cash" },
//         { value: "Credit Card", label: "Credit Card" },
//         { value: "Debit Card", label: "Debit Card" },
//         { value: "Bank Transfer", label: "Bank Transfer" },
//         { value: "Digital Wallet", label: "Digital Wallet" },
//         { value: "Check", label: "Check" }
//     ];

//     return (
//         <div
//             className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50"
//             style={{ backgroundColor: 'rgba(20, 10, 10, 0.4)' }}>

//             <motion.div
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.9 }}
//                 transition={{ duration: 0.3, ease: 'easeInOut' }}
//                 className='bg-white p-2 rounded-lg shadow-lg/30 w-120 md:mt-5 mt-5 h-[calc(100vh)] overflow-y-scroll scrollbar-hidden'
//             >
//                 {/* Modal Header */}
//                 <div className="flex justify-between items-center mb-2 shadow-xl p-2">
//                     <h2 className='text-[#1a1a1a] text-md font-bold'>Add Transaction</h2>
//                     <button onClick={handleClose} className='rounded-xs text-[#be3e3f] hover:bg-[#be3e3f]/30 cursor-pointer border-b border-[#be3e3f]'>
//                         <IoCloseCircle size={22} />
//                     </button>
//                 </div>

//                 {/* Modal Body */}
//                 <form className='mt-5 space-y-6' onSubmit={handleSubmit}>

//                     {/* Type Selection */}
//                     <div className='flex items-center justify-between'>
//                         <label className='text-[#1f1f1f] block mb-2 mt-3 text-sm font-normal'>Type :</label>
//                         <div className='flex items-center gap-3 rounded-lg p-3 bg-white shadow-lg/30'>
//                             <label className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-all ${formData.type === 'Income'
//                                     ? 'bg-green-50 text-green-700 ring-2 ring-green-500'
//                                     : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
//                                 }`}>
//                                 <input
//                                     type='radio'
//                                     name='type'
//                                     value='Income'
//                                     checked={formData.type === 'Income'}
//                                     onChange={handleInputChange}
//                                     className='hidden'
//                                 />
//                                 <span className='text-green-500'>💰</span>
//                                 <span className='text-xs font-semibold'>Income</span>
//                             </label>

//                             <label className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-all ${formData.type === 'Expense'
//                                     ? 'bg-red-50 text-red-700 ring-2 ring-red-500'
//                                     : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
//                                 }`}>
//                                 <input
//                                     type='radio'
//                                     name='type'
//                                     value='Expense'
//                                     checked={formData.type === 'Expense'}
//                                     onChange={handleInputChange}
//                                     className='hidden'
//                                 />
//                                 <span className='text-red-500'>💸</span>
//                                 <span className='text-xs font-semibold'>Expense</span>
//                             </label>
//                         </div>
//                     </div>

//                     {/* Conditionally render category dropdown based on selected type */}
//                     {formData.type === 'Income' && (
//                         <div className='flex items-center justify-between'>
//                             <label className='w-[25%] text-[#1a1a1a] block text-xs font-normal'>Category :</label>
//                             <div className='flex w-[75%] items-center rounded-xs p-3 bg-white shadow-xl'>
//                                 <select
//                                     className='w-full bg-zinc-100 h-8 rounded-sm text-xs font-normal'
//                                     value={formData.category}
//                                     onChange={handleInputChange}
//                                     name='category'
//                                 >
//                                     <option value="">Select Income Category</option>
//                                     {incomes.map((income, index) => (
//                                         <option key={index} value={income.incomeName}>
//                                             {income.incomeName}
//                                         </option>
//                                     ))}
//                                 </select>
//                             </div>
//                         </div>
//                     )}

//                     {formData.type === 'Expense' && (
//                         <div className='flex items-center justify-between'>
//                             <label className='w-[25%] text-[#1a1a1a] block text-xs font-normal'>Category :</label>
//                             <div className='flex w-[75%] items-center rounded-xs p-3 bg-white shadow-xl'>
//                                 <select
//                                     className='w-full bg-zinc-100 h-8 rounded-sm text-xs font-normal'
//                                     value={formData.category}
//                                     onChange={handleInputChange}
//                                     name='category'
//                                 >
//                                     <option value="">Select Expense Category</option>
//                                     {list.map((expense, index) => (
//                                         <option key={index} value={expense.expenseName}>
//                                             {expense.expenseName}
//                                         </option>
//                                     ))}
//                                 </select>
//                             </div>
//                         </div>
//                     )}

//                     {/* Payment Method Field */}
//                     <div className='flex items-center justify-between'>
//                         <label className='w-[25%] text-[#1a1a1a] block text-xs font-normal'>Payment Method :</label>
//                         <div className='flex w-[75%] items-center rounded-xs p-3 bg-white shadow-xl'>
//                             <select
//                                 className='w-full bg-zinc-100 h-8 rounded-sm text-xs font-normal'
//                                 value={formData.paymentMethod}
//                                 onChange={handleInputChange}
//                                 name='paymentMethod'
//                             >
//                                 {paymentMethods.map((method, index) => (
//                                     <option key={index} value={method.value}>
//                                         {method.label}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>
//                     </div>

//                     <div className='flex items-center justify-between'>
//                         <label className='w-[25%] text-[#1a1a1a] block text-xs font-normal'>Amount :</label>
//                         <div className='flex w-[75%] items-center rounded-xs p-3 bg-white shadow-xl'>
//                             <input
//                                 type='text'
//                                 name='amount'
//                                 value={formData.amount}
//                                 onChange={handleInputChange}
//                                 placeholder='Enter amount'
//                                 className='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none text-xs font-normal border-b border-yellow-700'
//                                 required
//                                 autoComplete='none'
//                             />
//                         </div>
//                     </div>

//                     <div className='flex items-center justify-between'>
//                         <label className='w-[25%] text-[#1a1a1a] block text-xs font-normal'>Refrence :</label>
//                         <div className='flex w-[75%] items-center rounded-xs p-3 bg-white shadow-xl'>
//                             <input
//                                 type='text'
//                                 name='refrence'
//                                 value={formData.refrence}
//                                 onChange={handleInputChange}
//                                 placeholder='Enter the refrence'
//                                 className='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none text-xs font-normal border-b border-yellow-700'
//                                 required
//                                 autoComplete='none'
//                             />
//                         </div>
//                     </div>

//                     <div className='flex items-center justify-between'>
//                         <label className='w-[25%] text-[#1a1a1a] block text-xs font-normal'>Description :</label>
//                         <div className='flex w-[75%] items-center rounded-xs p-3 bg-white shadow-xl'>
//                             <input
//                                 type='text'
//                                 name='description'
//                                 value={formData.description}
//                                 onChange={handleInputChange}
//                                 placeholder='Enter description'
//                                 className='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none text-xs font-normal border-b border-yellow-700'
//                                 required
//                                 autoComplete='none'
//                             />
//                         </div>
//                     </div>

//                     <div className='flex items-center justify-between'>
//                         <label className='w-[25%] text-[#1a1a1a] block text-xs font-normal'>Date :</label>
//                         <div className='flex w-[75%] items-center rounded-xs p-3 bg-white shadow-xl'>
//                             <input
//                                 type='date'
//                                 name='date'
//                                 value={formData.date}
//                                 onChange={handleInputChange}
//                                 placeholder='Enter date'
//                                 className='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none text-xs font-normal border-b border-yellow-700'
//                                 required
//                                 autoComplete='none'
//                             />
//                         </div>
//                     </div>

//                     <button
//                         type='submit'
//                         className='p-3 rounded-xs mt-6 py-3 text-sm bg-[#0ea5e9] text-white font-semibold cursor-pointer w-full'
//                     >
//                         Add Transaction
//                     </button>
//                 </form>
//             </motion.div>
//         </div>
//     );
// };

// export default TransactionAdd;