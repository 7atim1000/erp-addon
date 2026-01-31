import React, { useState } from 'react'
import { MdOutlineClose } from "react-icons/md";
import {useNavigate} from 'react-router-dom'
import { motion } from 'framer-motion'
import { TbReportSearch } from "react-icons/tb";
import { IoSettings } from "react-icons/io5";
import { IoMdCart } from "react-icons/io";
import { BiCategoryAlt } from "react-icons/bi";
import { BsListStars } from "react-icons/bs";
import { TbUsersGroup } from "react-icons/tb";
import { TiGroupOutline } from "react-icons/ti";
import { BsFileEarmarkPptFill } from "react-icons/bs";
import SaleModal from './SaleModal';
import BuyModal from './BuyModal';

const InvoiceModal = ({setIsInvoiceModalOpen}) => {
    const navigate = useNavigate();
    const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
    const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);

    const handleClose = () => {
        setIsInvoiceModalOpen(false);
    }

    const handleSaleModalOpen = (action) => {
        if (action === 'sale') setIsSaleModalOpen(true);
    }

    const handleBuyModalOpen = (action) => {
        if (action === 'buy') setIsBuyModalOpen(true);
    }

    const navigationItems = [
        {
            title: "Transactions",
            icon: <IoMdCart className="text-blue-600 w-5 h-5" />,
            bgColor: "from-blue-500 to-blue-600",
            items: [
                { label: "Sales", icon: <TbReportSearch className="text-white w-5 h-5" />, path: '/sales' },
                { label: "Purchases", icon: <BsFileEarmarkPptFill className="text-white w-5 h-5" />, path: '/buy' },
            ]
        },
        {
            title: "Inventory",
            icon: <BiCategoryAlt className="text-blue-600 w-5 h-5" />,
            bgColor: "from-emerald-500 to-emerald-600",
            items: [
                { label: "Categories", icon: <BiCategoryAlt className="text-white w-5 h-5" />, path: '/categories' },
                { label: "Items", icon: <BsListStars className="text-white w-5 h-5" />, path: '/services' },
                { label: "Units", icon: <BsListStars className="text-white w-5 h-5" />, path: '/units' },
            ]
        },
        {
            title: "Relations",
            icon: <TiGroupOutline className="text-blue-600 w-5 h-5" />,
            bgColor: "from-purple-500 to-purple-600",
            items: [
                { label: "Customers", icon: <TiGroupOutline className="text-white w-5 h-5" />, path: '/customers' },
                { label: "Suppliers", icon: <TbUsersGroup className="text-white w-5 h-5" />, path: '/suppliers' },
            ]
        },
        {
            title: "Management",
            icon: <IoSettings className="text-blue-600 w-5 h-5" />,
            bgColor: "from-amber-500 to-amber-600",
            items: [
                { label: "Invoices", icon: <IoSettings className="text-white w-5 h-5" />, path: '/invoices' },
                { label: "Reports", icon: <TbReportSearch className="text-white w-5 h-5" />, path: '/reports' },
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
                className='bg-gradient-to-b from-white to-blue-50 rounded-2xl shadow-2xl border border-blue-200 w-full max-w-4xl max-h-[90vh] overflow-hidden'
            >
                {/* Header */}
                <div className='bg-gradient-to-r from-blue-600 to-blue-700 p-4 md:p-6'>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-3'>
                            <div className='bg-white/20 p-2 rounded-lg'>
                                <IoMdCart className='text-white w-6 h-6' />
                            </div>
                            <div>
                                <h2 className='text-xl md:text-2xl font-bold text-white'>Business Management</h2>
                                <p className='text-blue-100 text-sm'>Quick access to all business modules</p>
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

                {/* Navigation Grid */}
                <div className='p-4 md:p-6 overflow-y-auto max-h-[60vh]'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        {navigationItems.map((section, sectionIndex) => (
                            <motion.div
                                key={section.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: sectionIndex * 0.1 }}
                                className='bg-white rounded-2xl border border-blue-100 shadow-lg overflow-hidden'
                            >
                                {/* Section Header with Gradient */}
                                <div className={`bg-gradient-to-r ${section.bgColor} p-4`}>
                                    <div className='flex items-center gap-3'>
                                        <div className='p-2 bg-white/20 rounded-lg'>
                                            {section.icon}
                                        </div>
                                        <h3 className='text-lg font-bold text-white'>{section.title}</h3>
                                    </div>
                                </div>
                                
                                {/* Section Items */}
                                <div className='p-4'>
                                    <div className='space-y-2'>
                                        {section.items.map((item, itemIndex) => (
                                            <motion.button
                                                key={item.label}
                                                whileHover={{ scale: 1.02, x: 5 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => {
                                                    navigate(item.path);
                                                    handleClose();
                                                }}
                                                className='flex items-center justify-between w-full p-3 rounded-xl hover:bg-blue-50 transition duration-200 cursor-pointer group'
                                            >
                                                <div className='flex items-center gap-3'>
                                                    <div className={`p-2 rounded-lg bg-gradient-to-r ${section.bgColor} bg-opacity-10`}>
                                                        {item.icon}
                                                    </div>
                                                    <span className='text-sm font-medium text-gray-800'>{item.label}</span>
                                                </div>
                                                <div className='opacity-0 group-hover:opacity-100 transition duration-200'>
                                                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </div>
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Quick Action Buttons at Bottom */}
                <div className='bg-gradient-to-r from-blue-50 to-blue-100 p-4 border-t border-blue-200'>
                    <div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
                        <div className='text-sm text-gray-600'>
                            <div className='flex items-center gap-2'>
                                <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
                                <span>Ready to manage your business operations</span>
                            </div>
                        </div>
                        <div className='flex items-center gap-3'>
                            {/* <button
                                onClick={() => handleSaleModalOpen('sale')}
                                className='flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2.5 rounded-lg transition duration-200 cursor-pointer text-sm font-medium'
                            >
                                <IoMdCart className='w-4 h-4' />
                                <span>New Sale</span>
                            </button> */}
                            {/* <button
                                onClick={() => handleBuyModalOpen('buy')}
                                className='flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2.5 rounded-lg transition duration-200 cursor-pointer text-sm font-medium'
                            >
                                <BsFileEarmarkPptFill className='w-4 h-4' />
                                <span>New Purchase</span>
                            </button> */}
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

            {/* Modals */}
            {isSaleModalOpen && <SaleModal setIsSaleModalOpen={setIsSaleModalOpen} />}
            {isBuyModalOpen && <BuyModal setIsBuyModalOpen={setIsBuyModalOpen} />}
        </div>
    );
};

export default InvoiceModal;

// import React, { useState } from 'react'
// import { MdOutlineClose } from "react-icons/md";
// import {useNavigate} from 'react-router-dom'
// import { IoCloseCircle } from "react-icons/io5";
// import { motion } from 'framer-motion'
// import { TbReportSearch } from "react-icons/tb";
// import { IoSettings } from "react-icons/io5";
// import { IoMdCart } from "react-icons/io";
// import { BiCategoryAlt } from "react-icons/bi";
// import { BsListStars } from "react-icons/bs";
// import { TbUsersGroup } from "react-icons/tb";
// import { TiGroupOutline } from "react-icons/ti";


// import { BsFileEarmarkPptFill } from "react-icons/bs";
// import SaleModal from './SaleModal';
// import BuyModal from './buyModal';


// const InvoiceModal = ({setIsInvoiceModalOpen}) =>{
//     const navigate = useNavigate();

//        const handleClose = () => {
//         setIsInvoiceModalOpen(false)
//     }

       
    

//     return (
//         <div className ='fixed inset-0 bg-opacity-50 flex items-center justify-center shadow-lg z-50' style={{ backgroundColor:  'rgba(20, 10, 10, 0.4)'}} >
//             <motion.div
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.9 }}
//                 transition={{ durayion: 0.3, ease: 'easeInOut' }}

//                 className='bg-white p-3 rounded-lg shadow-lg/30 w-100 h-50% md:mt-0 mt-0 h-[calc(100vh-5rem)]'
//             >

//                 <div className='flex justify-between items-center shadow-xl p-5'>
//                     <h2 className='text-black text-sm font-semibold'>Invoices</h2>
//                     <button onClick={handleClose} className='inline text-[#1a1a1a] cursor-pointer hover:text-[#be3e3f]'>
//                         <MdOutlineClose size={25} />
//                     </button>
//                 </div>

         

//             <div className ='flex flex-col gap-7 justify-between items-center px-8 mt-2'>

//                     <div className='flex justify-between items-center w-full p-3 shadow-xl border-b-3 border-[#e3d1b9]'>
//                         <div className='flex justify-between items-center  '>
//                             <button onClick={() => navigate('/categories')} className='w-35 h-15 shadow-lg/30 bg-white rounded-lg  px-2 py-3 text-sm text-black font-semibold cursor-pointer'>
//                                 Categories <BiCategoryAlt className ='text-[#0ea5e9] inline' size={25}/>
//                             </button>
//                         </div>
//                         <div className='flex justify-between items-center  '>
//                             <button onClick={() => navigate('/services')} className='w-35 h-15 shadow-lg/30 bg-white rounded-lg  px-2 py-3 text-sm text-black font-semibold cursor-pointer'>
//                                 Items  <BsListStars className ='text-[#0ea5e9] inline' size={25}/>
//                             </button>
//                         </div>
//                         <div className='flex justify-between items-center  '>
//                             <button onClick={() => navigate('/units')} className='w-35 h-15 shadow-lg/30 bg-white rounded-lg  px-2 py-3 text-sm text-black font-semibold cursor-pointer'>
//                                 Units  <BsListStars className ='text-[#0ea5e9] inline' size={25}/>
//                             </button>
//                         </div>
                        

//                     </div>

//                     <div className='flex justify-between items-center w-full p-3 shadow-xl border-b-3 border-[#e3d1b9]'>
//                         <div className='flex justify-between items-center '>
//                             <button onClick={() => navigate('/customers')} className='w-35 h-15 shadow-lg/30 bg-white rounded-lg  px-2 py-3 text-sm text-black font-semibold cursor-pointer'>
//                                 Customers <TiGroupOutline size={25} className='inline text-[#0ea5e9]' />
//                             </button>
//                         </div>
//                         <div className='flex justify-between items-center '>
//                             <button onClick={() => navigate('/suppliers')} className='w-35 h-15 shadow-lg/30 bg-white rounded-lg  px-2 py-3 text-sm text-black font-semibold cursor-pointer'>
//                                 Suppliers  <TbUsersGroup size={25} className='inline text-[#0ea5e9]' />
//                             </button>
//                         </div>

//                     </div>

//                     <div className='flex justify-between items-center w-full p-3 shadow-xl border-b-3 border-[#e3d1b9]'>
//                         <div className='flex justify-between items-center'>
//                             <button onClick={() => navigate('/sales')} className='w-35 h-15 shadow-lg/30 bg-white rounded-lg  px-2 py-3 text-sm text-black font-semibold cursor-pointer'>
//                                 Sales <TbReportSearch size={25} className='inline text-[#0ea5e9]' />
//                             </button>
//                         </div>
//                         <div className='flex justify-between items-center '>
//                             <button onClick={() => navigate('/buy')} className='w-35 h-15 shadow-lg/30 bg-white rounded-lg  px-2 py-3 text-sm text-black font-semibold cursor-pointer'>
//                                 Purchases <BsFileEarmarkPptFill size={25} className='inline text-[#0ea5e9]' />
//                             </button>
//                         </div>
//                     </div>

//                     <div className='flex justify-between items-center w-full p-3 shadow-xl border-b-3 border-[#e3d1b9]'>
//                         <div className='flex justify-between items-center'>
//                             <button onClick={() => navigate('/invoices')} className='w-35 h-15 shadow-lg/30 bg-white rounded-lg  px-2 py-3 text-sm text-black font-semibold cursor-pointer'>
//                                 Invoices <IoSettings size={25} className='inline text-[#0ea5e9]' />
//                             </button>
//                         </div>
//                         <div className='flex justify-between items-center '>
//                             <button onClick={() => navigate('/reports')} className='w-35 h-15 shadow-lg/30 bg-white rounded-lg  px-2 py-3 text-sm text-black font-semibold cursor-pointer'>
//                                 Reports <TbReportSearch size={25} className='inline text-[#0ea5e9]' />
//                             </button>
//                         </div>
//                     </div>
                
            
//             </div>

               
            
//             </motion.div>
 

//        </div>
//     )
// }

// export default InvoiceModal ;