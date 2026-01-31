import React from 'react'
import { useNavigate } from 'react-router-dom'
import { MdOutlineClose, MdSwapVerticalCircle, MdAttachMoney, MdTrendingUp, MdTrendingDown } from "react-icons/md";
import { motion } from 'framer-motion'
import { FaExchangeAlt, FaFileInvoiceDollar, FaMoneyCheckAlt } from "react-icons/fa";

const FinanModal = ({ setIsFinanModalOpen }) => {
    const navigate = useNavigate();

    const handleClose = () => {
        setIsFinanModalOpen(false);
    }

    const financialSections = [
        {
            title: "Transactions",
            description: "Complete financial transaction management",
            icon: <MdSwapVerticalCircle className="text-white w-6 h-6" />,
            bgColor: "from-blue-500 to-blue-600",
            items: [
                { 
                    label: "All Transactions", 
                    icon: <FaExchangeAlt className="text-blue-600 w-5 h-5" />, 
                    path: '/transactions',
                    description: "View and manage all transactions"
                },
                // { 
                //     label: "New Transaction", 
                //     icon: <FaFileInvoiceDollar className="text-blue-600 w-5 h-5" />, 
                //     path: '/transactions/add',
                //     description: "Add new financial transaction"
                // },
            ]
        },
        {
            title: "Revenue & Income",
            description: "Manage all income sources and revenue",
            icon: <MdTrendingUp className="text-white w-6 h-6" />,
            bgColor: "from-green-500 to-green-600",
            items: [
                { 
                    label: "Income Accounts", 
                    icon: <FaMoneyCheckAlt className="text-green-600 w-5 h-5" />, 
                    path: '/incomes',
                    description: "Manage revenue sources"
                },
            ]
        },
        {
            title: "Expenses & Costs",
            description: "Track and manage all business expenses",
            icon: <MdTrendingDown className="text-white w-6 h-6" />,
            bgColor: "from-red-500 to-red-600",
            items: [
                { 
                    label: "Expense Accounts", 
                    icon: <MdTrendingDown className="text-red-600 w-5 h-5" />, 
                    path: '/expenses',
                    description: "Manage cost centers"
                },
            ]
        }
    ];

    return (
        <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className='bg-gradient-to-b from-white to-blue-50 rounded-2xl shadow-2xl border border-blue-200 w-full max-w-3xl max-h-[90vh] overflow-hidden'
            >
                {/* Header */}
                <div className='bg-gradient-to-r from-blue-600 to-blue-700 p-4 md:p-6'>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-3'>
                            <div className='bg-white/20 p-2 rounded-lg'>
                                <MdAttachMoney className='text-white w-6 h-6' />
                            </div>
                            <div>
                                <h2 className='text-xl md:text-2xl font-bold text-white'>Financial Management</h2>
                                <p className='text-blue-100 text-sm'>Complete financial control and monitoring</p>
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            className='p-2 text-white hover:bg-white/20 rounded-lg transition duration-200 cursor-pointer'
                        >
                            <MdOutlineClose className='w-6 h-6' />
                        </button>
                    </div>
                </div>

                {/* Financial Sections Grid */}
                <div className='p-4 md:p-6 overflow-y-auto max-h-[60vh]'>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                        {financialSections.map((section, sectionIndex) => (
                            <motion.div
                                key={section.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: sectionIndex * 0.1 }}
                                className='bg-white rounded-2xl border border-blue-100 shadow-lg overflow-hidden'
                            >
                                {/* Section Header */}
                                <div className={`bg-gradient-to-r ${section.bgColor} p-4`}>
                                    <div className='flex items-center justify-center'>
                                        <div className='flex items-center gap-3'>
                                            <div className='p-2 bg-white/20 rounded-lg'>
                                                {section.icon}
                                            </div>
                                            <div>
                                                <h3 className='text-lg font-bold text-white'>{section.title}</h3>
                                                <p className='text-white/90 text-xs'>{section.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Section Items */}
                                <div className='p-4'>
                                    <div className='space-y-3'>
                                        {section.items.map((item, itemIndex) => (
                                            <motion.button
                                                key={item.label}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => {
                                                    navigate(item.path);
                                                    handleClose();
                                                }}
                                                className='flex flex-col items-center justify-center w-full p-4 rounded-xl hover:bg-blue-50 transition duration-200 cursor-pointer group border border-blue-100'
                                            >
                                                <div className='p-3 bg-blue-100 rounded-lg mb-2 group-hover:bg-blue-200 transition duration-200'>
                                                    {item.icon}
                                                </div>
                                                <span className='text-sm font-semibold text-gray-800 text-center mb-1'>{item.label}</span>
                                                <span className='text-xs text-gray-500 text-center'>{item.description}</span>
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions Footer */}
                <div className='bg-gradient-to-r from-blue-50 to-blue-100 p-4 border-t border-blue-200'>
                    <div className='flex flex-col md:flex-row items-center justify-between gap-4'>
                        <div className='flex items-center gap-3'>
                            <div className='p-2 bg-white rounded-lg shadow-sm'>
                                <MdAttachMoney className='w-5 h-5 text-blue-600' />
                            </div>
                            <div>
                                <p className='text-sm font-medium text-gray-700'>Financial Dashboard</p>
                                <p className='text-xs text-gray-500'>Manage all financial operations</p>
                            </div>
                        </div>
                        
                        <div className='flex items-center gap-3'>
                            <button
                                onClick={() => {
                                    navigate('/transactions/add');
                                    handleClose();
                                }}
                                className='flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2.5 rounded-lg transition duration-200 cursor-pointer text-sm font-medium shadow-sm'
                            >
                                <FaFileInvoiceDollar className='w-4 h-4' />
                                <span>New Transaction</span>
                            </button>
                            <button
                                onClick={handleClose}
                                className='px-4 py-2.5 bg-white border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition duration-200 cursor-pointer text-sm font-medium'
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default FinanModal;

// import React from 'react'
// import {useNavigate} from 'react-router-dom'
// import { IoCloseCircle } from "react-icons/io5";
// import { MdOutlineClose } from "react-icons/md";
// import { motion } from 'framer-motion'
// import { TbReportSearch } from "react-icons/tb";
// import { LuFilePlus2 } from "react-icons/lu";
// import { MdSwapVerticalCircle } from "react-icons/md";
// import { FcGenericSortingAsc } from "react-icons/fc";
// import { FcGenericSortingDesc } from "react-icons/fc";

// const FinanModal = ({setIsFinanModalOpen}) =>{
//     const navigate = useNavigate();

//        const handleClose = () => {
//         setIsFinanModalOpen(false)
//     }

//     return (

//         <div className ='fixed inset-0 bg-opacity-50 flex items-center justify-center shadow-lg z-50' 
//         style={{ backgroundColor:  'rgba(20, 10, 10, 0.4)'}} >
//            <motion.div
//                 initial ={{opacity :0 , scale :0.9}}
//                 animate ={{opacity :1, scale :1}}
//                 exit ={{opacity :0, scale :0.9}}
//                 transition ={{durayion :0.3 , ease: 'easeInOut'}}

//                 className ='bg-white p-3 rounded-lg shadow-lg/30 w-100 h-50% md:mt-0 mt-0 h-[calc(100vh-5rem)]'
//             >

//                 <div className='flex justify-between items-center shadow-xl p-5'>
//                     <h2 className='text-black text-sm font-semibold'>Financials</h2>
//                     <button onClick={handleClose} className='inline text-[#1a1a1a] cursor-pointer hover:text-[#be3e3f]'>
//                         <MdOutlineClose size={25} />
//                     </button>
//                 </div>

         

//             <div className='flex flex-col gap-7 justify-between items-center px-2 mt-2'>
                
//                 <div className='flex justify-between items-center w-full p-3 shadow-xl border-b-3 border-[#e3d1b9]'>
//                         <div className='flex justify-between items-center  '>
//                             <button onClick ={()=> navigate('/expenses')} 
//                                 className='w-40 h-15 shadow-lg/30 bg-white rounded-lg  p-2 text-xs text-black font-semibold cursor-pointer'>
//                                 Expense Accounts  <FcGenericSortingAsc size={25} className='inline text-[#0ea5e9]' />
//                             </button>
//                         </div>
//                         <div className='flex justify-between items-center  '>
//                             <button onClick={() => navigate('/incomes')} 
//                                 className='w-40 h-15 shadow-lg/30 bg-white rounded-lg  p-2 text-xs text-black font-semibold cursor-pointer'>
//                                 Revenue Accounts  <FcGenericSortingDesc size={25} className='inline text-[#0ea5e9]' />
//                             </button>
//                         </div>
//                 </div>
//                     <div className='flex justify-between items-center w-full p-3 shadow-xl border-b-3 border-[#e3d1b9]'>
//                         <div className='flex w-full justify-between items-center  '>
//                             <button onClick={() => navigate('/transactions')}
//                                 className='w-full h-15 shadow-lg/30 bg-white rounded-lg  px-2 py-3 text-sm text-black font-semibold cursor-pointer'>
//                                 Transactions <MdSwapVerticalCircle size={25} className='inline text-[#0ea5e9]' />
//                             </button>
//                         </div>
                       
//                     </div>
//             </div>
            
//             </motion.div>

//        </div>
//     );
// }


// export default FinanModal ;