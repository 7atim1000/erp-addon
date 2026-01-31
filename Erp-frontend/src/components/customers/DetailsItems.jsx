import React, { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { api } from '../../https'
import { MdSearch, MdSort, MdPrint, MdClose, MdChevronLeft, MdChevronRight, MdFilterList } from "react-icons/md";

const DetailsItems = ({ setIsDetailsModal }) => {
    const customerData = useSelector((state) => state.customer)
    const customer = customerData.customerId
    
    const [customerItems, setCustomerItems] = useState([])
    
    // State for items pagination, sort and search
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [sortBy, setSortBy] = useState('createdAt')
    const [sortOrder, setSortOrder] = useState('desc')
    const [searchTerm, setSearchTerm] = useState('')
    const [totalPages, setTotalPages] = useState(1)
    const [totalItems, setTotalItems] = useState(0)

    // Fetch customer items with pagination, sort and search
    const fetchcustomerItems = async () => {
        try {
            const response = await api.post('/api/invoice/customerItems', {
                customer,
                page: currentPage,
                limit: itemsPerPage,
                sortBy: sortBy,
                sortOrder: sortOrder,
                search: searchTerm
            })

            if (response.data.success) {
                setCustomerItems(response.data.data)
                setTotalPages(response.data.pagination.totalPages)
                setTotalItems(response.data.pagination.totalItems)
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response?.data?.message || error.message)
        }
    }

    // Helper functions for items
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage)
    }

    const handleSortChange = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
        } else {
            setSortBy(field)
            setSortOrder('desc')
        }
    }

    const handleSearch = (term) => {
        setSearchTerm(term)
        setCurrentPage(1)
    }

    const handleItemsPerPageChange = (value) => {
        setItemsPerPage(value)
        setCurrentPage(1)
    }

    useEffect(() => {
        fetchcustomerItems()
    }, [customer, currentPage, itemsPerPage, sortBy, sortOrder, searchTerm])

    // Printing
    const invoiceRef = useRef(null)
    const handlePrint = () => {
        const printContent = invoiceRef.current.innerHTML
        const WinPrint = window.open("", "", "width=900, height=650")

        WinPrint.document.write(` 
            <html>
                <head>
                    <title>Customer Items Report</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        .receipt-container { width: 100%; border: 1px solid #ddd; padding: 10px;}
                        h2 { text-align: center; }
                        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                        th { background-color: #f2f2f2; }
                        .controls { display: none; }
                    </style>
                </head>
                <body>
                    ${printContent}
                </body>
            </html>
        `)

        WinPrint.document.close()
        WinPrint.focus()
        setTimeout(() => {
            WinPrint.print()
            WinPrint.close()
        }, 1000)
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className='bg-gradient-to-b from-white to-blue-50 rounded-xl shadow-2xl border border-blue-200 
                          w-full max-w-6xl h-[90vh] overflow-hidden flex flex-col'
            >
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 sm:p-5 flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-2 rounded-lg">
                                <MdFilterList className="text-white w-5 h-5" />
                            </div>
                            <div>
                                <h2 className='text-lg sm:text-xl font-bold text-white'>Customer Items Report</h2>
                                <p className='text-blue-100 text-xs sm:text-sm'>
                                    Customer: <span className='font-semibold'>{customerData.customerName}</span>
                                </p>
                            </div>
                        </div>
                        <button 
                            onClick={() => setIsDetailsModal(false)}
                            className='p-2 text-white hover:bg-white/20 rounded-lg transition duration-200 cursor-pointer'
                        >
                            <MdClose size={22} />
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className='flex-1 overflow-hidden flex flex-col p-4 sm:p-5'>
                    {/* Search and Controls - hidden in print */}
                    <div className='flex flex-col sm:flex-row gap-3 mb-4 sm:mb-5 controls flex-shrink-0'>
                        <div className="relative flex-1">
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600">
                                <MdSearch className="w-5 h-5" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search items..."
                                value={searchTerm}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-blue-200 rounded-lg 
                                         text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 
                                         focus:border-transparent transition duration-200 text-sm"
                            />
                        </div>
                        
                        <div className="flex gap-2">
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600">
                                    <MdSort className="w-4 h-4" />
                                </div>
                                <select
                                    value={sortBy}
                                    onChange={(e) => handleSortChange(e.target.value)}
                                    className="pl-9 pr-4 py-2.5 bg-white border border-blue-200 rounded-lg 
                                             text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 
                                             focus:border-transparent transition duration-200 text-sm appearance-none"
                                >
                                    <option value="createdAt">Date Created</option>
                                    <option value="name">Item Name</option>
                                    <option value="price">Price</option>
                                    <option value="quantity">Quantity</option>
                                </select>
                            </div>
                            
                            <select 
                                value={itemsPerPage} 
                                onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                                className="px-4 py-2.5 bg-white border border-blue-200 rounded-lg 
                                         text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 
                                         focus:border-transparent transition duration-200 text-sm"
                            >
                                <option value={5}>5 per page</option>
                                <option value={10}>10 per page</option>
                                <option value={20}>20 per page</option>
                                <option value={50}>50 per page</option>
                            </select>
                        </div>
                    </div>

                    {/* Content for printing */}
                    <div ref={invoiceRef} className='flex-1 overflow-y-auto bg-white rounded-lg border border-blue-200 p-4 sm:p-5'>
                        {/* Print Header */}
                        <div className='flex flex-col items-center mb-4 sm:mb-6 print:block'>
                            <div className='flex justify-center mb-4'>
                                <div className='w-12 h-12 border-4 border-blue-500 rounded-full flex items-center justify-center'>
                                    <div className='w-6 h-6 bg-blue-500 rounded-full'></div>
                                </div>
                            </div>
                            <h2 className='text-lg sm:text-xl font-bold text-center text-gray-800 mb-1'>
                                Customer Items Report
                            </h2>
                            <p className='text-center text-blue-600 text-sm font-medium'>
                                Customer: {customerData.customerName}
                            </p>
                            <div className="h-px w-full bg-gradient-to-r from-transparent via-blue-300 to-transparent my-3"></div>
                        </div>

                        {/* Items Table */}
                        <div className='overflow-x-auto'>
                            <table className='w-full text-left text-gray-800 text-sm'>
                                <thead className='bg-gradient-to-r from-blue-50 to-blue-100'>
                                    <tr>
                                        <th className='p-3 font-semibold text-blue-700 border-b border-blue-200'>
                                            Name
                                        </th>
                                        <th className='p-3 font-semibold text-blue-700 border-b border-blue-200'>
                                            Price
                                        </th>
                                        <th className='p-3 font-semibold text-blue-700 border-b border-blue-200'>
                                            Quantity
                                        </th>
                                        <th className='p-3 font-semibold text-blue-700 border-b border-blue-200'>
                                            Category
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {customerItems.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className='p-4 text-center text-gray-500'>
                                                <div className="py-8 flex flex-col items-center">
                                                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-3">
                                                        <MdSearch className="w-6 h-6 text-blue-400" />
                                                    </div>
                                                    <p className="text-gray-600 font-medium">No items found</p>
                                                    <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        customerItems.map((item, index) => (
                                            <tr key={index} className='hover:bg-blue-50/50 transition-colors duration-150'>
                                                <td className='p-3 border-b border-blue-100 font-medium'>
                                                    {item.name}
                                                </td>
                                                <td className='p-3 border-b border-blue-100'>
                                                    <span className="font-medium text-blue-600">
                                                        {typeof item.price === 'number' ? item.price.toFixed(2) : item.price}
                                                    </span>
                                                </td>
                                                <td className='p-3 border-b border-blue-100'>
                                                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                                                        {item.quantity}
                                                    </span>
                                                </td>
                                                <td className='p-3 border-b border-blue-100'>
                                                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                                                        {item.category}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Info - hidden in print */}
                        <div className="mt-4 pt-4 border-t border-blue-200 controls">
                            <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-gray-600">
                                <div className="mb-2 sm:mb-0">
                                    Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} items
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="flex items-center gap-1 px-3 py-1.5 bg-white border border-blue-300 rounded-lg 
                                                 text-blue-700 hover:bg-blue-50 transition duration-200 disabled:opacity-50 
                                                 disabled:cursor-not-allowed text-sm font-medium"
                                    >
                                        <MdChevronLeft className="w-4 h-4" />
                                        Previous
                                    </button>
                                    
                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                            let pageNum;
                                            if (totalPages <= 5) {
                                                pageNum = i + 1;
                                            } else if (currentPage <= 3) {
                                                pageNum = i + 1;
                                            } else if (currentPage >= totalPages - 2) {
                                                pageNum = totalPages - 4 + i;
                                            } else {
                                                pageNum = currentPage - 2 + i;
                                            }
                                            
                                            return (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => handlePageChange(pageNum)}
                                                    className={`px-3 py-1 rounded-lg text-sm font-medium transition duration-200
                                                            ${currentPage === pageNum 
                                                                ? 'bg-blue-600 text-white' 
                                                                : 'bg-white border border-blue-200 text-blue-700 hover:bg-blue-50'
                                                            }`}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="flex items-center gap-1 px-3 py-1.5 bg-white border border-blue-300 rounded-lg 
                                                 text-blue-700 hover:bg-blue-50 transition duration-200 disabled:opacity-50 
                                                 disabled:cursor-not-allowed text-sm font-medium"
                                    >
                                        Next
                                        <MdChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className='border-t border-blue-200 bg-blue-50 p-4 sm:p-5 flex-shrink-0'>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={handlePrint}
                            className='flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg 
                                     hover:from-blue-600 hover:to-blue-700 transition duration-200 cursor-pointer 
                                     font-medium text-sm flex items-center justify-center gap-2 shadow-sm hover:shadow-md'
                        >
                            <MdPrint className="w-4 h-4" />
                            Print Items Report
                        </button>
                        <button
                            onClick={() => setIsDetailsModal(false)}
                            className='flex-1 px-4 py-3 bg-white border border-blue-300 text-blue-700 rounded-lg 
                                     hover:bg-blue-50 transition duration-200 cursor-pointer font-medium text-sm 
                                     flex items-center justify-center gap-2'
                        >
                            <MdClose className="w-4 h-4" />
                            Close
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default DetailsItems;

// import React, { useEffect, useState, useRef } from 'react'
// import { motion } from 'framer-motion'
// import { useSelector } from 'react-redux'
// import { toast } from 'react-toastify'
// import { api } from '../../https'

// const DetailsItems = ({ setIsDetailsModal }) => {
//     const customerData = useSelector((state) => state.customer)
//     const customer = customerData.customerId
    
//     const [customerItems, setCustomerItems] = useState([])
    
//     // State for items pagination, sort and search
//     const [currentPage, setCurrentPage] = useState(1)
//     const [itemsPerPage, setItemsPerPage] = useState(10)
//     const [sortBy, setSortBy] = useState('createdAt')
//     const [sortOrder, setSortOrder] = useState('desc')
//     const [searchTerm, setSearchTerm] = useState('')
//     const [totalPages, setTotalPages] = useState(1)
//     const [totalItems, setTotalItems] = useState(0)

//     // Fetch customer items with pagination, sort and search
//     const fetchcustomerItems = async () => {
//         try {
//             const response = await api.post('/api/invoice/customerItems', {
//                 customer,
//                 page: currentPage,
//                 limit: itemsPerPage,
//                 sortBy: sortBy,
//                 sortOrder: sortOrder,
//                 search: searchTerm
//             })

//             if (response.data.success) {
//                 setCustomerItems(response.data.data)
//                 setTotalPages(response.data.pagination.totalPages)
//                 setTotalItems(response.data.pagination.totalItems)
//             } else {
//                 toast.error(response.data.message)
//             }
//         } catch (error) {
//             console.log(error)
//             toast.error(error.response?.data?.message || error.message)
//         }
//     }

//     // Helper functions for items
//     const handlePageChange = (newPage) => {
//         setCurrentPage(newPage)
//     }

//     const handleSortChange = (field) => {
//         if (sortBy === field) {
//             setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
//         } else {
//             setSortBy(field)
//             setSortOrder('desc')
//         }
//     }

//     const handleSearch = (term) => {
//         setSearchTerm(term)
//         setCurrentPage(1)
//     }

//     const handleItemsPerPageChange = (value) => {
//         setItemsPerPage(value)
//         setCurrentPage(1)
//     }

//     useEffect(() => {
//         fetchcustomerItems()
//     }, [customer, currentPage, itemsPerPage, sortBy, sortOrder, searchTerm])

//     // Printing
//     const invoiceRef = useRef(null)
//     const handlePrint = () => {
//         const printContent = invoiceRef.current.innerHTML
//         const WinPrint = window.open("", "", "width=900, height=650")

//         WinPrint.document.write(` 
//             <html>
//                 <head>
//                     <title>Customer Items Report</title>
//                     <style>
//                         body { font-family: Arial, sans-serif; padding: 20px; }
//                         .receipt-container { width: 100%; border: 1px solid #ddd; padding: 10px;}
//                         h2 { text-align: center; }
//                         table { width: 100%; border-collapse: collapse; margin-top: 10px; }
//                         th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
//                         th { background-color: #f2f2f2; }
//                         .controls { display: none; }
//                     </style>
//                 </head>
//                 <body>
//                     ${printContent}
//                 </body>
//             </html>
//         `)

//         WinPrint.document.close()
//         WinPrint.focus()
//         setTimeout(() => {
//             WinPrint.print()
//             WinPrint.close()
//         }, 1000)
//     }

//     return (
//         <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>

//             <div className='bg-white p-4 rounded-lg shadow-lg w-[90vw] max-w-6xl md:mt-5 mt-5 h-[calc(100vh-2rem)] overflow-y-auto'>
//                 {/* Receipt content for printing */}
//                 <div ref={invoiceRef} className='p-4'>

//                     {/* Receipt Header */}
//                     <div className='flex justify-center mb-4'>
//                         <motion.div
//                             initial={{ scale: 0, opacity: 0 }}
//                             animate={{ scale: 1.0, opacity: 1 }}
//                             transition={{ duration: 0.5, type: "spring", stiffness: 150 }}
//                             className='mt-0 w-12 h-12 border-8 border-[#0ea5e9] rounded-full flex items-center'
//                         >
//                             <motion.span
//                                 initial={{ scale: 0, opacity: 0 }}
//                                 animate={{ scale: 1 }}
//                                 transition={{ delay: 0.3, duration: 0.3 }}
//                                 className='text-2xl'
//                             ></motion.span>
//                         </motion.div>
//                     </div>

//                     <h2 className='text-lg font-bold text-center mb-2 text-[#1a1a1a]'>Customer Items</h2>
//                     <p className={`text-center text-xs font-medium text-[#0ea5e9]`}>Customer: 
//                         <span className='text-sm text-blue-600 font-semibold'>{customerData.customerName}</span></p>

//                     {/* Items Section with Pagination, Sort and Search */}
//                     <div className='mt-5'>
//                         {/* Search and Controls - hidden in print */}
//                         <div className='flex flex-wrap gap-2 mb-4 controls'>
//                             <div className="search-bar">
//                                 <input
//                                     type="text"
//                                     placeholder="Search items..."
//                                     value={searchTerm}
//                                     onChange={(e) => handleSearch(e.target.value)}
//                                     className="border p-1 rounded text-sm"
//                                 />
//                             </div>
                            
//                             <select
//                                 value={sortBy}
//                                 onChange={(e) => handleSortChange(e.target.value)}
//                                 className="border p-1 rounded text-sm"
//                             >
//                                 <option value="createdAt">Date Created</option>
//                                 <option value="name">Item Name</option>
//                                 <option value="price">Price</option>
//                                 <option value="quantity">Quantity</option>
//                             </select>
                            
//                             <select 
//                                 value={itemsPerPage} 
//                                 onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
//                                 className="border p-1 rounded text-sm"
//                             >
//                                 <option value={5}>5 per page</option>
//                                 <option value={10}>10 per page</option>
//                                 <option value={20}>20 per page</option>
//                                 <option value={50}>50 per page</option>
//                             </select>
//                         </div>

//                         {/* Items Table */}
//                         <div className='overflow-x-auto mb-4'>
//                             <table className='w-full text-left text-[#1a1a1a] text-sm'>
//                                 <thead className='bg-[#D2B48C] font-normal'>
//                                     <tr>
//                                         <th className='p-2'>Name</th>
//                                         <th className='p-2'>Price</th>
//                                         <th className='p-2'>Quantity</th>
//                                         <th className='p-2'>Category</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {customerItems.length === 0 ? (
//                                         <tr>
//                                             <td colSpan="4" className='p-2 text-center text-xs text-[#be3e3f]'>
//                                                 No items found!
//                                             </td>
//                                         </tr>
//                                     ) : (
//                                         customerItems.map((item, index) => (
//                                             <tr key={index} className='border-b border-zinc-200'>
//                                                 <td className='p-2'>{item.name}</td>
//                                                 <td className='p-2'>{item.price}</td>
//                                                 <td className='p-2'>{item.quantity}</td>
//                                                 <td className='p-2'>{item.category}</td>
//                                             </tr>
//                                         ))
//                                     )}
//                                 </tbody>
//                             </table>
//                         </div>

//                         {/* Items Pagination - hidden in print */}
//                         <div className="pagination flex justify-between items-center mb-6 controls">
//                             <button
//                                 onClick={() => handlePageChange(currentPage - 1)}
//                                 disabled={currentPage === 1}
//                                 className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 text-sm"
//                             >
//                                 Previous
//                             </button>
                            
//                             <span className="text-sm">Page {currentPage} of {totalPages} | Total Items: {totalItems}</span>
                            
//                             <button
//                                 onClick={() => handlePageChange(currentPage + 1)}
//                                 disabled={currentPage === totalPages}
//                                 className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 text-sm"
//                             >
//                                 Next
//                             </button>
//                         </div>
//                     </div>
//                 </div>

//                 {/** Buttons */}
//                 <div className='flex justify-between mt-4'>
//                     <button
//                         onClick={handlePrint}
//                         className='text-blue-700 font-semibold hover:underline text-xs px-4 py-2 rounded-lg cursor-pointer'
//                     >
//                         Print Items
//                     </button>
//                     <button
//                         onClick={() => setIsDetailsModal(false)}
//                         className='text-orange-600 font-semibold hover:underline text-xs px-4 py-2 rounded-lg cursor-pointer'
//                     >
//                         Close
//                     </button>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default DetailsItems;