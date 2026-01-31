import React, { useRef } from 'react'
import { motion } from 'framer-motion'
import { FaPrint, FaTimes, FaReceipt, FaUser, FaMoneyBillWave, FaSignature, FaBuilding } from "react-icons/fa";
import { MdPayment, MdAttachMoney } from "react-icons/md";

const PaymentInvoice = ({paymentInfo, setPaymentInvoice, fetchSuppliers}) => {
    const invoiceRef = useRef(null);

    const handlePrint = () => {
        const printContent = invoiceRef.current.innerHTML;
        const WinPrint = window.open("", "", "width=900, height=650");

        WinPrint.document.write(` 
            <html>
                <head>
                    <title>Payment Receipt - Supplier</title>
                    <style>
                        body { font-family: 'Arial', sans-serif; padding: 20px; background: #fff; }
                        .receipt-container { max-width: 500px; margin: 0 auto; border: 2px solid #1e40af; border-radius: 12px; padding: 20px; }
                        h2 { text-align: center; color: #1e40af; margin-bottom: 10px; }
                        .header { text-align: center; margin-bottom: 20px; }
                        .details { margin: 20px 0; }
                        .detail-row { display: flex; justify-content: space-between; margin: 8px 0; }
                        .detail-label { font-weight: 600; color: #374151; }
                        .detail-value { color: #111827; font-weight: 500; }
                        .amount { color: #059669; font-weight: 600; }
                        .footer { margin-top: 30px; padding-top: 20px; border-top: 2px dashed #d1d5db; }
                        .signature { margin-top: 40px; }
                        .signature-line { width: 200px; border-bottom: 1px solid #374151; margin: 5px 0; }
                        .no-print { display: none; }
                        .print-only { display: block; }
                        @media print {
                            .no-print { display: none !important; }
                            body { padding: 0; }
                        }
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
            fetchSuppliers();
        }, 1000);
    };

    const handleClose = () => {
        setPaymentInvoice(false);
        fetchSuppliers();
    };

    const currentDate = new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
    
    const currentTime = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });

    return (
        <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className='bg-gradient-to-b from-white to-blue-50 rounded-xl shadow-2xl border border-blue-200 
                          w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col'
            >
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 sm:p-5 flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-2 rounded-lg">
                                <FaBuilding className="text-white w-5 h-5" />
                            </div>
                            <div>
                                <h2 className='text-lg sm:text-xl font-bold text-white'>Supplier Payment Receipt</h2>
                                <p className='text-blue-100 text-xs sm:text-sm'>Transaction completed successfully</p>
                            </div>
                        </div>
                        <button 
                            onClick={handleClose}
                            className='p-2 text-white hover:bg-white/20 rounded-lg transition duration-200 cursor-pointer'
                        >
                            <FaTimes className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Receipt Content */}
                <div className='flex-1 overflow-y-auto p-4 sm:p-5'>
                    <div ref={invoiceRef} className='bg-white rounded-xl border border-blue-200 p-4 sm:p-5 
                                                   shadow-sm print:shadow-none'>
                        {/* Receipt Header */}
                        <div className='text-center mb-6'>
                            <div className='flex justify-center mb-3'>
                                <div className='w-16 h-16 border-4 border-blue-500 rounded-full flex items-center justify-center'>
                                    <MdAttachMoney className="text-blue-600 w-8 h-8" />
                                </div>
                            </div>
                            <h2 className='text-xl sm:text-2xl font-bold text-blue-700 mb-1'>SUPPLIER PAYMENT RECEIPT</h2>
                            <p className='text-blue-600 text-sm font-medium'>Transaction #{paymentInfo.invoiceNumber}</p>
                            <div className="h-px w-full bg-gradient-to-r from-transparent via-blue-300 to-transparent my-3"></div>
                        </div>

                        {/* Transaction Details */}
                        <div className='space-y-4 mb-6'>
                            <div className="bg-blue-50 rounded-lg p-3 sm:p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <FaBuilding className="text-blue-600 w-4 h-4" />
                                    <h3 className='font-semibold text-blue-700'>Supplier Details</h3>
                                </div>
                                <div className="space-y-1 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Supplier Name:</span>
                                        <span className="font-medium text-gray-800">{paymentInfo.supplierName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Receipt Date:</span>
                                        <span className="font-medium text-gray-800">{currentDate}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Time:</span>
                                        <span className="font-medium text-gray-800">{currentTime}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-green-50 rounded-lg p-3 sm:p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <FaMoneyBillWave className="text-green-600 w-4 h-4" />
                                    <h3 className='font-semibold text-green-700'>Payment Summary</h3>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Paid Amount:</span>
                                        <div className="flex items-center gap-1">
                                            <span className="text-lg font-bold text-green-700">
                                                {paymentInfo.bills.payed.toFixed(2)}
                                            </span>
                                            <span className="text-gray-500 text-sm">AED</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center pt-2 border-t border-green-200">
                                        <span className="text-gray-600">Payment Method:</span>
                                        <div className="flex items-center gap-2">
                                            <MdPayment className="text-blue-600 w-4 h-4" />
                                            <span className={`px-2 py-1 rounded text-xs font-medium
                                                ${paymentInfo.paymentMethod === 'Cash' 
                                                    ? 'bg-blue-100 text-blue-800' 
                                                    : 'bg-purple-100 text-purple-800'}`}>
                                                {paymentInfo.paymentMethod}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Status */}
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 sm:p-4 border border-green-200">
                                <div className="text-center">
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full">
                                        <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
                                        <span className="font-semibold text-sm">Payment Successful</span>
                                    </div>
                                    <p className="text-gray-600 text-xs mt-2">
                                        This supplier transaction has been processed and recorded
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Signature Section */}
                        <div className="border-t border-blue-200 pt-4 mt-6">
                            <div className="flex flex-col sm:flex-row justify-between gap-4">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <FaSignature className="text-blue-600 w-4 h-4" />
                                        <span className="text-sm font-semibold text-gray-700">Supplier Signature</span>
                                    </div>
                                    <div className="signature-line w-32 h-px bg-gray-400"></div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <FaSignature className="text-blue-600 w-4 h-4" />
                                        <span className="text-sm font-semibold text-gray-700">Authorized Signature</span>
                                    </div>
                                    <div className="signature-line w-32 h-px bg-gray-400"></div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Note */}
                        <div className="mt-6 pt-4 border-t border-blue-200 text-center">
                            <p className="text-xs text-gray-500">
                                This is an official receipt for supplier payment records.<br />
                                Please retain this receipt for your reference.
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                                Receipt ID: {paymentInfo.invoiceNumber} | Generated: {currentDate}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="border-t border-blue-200 bg-blue-50 p-4 sm:p-5 flex-shrink-0">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={handlePrint}
                            className='flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg 
                                     hover:from-blue-600 hover:to-blue-700 transition duration-200 cursor-pointer 
                                     font-medium text-sm flex items-center justify-center gap-2 shadow-sm hover:shadow-md'
                        >
                            <FaPrint className="w-4 h-4" />
                            Print Receipt
                        </button>
                        <button
                            onClick={handleClose}
                            className='flex-1 px-4 py-3 bg-white border border-blue-300 text-blue-700 rounded-lg 
                                     hover:bg-blue-50 transition duration-200 cursor-pointer font-medium text-sm 
                                     flex items-center justify-center gap-2'
                        >
                            <FaTimes className="w-4 h-4" />
                            Close
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default PaymentInvoice;

// import React, { useRef } from 'react'
// import { motion } from 'framer-motion'

// const PaymentInvoice = ({paymentInfo ,setPaymentInvoice, fetchSuppliers}) => {
//     const invoiceRef = useRef(null);

//     const handlePrint = () => {
//         const printContent = invoiceRef.current.innerHTML;
//         const WinPrint = window.open("", "", "width=900, height=650");

//         WinPrint.document.write(` 
//                 <html>
//                     <head>
//                         <title>Order Receipt</title>
//                         <style>
//                             body { fonst-family: Arial, sans-serif; padding: 20px; }
//                             .receip-container { width: 300px; border: 1px solid #ddd; padding: 10px;}
    
//                             h2 {text-align: center;}
//                         </style>
//                     </head>
//                     <body>
//                     ${printContent}
//                     </body>
//                 </html>
//                 `);
//         WinPrint.document.close();
//         WinPrint.focus();
//         setTimeout(() => {
//             WinPrint.print();
//             WinPrint.close();
//             fetchSuppliers();
//         }, 1000);
//     }


//     const handleClose = () => {
//         setPaymentInvoice(false)
//         fetchSuppliers()
//     }


//     return (

//         <div className='fixed inset-0 bg-opacity-50 flex justify-center items-center'>
//             <div className='bg-zinc-100 h-[calc(100vh-5rem)] p-4 rounded-lg shadow-lg  w-[400px]'>
//                 {/* Receipt content for printing */}
//                 <div ref={invoiceRef} className='p-4'>

//                     {/*Receipt Header*/}
//                     <div className='flex justify-center nb-4'>
//                         <motion.div
//                             initial={{ scale: 0, opacity: 0 }}
//                             animate={{ scale: 1.0, opacity: 1 }}
//                             transition={{ duration: 0.5, type: "spring", stiffness: 150 }}
//                             className='mt-0 w-12 h-12 border-8 border-blue-500 rounded-full flex items-center'
//                         >
//                             <motion.span
//                                 initial={{ scale: 0, opacity: 0 }}
//                                 animate={{ scale: 1 }}
//                                 transition={{ delay: 0.3, duration: 0.3 }}
//                                 className='text-2xl'
//                             >

//                             </motion.span>
//                         </motion.div>

//                     </div>

//                     <h2 className='text-xl font-bold text-center mb-2'>Payment Receipt</h2>
//                     <p className={`text-center text-gray-600`}>Thank you for your payment</p>

//                     {/*Order Details*/}
//                     <div className='mt-4 border-t pt-4  text-sm text-gray-700'>
//                         <p className ='mb-2'>
//                             <strong>Payment Number : </strong>
//                             {paymentInfo.invoiceNumber}
//                         </p>
//                         <p>
//                             <strong>Supplier : </strong> {paymentInfo.supplierName}
//                         </p>
                   
//                     </div>

            


//                     {/*Bills Summery */}
//                     <div className={`mt-4 border-t pt-4 text-sm`}>
//                         <p className='flex mt-1'>
//                             <span className='text-sm font-semibold'>Payed Amount : </span><span className='text-xs mx-1'>UAE</span><span className='text-xs font-semibold'>{paymentInfo.bills.payed.toFixed(2)}</span>
//                         </p>
//                         <p className ='mt-5'>
//                             <span className='text-sm font-semibold'>Sig : </span><span className='text-xs font-semibold'>-----------------------------</span>
//                         </p>
//                         <p className='mt-5'>
//                             <strong className='text-xs'>Receipt Sig : </strong><span className='text-xs font-semibold'>--------------------</span>
//                         </p>
//                     </div>

//                     {/**payment Details */}
//                     <div className={`mb-2 mt-2 border-t pt-4 text-xs`}>
//                         {paymentInfo.paymentMethod === 'Cash' ? (
//                             <p>
//                                 <strong>payment method : </strong>{" "}
//                                 {paymentInfo.paymentMethod}
//                             </p>
//                         ) : (
//                             <>
//                                 {/*Online payment */}
//                             </>
//                         )}

//                     </div>


//                 </div>

//                 {/** Buttons */}
//                 <div className='flex justify-between mt-4'>
//                     <button
//                         onClick={handlePrint}
//                         className='text-[#0ea5e9] font-semibold hover underline text-xs px-4 py-2 rounded-lg cursor-pointer'
//                     >
//                         Print Receipt
//                     </button>
//                     <button
//                         onClick={handleClose}
//                         className='text-[#be3e3f] font-semibold hover: underline text-xs px-4 py-2 rounded-lg cursor-pointer'
//                     >
//                         Close
//                     </button>

//                 </div>
//             </div>
//         </div>

//     );
// }



// export default PaymentInvoice ;