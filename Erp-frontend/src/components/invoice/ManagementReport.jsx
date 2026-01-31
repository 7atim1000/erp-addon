import React, {useEffect, useState, useRef} from 'react'
import { motion } from 'framer-motion';

const ManagementReport = ({setManagementReport, id, date, type, length, customer, supplier, payment, total, tax, totalWithTax, payed, balance, status, items}) => {

    const handleClose = () => {
        setManagementReport(false);
    };

    const invoiceRef = useRef(null);

    const handlePrint = () => {
        const printContent = invoiceRef.current.innerHTML;
        const WinPrint = window.open("", "", "width=900, height=650");
        
        WinPrint.document.write(` 
            <html>
                <head>
                    <title>Order Receipt</title>
                    <style>
                        body { fonst-family: Arial, sans-serif; padding: 20px; }
                        .receip-container { width: 300px; border: 1px solid #ddd; padding: 10px;}

                        h2 {text-align: center;}
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
    }


    return (
        <>
        <div className ='fixed inset-0 bg-opacity-50 flex justify-center items-center'>
            <div className = 'bg-zinc-100 p-4 rounded-lg shadow-lg  w-[400px]'>
                {/* Receipt content for printing */}
                    <div ref ={invoiceRef} className ='p-4'>
                                    
                    {/*Receipt Header*/}
                        <div className ='flex justify-center nb-4'>
                            <motion.div
                                initial ={{ scale: 0, opacity: 0 }}
                                animate ={{ scale: 1.0, opacity: 1 }}
                                transition ={{ duration: 0.5, type: "spring", stiffness: 150 }}
                                className ='mt-0 w-12 h-12 border-8 border-blue-500 rounded-full flex items-center'
                            >
                            <motion.span
                                initial ={{ scale: 0, opacity: 0 }}
                                animate ={{ scale: 1 }}
                                transition ={{ delay: 0.3, duration: 0.3 }}
                                className ='text-2xl'    
                            >
                
                            </motion.span>
                            </motion.div>
                
                        </div>
                
                        <h2 className ='text-xl font-bold text-center mb-2'>Invoices Management Report</h2>
                        <p className ={`text-center text-gray-600`}>Thank you for your report</p>
                                    
                        
                        
                        {/*Invoice Details*/}

                         <tr className ='border-b border-zinc-200'>
                                    <td className ='p-2 text-xs font-normal  hidden'>{id}</td>
                                    <td className ='p-2 text-xs font-normal '>{date}</td>
                                    <td className ='p-2 text-xs font-normal '>{type}</td>
                                    <td className ='p-2 text-xs font-normal '>{length} Items</td>
                                    <td className ='p-2 text-xs font-normal '>{customer}</td> 
                                    <td className ='p-2 text-xs font-normal '>{supplier}</td> 
                                    <td className ='p-2 text-xs font-normal '>{payment}</td>
                                    <td className ='p-2 text-xs font-normal '>{total.toFixed(2)}</td>
                                    <td className ='p-2 text-xs font-normal '>{tax.toFixed(2)}</td>
                                    <td className ='p-2 text-xs font-normal text-blue-600 font-semibold'>{totalWithTax.toFixed(2)}</td>
                                    <td className ='p-2 text-xs font-normal v'>{payed}</td>
                                    <td className ={`${balance === '0' ? 'text-green-600' : 'text-red-600'} p-2 text-xs font-semibold border-b border-zinc-100`}>{balance}</td>
                           
                                </tr>



                
                        {/*Items Summary*/}
                        <div className ='mt-4 border-t pt-4'>
                            <h3 className ='text-sm font-semibold'>Items Ordered</h3>
                                {/* <ul className ='text-sm text-gray-700'>
                                    {allInvoices.items.map((item, index) => (
                                        <li 
                                            key= {index}
                                            className ='flex justify-between items-center text-xs'
                                        >
                                        
                                            <span>
                                                {item.name} - {item.quantity}
                                            </span>
                                            <span>
                                                UAE {item.price.toFixed(2)}
                                            </span>
                                        
                                        </li>
                                        ))}  
                                </ul> */}
                        </div>
                 
                
                        {/*Bills Summery */}
                        <div className ={`mt-4 border-t pt-4 text-sm`}>
                            {/* <p className ='flex gap-1'>
                                <span className ='text-sm font-semibold'>SubTotal : </span><span className ='text-xs'>UAE </span><span className ='text-xs font-semibold'>{allInvoices.bills.total.toFixed(2)}</span>  
                            </p>
                            <p>
                                <span className ='text-sm font-semibold'>Tax : </span><span className ='text-xs'>UAE </span><span className ='text-xs font-semibold'>{allInvoices.bills.tax.toFixed(2)}</span>
                            </p>
                            <p className ='mt-2'>
                                <strong className ='text-xs'>Grand Total: </strong> <span className ='text-xs'>UAE </span><span className ='text-xs font-semibold'>{allInvoices.bills.totalWithTax.toFixed(2)}</span>
                            </p> */}
                        </div>
                
                        {/*payment Details */}
                       
                    </div>

                {/** Buttons */}
                <div className ='flex justify-between mt-4'>
                    <button
                        onClick={handlePrint}
                        className ='text-blue-700 font-semibold hover underline text-xs px-4 py-2 rounded-lg cursor-pointer'
                    >  
                        Print Receipt
                    </button>
                    <button
                        onClick={() => handleClose}
                        className ='text-red-600 font-semibold hover: underline text-xs px-4 py-2 rounded-lg cursor-pointer'
                    >
                        Close
                    </button>

                </div>


            </div>

        </div>
        </>
    );
};



export default ManagementReport;