import React, { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { api } from '../../https'
import { IoCloseCircle } from "react-icons/io5";
import { FaPrint, FaSearch, FaSort, FaFilter } from "react-icons/fa";
import { MdChevronLeft, MdChevronRight, MdBusiness } from "react-icons/md";

const DetailsModalSupplier = ({ setIsDetailsModal }) => {
    const supplierData = useSelector((state) => state.supplier);
    const supplier = supplierData.supplierId;

    const [supplierInvoices, setSupplierInvoices] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // State for pagination, sort and search
    const [currentPage, setCurrentPage] = useState(1);
    const [invoicesPerPage, setInvoicesPerPage] = useState(10);
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('desc');
    const [searchTerm, setSearchTerm] = useState('');
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
   
    // Fetch Details
    const fetchSupplierDetails = async () => {
        setLoading(true);
        try {
            const res = await api.post('/api/invoice/supplierDetails', {
                supplier,
                page: Number(currentPage),
                limit: Number(invoicesPerPage),
                sortBy: sortBy,
                sortOrder: sortOrder,
                search: searchTerm
            });

            if (res.data.success) {
                setSupplierInvoices(res.data.data);
                setTotalPages(res.data.pagination.totalPages);
                setTotalItems(res.data.pagination.totalItems);
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            console.log('Error details:', error.response?.data);
            toast.error(error.response?.data?.message || 'Error fetching invoices');
        } finally {
            setLoading(false);
        }
    };

    // Helper functions for pagination and sorting
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleSortChange = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('desc');
        }
    };

    const handleSearch = (term) => {
        setSearchTerm(term);
        setCurrentPage(1);
    };

    const handleInvoicesPerPageChange = (value) => {
        setInvoicesPerPage(value);
        setCurrentPage(1);
    };

    useEffect(() => {
        fetchSupplierDetails();
    }, [supplier, currentPage, invoicesPerPage, sortBy, sortOrder, searchTerm]);

    // Printing
    const invoiceRef = useRef(null);
    const handlePrint = () => {
        const printContent = invoiceRef.current.innerHTML;
        const WinPrint = window.open("", "", "width=900, height=650");

        WinPrint.document.write(` 
            <html>
                <head>
                    <title>Supplier Statement</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        .receipt-container { width: 100%; }
                        h2 { text-align: center; }
                        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                        th { background-color: #f2f2f2; }
                        .controls { display: none; }
                        .pagination { display: none; }
                        .button { display: none; }
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
                <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 to-blue-700 p-4 sm:p-5 flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="bg-white/20 p-2 sm:p-2.5 rounded-lg">
                                <MdBusiness className="text-white w-5 h-5 sm:w-6 sm:h-6" />
                            </div>
                            <div>
                                <h2 className='text-lg sm:text-xl font-bold text-white'>Supplier Statement</h2>
                                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-blue-100 text-xs sm:text-sm">
                                    <span className="font-medium">Supplier: {supplierData.supplierName}</span>
                                    <span className="hidden sm:inline">•</span>
                                    <span>Balance: {supplierData.balance} AED</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={handlePrint}
                                className='p-2 text-white hover:bg-white/20 rounded-lg transition duration-200 cursor-pointer'
                                title="Print Statement"
                            >
                                <FaPrint className="w-5 h-5" />
                            </button>
                            <button 
                                onClick={() => setIsDetailsModal(false)}
                                className='p-2 text-white hover:bg-white/20 rounded-lg transition duration-200 cursor-pointer'
                                title="Close"
                            >
                                <IoCloseCircle className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className='flex-1 overflow-hidden flex flex-col p-4 sm:p-5'>
                    {/* Search and Controls - hidden in print */}
                    <div className='flex flex-col sm:flex-row gap-3 mb-4 sm:mb-5 controls flex-shrink-0'>
                        <div className="relative flex-1">
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600">
                                <FaSearch className="w-4 h-4" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search by amount, invoice number, or type..."
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
                                    <FaSort className="w-3.5 h-3.5" />
                                </div>
                                <select
                                    value={sortBy}
                                    onChange={(e) => handleSortChange(e.target.value)}
                                    className="pl-9 pr-4 py-2.5 bg-white border border-blue-200 rounded-lg 
                                             text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 
                                             focus:border-transparent transition duration-200 text-sm appearance-none"
                                >
                                    <option value="createdAt">Date Created</option>
                                    <option value="invoiceNumber">Invoice Number</option>
                                    <option value="invoiceType">Invoice Type</option>
                                    <option value="bills.total">Total Amount</option>
                                </select>
                            </div>
                            
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600">
                                    <FaFilter className="w-3.5 h-3.5" />
                                </div>
                                <select 
                                    value={invoicesPerPage} 
                                    onChange={(e) => handleInvoicesPerPageChange(Number(e.target.value))}
                                    className="pl-9 pr-4 py-2.5 bg-white border border-blue-200 rounded-lg 
                                             text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 
                                             focus:border-transparent transition duration-200 text-sm appearance-none"
                                >
                                    <option value={5}>5 per page</option>
                                    <option value={10}>10 per page</option>
                                    <option value={20}>20 per page</option>
                                    <option value={50}>50 per page</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Content for printing */}
                    <div ref={invoiceRef} className='flex-1 overflow-y-auto bg-white rounded-lg border border-blue-200 p-4 sm:p-5'>
                        {/* Loading State */}
                        {loading ? (
                            <div className="flex items-center justify-center h-full">
                                <div className="text-center">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-3"></div>
                                    <p className="text-gray-600 font-medium">Loading invoices...</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Table */}
                                <div className='overflow-x-auto'>
                                    <table className='w-full text-left text-gray-800 text-sm'>
                                        <thead className='bg-gradient-to-r from-blue-50 to-blue-100'>
                                            <tr>
                                                <th className='p-3 font-semibold text-blue-700 border-b border-blue-200'>Date</th>
                                                <th className='p-3 font-semibold text-blue-700 border-b border-blue-200'>Invoice Type</th>
                                                <th className='p-3 font-semibold text-blue-700 border-b border-blue-200'>Invoice #</th>
                                                <th className='p-3 font-semibold text-blue-700 border-b border-blue-200'>Total</th>
                                                <th className='p-3 font-semibold text-blue-700 border-b border-blue-200'>Tax</th>
                                                <th className='p-3 font-semibold text-blue-700 border-b border-blue-200'>Total with Tax</th>
                                                <th className='p-3 font-semibold text-blue-700 border-b border-blue-200'>Paid</th>
                                                <th className='p-3 font-semibold text-blue-700 border-b border-blue-200'>Balance</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {supplierInvoices.length === 0 ? (
                                                <tr>
                                                    <td colSpan="8" className='p-6 text-center'>
                                                        <div className="py-8 flex flex-col items-center">
                                                            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-3">
                                                                <FaSearch className="w-6 h-6 text-blue-400" />
                                                            </div>
                                                            <p className="text-gray-600 font-medium">No invoices found</p>
                                                            <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : (
                                                supplierInvoices.map((invoice, index) => (
                                                    <tr
                                                        key={index}
                                                        className='hover:bg-blue-50/50 transition-colors duration-150 border-b border-blue-100'
                                                    >
                                                        <td className='p-3 font-medium'>
                                                            <span className="text-gray-700">
                                                                {new Date(invoice.date).toLocaleDateString('en-GB')}
                                                            </span>
                                                        </td>
                                                        <td className='p-3'>
                                                            <span className={`px-2 py-1 rounded text-xs font-medium
                                                                ${invoice.invoiceType === 'Sale' ? 'bg-green-100 text-green-800' :
                                                                  invoice.invoiceType === 'Purchase' ? 'bg-blue-100 text-blue-800' :
                                                                  'bg-yellow-100 text-yellow-800'}`}>
                                                                {invoice.invoiceType}
                                                            </span>
                                                        </td>
                                                        <td className='p-3 font-medium text-blue-700'>
                                                            {invoice.invoiceNumber}
                                                        </td>
                                                        <td className='p-3 font-medium'>
                                                            {invoice.bills.total.toFixed(2)}
                                                        </td>
                                                        <td className='p-3 text-gray-600'>
                                                            {invoice.bills.tax.toFixed(2)}
                                                        </td>
                                                        <td className='p-3 font-semibold text-blue-700'>
                                                            {invoice.bills.totalWithTax.toFixed(2)}
                                                        </td>
                                                        <td className='p-3'>
                                                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                                                                {invoice.bills.payed.toFixed(2)}
                                                            </span>
                                                        </td>
                                                        <td className='p-3'>
                                                            <span className={`px-2 py-1 rounded text-xs font-medium
                                                                ${invoice.bills.balance > 0 ? 'bg-red-100 text-red-800' :
                                                                  invoice.bills.balance < 0 ? 'bg-green-100 text-green-800' :
                                                                  'bg-gray-100 text-gray-800'}`}>
                                                                {invoice.bills.balance.toFixed(2)}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>

                                        <tfoot> 
                                            <tr className="bg-gradient-to-r from-blue-50 to-blue-100 border-t border-blue-200">
                                                <td className="p-3 font-semibold text-blue-700" colSpan={3}>Total</td>
                                                <td className="p-3 font-semibold text-blue-700">
                                                    {supplierInvoices.reduce((acc, invoice) => acc + invoice.bills.total, 0).toFixed(2)}
                                                </td>
                                                <td className="p-3 font-semibold text-blue-700">
                                                    {supplierInvoices.reduce((acc, invoice) => acc + invoice.bills.tax, 0).toFixed(2)}
                                                </td>
                                                <td className="p-3 font-semibold text-blue-700">
                                                    {supplierInvoices.reduce((acc, invoice) => acc + invoice.bills.totalWithTax, 0).toFixed(2)}
                                                </td>
                                                <td className="p-3 font-semibold text-green-700">
                                                    {supplierInvoices.reduce((acc, invoice) => acc + invoice.bills.payed, 0).toFixed(2)}
                                                </td>
                                                <td className="p-3 font-semibold text-blue-700">
                                                    {supplierInvoices.reduce((acc, invoice) => acc + invoice.bills.balance, 0).toFixed(2)}
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>

                                {/* Pagination - hidden in print */}
                                <div className="controls">
                                    <div className="flex flex-col sm:flex-row items-center justify-between mt-5 pt-5 border-t border-blue-200">
                                        <div className="text-sm text-gray-600 mb-3 sm:mb-0">
                                            Showing {(currentPage - 1) * invoicesPerPage + 1} to {Math.min(currentPage * invoicesPerPage, totalItems)} of {totalItems} invoices
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
                            </>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className='border-t border-blue-200 bg-blue-50 p-4 sm:p-5 flex-shrink-0'>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={handlePrint}
                            className='flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg 
                                     hover:from-blue-600 hover:to-blue-700 transition duration-200 cursor-pointer 
                                     font-medium text-sm flex items-center justify-center gap-2 shadow-sm hover:shadow-md'
                        >
                            <FaPrint className="w-4 h-4" />
                            Print Statement
                        </button>
                        <button
                            onClick={() => setIsDetailsModal(false)}
                            className='flex-1 px-4 py-3 bg-white border border-blue-300 text-blue-700 rounded-lg 
                                     hover:bg-blue-50 transition duration-200 cursor-pointer font-medium text-sm 
                                     flex items-center justify-center gap-2'
                        >
                            <IoCloseCircle className="w-4 h-4" />
                            Close
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default DetailsModalSupplier;

// import React, { useEffect, useState, useRef } from 'react'
// import { motion } from 'framer-motion'
// import { useSelector } from 'react-redux'
// import { toast } from 'react-toastify'
// import { api } from '../../https'
// import { IoCloseCircle } from "react-icons/io5";
// import { FaPrint } from "react-icons/fa";


// const DetailsModalSupplier = ({setIsDetailsModal}) => {
//     const supplierData = useSelector((state) => state.supplier);
//     const supplier = supplierData.supplierId ;

//     //console.log(supplier)

//     const [supplierInvoices, setSupplierInvoices] = useState([]);
//     const [loading, setLoading] = useState(false);
//     // State for pagination, sort and search
//     const [currentPage, setCurrentPage] = useState(1)
//     const [invoicesPerPage, setInvoicesPerPage] = useState(10)
//     const [sortBy, setSortBy] = useState('createdAt')
//     const [sortOrder, setSortOrder] = useState('desc')
//     const [searchTerm, setSearchTerm] = useState('')
//     const [totalPages, setTotalPages] = useState(1)
//     const [totalItems, setTotalItems] = useState(0)
   
    
//     // fetch Details
//     const fetchSupplierDetails = async() => {
//         setLoading(true)
//         try {
            
//             //const res = await axios.post(backendUrl + '/api/invoice/supplierDetails' ,
//             const res = await api.post('/api/invoice/supplierDetails' , 

//             {
//                 supplier,
//                 page: Number(currentPage),        // Convert to number
//                 limit: Number(invoicesPerPage),   // Convert to number
//                 sortBy: sortBy,
//                 sortOrder: sortOrder,
//                 search: searchTerm
//             }
//         );

//             if (res.data.success) {
//                 setSupplierInvoices(res.data.data)
//                 setTotalPages(res.data.pagination.totalPages)
//                 setTotalItems(res.data.pagination.totalItems)
//             } else {
//                 toast.error(res.data.message)
//             }
         

//         } catch (error) {
//             console.log('Error details:', error.res?.data)
//             toast.error(error.res?.data?.message || 'Error fetching invoices')
//         } finally {
//             setLoading(false)
//         }
//         };

//     // Helper functions for pagination and sorting
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
//         setCurrentPage(1) // Reset to first page when searching
//     }

//     const handleInvoicesPerPageChange = (value) => {
//         setInvoicesPerPage(value)
//         setCurrentPage(1) // Reset to first page when changing items per page
//     }

//     useEffect(() => {
//         fetchSupplierDetails()
//     }, [supplier, currentPage, invoicesPerPage, sortBy, sortOrder, searchTerm])

        

//     // Printing
//     const invoiceRef = useRef(null);
//     const handlePrint = () => {
//         const printContent = invoiceRef.current.innerHTML;
//         const WinPrint = window.open("", "", "width=900, height=650");

//         WinPrint.document.write(` 
//             <html>
//                 <head>
//                     <title>Supplier Statement</title>
//                     <style>
//                         body { font-family: Arial, sans-serif; padding: 20px; }
//                         .receipt-container { width: 100%; }
//                         h2 { text-align: center; }
//                         table { width: 100%; border-collapse: collapse; margin-top: 10px; }
//                         th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
//                         th { background-color: #f2f2f2; }

//                         .controls { display: none; }
//                         .pagination { display: none; }
//                         .button { display: none; }
//                     </style>
//                 </head>
//                 <body>
//                     ${printContent}
//                 </body>
//             </html>
//             `);

//         WinPrint.document.close();
//         WinPrint.focus();
//         setTimeout(() => {
//             WinPrint.print();
//             WinPrint.close();
//         }, 1000);
//     }



//     return (
//        //rgba(0,0,0,0.4)
//         <div className="fixed inset-0 flex items-center justify-center z-50" 
//         style={{ backgroundColor: 'rgba(20, 10, 10, 0.4)'}}  >

//             <div className='bg-white p-2 rounded-sm shadow-lg/30 w-[50vw] max-w-6xl md:mt-1 mt-1 h-[calc(100vh)] 
//             overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 scrollbar-hidden'>
//                 {/* Receipt content for printing */}
//                 <div ref={invoiceRef} className=''>

//                     <div className ='flex flex-col shadow-xl bg-white'>
//                         <div className='flex justify-between items-center p-2'>
//                             <h2 className='text-md font-bold text-center mb-2 text-[#1a1a1a]'>Supplier Statement</h2>

//                             <div className='button flex justify-end items-center cursor-pointer gap-3'>
//                                 <button onClick={handlePrint} className='rounded-full text-[#0ea5e9] hover:bg-[#0ea5e9]/30 
//                                         cursor-pointer rounded-xs'>
//                                     <FaPrint size={22} />
//                                 </button>
//                                 <button onClick={() => setIsDetailsModal(false)} className='rounded-full text-[#be3e3f] hover:bg-[#be3e3f]/30 
//                                         cursor-pointer rounded-xs  border-b border-[#be3e3f]'>
//                                     <IoCloseCircle size={22} />
//                                 </button>

//                             </div>
//                         </div>

//                         <div className='flex items-center justify-between p-1'>
//                             <p className={`text-center text-xs font-normal text-[#0ea5e9]`}>
//                                 Supplier Name : <span className='text-xs text-[#1a1a1a] font-semibold'>
//                                     {supplierData.supplierName}</span>
//                             </p>
//                             <p className='text-xs font-normal text-[#0ea5e9]'>Currently Balance :
//                                 <span className='text-xs  text-[#1a1a1a] font-semibold'> {supplierData.balance}</span>
//                                 <span className='text-xs text-[#0ea5e9] font-normal'> AED</span>
//                             </p>

//                         </div>

//                     </div>

//                     {/* Search and Controls - hidden in print */}
//                     <div className='flex justify-center flex-wrap gap-2 mb-4 mt-5 controls'>
//                         <div className="search-bar">
//                             <input
//                                 type="text"
//                                 placeholder="Search by amount..."
//                                 value={searchTerm}
//                                 onChange={(e) => handleSearch(e.target.value)}
//                                 className="border border-[#d2b48c] p-1 rounded-sm text-xs"
//                             />
//                         </div>

//                         <select
//                             value={sortBy}
//                             onChange={(e) => handleSortChange(e.target.value)}
//                             className="border p-1 border-[#d2b48c] rounded-sm text-xs"
//                         >
//                             <option value="createdAt">Date Created</option>
//                             <option value="invoiceNumber">Invoice Number</option>
//                             <option value="invoiceType">Invoice Type</option>
//                             <option value="bills.total">Total Amount</option>
//                         </select>

//                         <select
//                             value={invoicesPerPage}
//                             onChange={(e) => handleInvoicesPerPageChange(Number(e.target.value))}
//                             className="border border-[#d2b48c] p-1 rounded text-xs"
//                         >
//                             <option value={5}>5 per page</option>
//                             <option value={10}>10 per page</option>
//                             <option value={20}>20 per page</option>
//                             <option value={50}>50 per page</option>
//                         </select>
//                     </div>




//                    <div className='mt-2 overflow-x-auto'>
//                         <div className='overflow-x-auto px-5'>
//                             <table className='w-full text-left text-[#1a1a1a] h-[calc(100vh-30rem)]'>
//                                 <thead className='bg-white border-b-2 border-yellow-700 text-[#1a1a1a] text-xs font-normal'>
//                                     <tr>
//                                         <th className='p-2'>Date</th>
//                                         <th className='p-2'>Invoice Type</th>
//                                         <th className='p-2'>Invoice Number</th>
//                                         <th className='p-2'>Total</th>
//                                         <th className='p-2'>Tax</th>
//                                         <th className='p-2'>Total with tax</th>
//                                         <th className='p-2'>Payed</th>
//                                          <th className='p-2'>Balance</th>
//                                     </tr>
//                                 </thead>

//                                 <tbody>

//                                     {loading ? (
//                                         <tr>
//                                             <td colSpan="7" className='p-2 text-center'>
//                                                 Loading invoices...
//                                             </td>
//                                         </tr>
//                                     ) : supplierInvoices.length === 0 ? (
//                                         <tr>
//                                             <td colSpan="8" className='p-2 text-center text-xs text-[#be3e3f]'>
//                                                 No invoices found!
//                                             </td>
//                                         </tr>
//                                     ) : ( supplierInvoices.map((supplier, index) => (
//                                             <tr
//                                                 key={index}
//                                                 className='border-b-3 border-[#f5f5f5] text-xs font-normal text-[#1a1a1a] 
//                                                     hover:bg-[#F1E8D9] cursor-pointer'
//                                             >
//                                                 <td className='p-2 font-semibold bg-zinc-100'>{new Date(supplier.date).toLocaleDateString('en-GB')}</td>
//                                                 <td className='p-2 font-semibold bg-zinc-100'>{supplier.invoiceType}</td>
//                                                 <td className='p-2'>{supplier.invoiceNumber}</td>
//                                                 <td className='p-2'>{supplier.bills.total.toFixed(2)}</td>
//                                                 <td className='p-2'>{supplier.bills.tax.toFixed(2)}</td>
//                                                 <td className='p-2'>{supplier.bills.totalWithTax.toFixed(2)}</td>
//                                                 <td className='p-2'>{supplier.bills.payed.toFixed(2)}</td>
//                                                 <td className='p-2'>{supplier.bills.balance.toFixed(2)}</td>
//                                             </tr>
//                                             ))
//                                     )}
//                                 </tbody>

//                                 <tfoot>
//                                     <tr className="bg-[#F1E8D9] border-t-2 border-yellow-700 text-yellow-700 text-xs font-semibold">
//                                         <td className="p-2" colSpan={3}>Total</td>
//                                         <td className="p-2">{supplierInvoices.reduce((acc, invoice) => acc + invoice.bills.total, 0).toFixed(2)}</td>
//                                         <td className="p-2">{supplierInvoices.reduce((acc, invoice) => acc + invoice.bills.tax, 0).toFixed(2)}</td>
//                                         <td className="p-2">{supplierInvoices.reduce((acc, invoice) => acc + invoice.bills.totalWithTax, 0).toFixed(2)}</td>
//                                         <td className="p-2">{supplierInvoices.reduce((acc, invoice) => acc + invoice.bills.payed, 0).toFixed(2)}</td>
//                                         <td className="p-2">{supplierInvoices.reduce((acc, invoice) => acc + invoice.bills.balance, 0).toFixed(2)}</td>
//                                     </tr>
//                                 </tfoot>
//                             </table>
//                         </div>

//                     </div>

//                     {/* Pagination - hidden in print */}
//                     <div className="pagination flex justify-between items-center mt-4 controls">
//                         <button
//                             onClick={() => handlePageChange(currentPage - 1)}
//                             disabled={currentPage === 1 || loading}
//                             className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 text-sm"
//                         >
//                             Previous
//                         </button>

//                         <span className="text-sm">
//                             Page {currentPage} of {totalPages} | Total Invoices: {totalItems}
//                         </span>

//                         <button
//                             onClick={() => handlePageChange(currentPage + 1)}
//                             disabled={currentPage === totalPages || loading}
//                             className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 text-sm"
//                         >
//                             Next
//                         </button>
//                     </div>

//                 </div>
              
//             </div>
//         </div>
//     );
// }

// export default DetailsModalSupplier ;