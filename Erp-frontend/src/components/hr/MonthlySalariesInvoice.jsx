import React, { useRef } from 'react';
import { motion } from 'framer-motion';

const MonthlySalariesInvoice = ({ salaryInfo, setShowInvoice }) => {

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
                        .receip-container { width: 500px; border: 1px solid #ddd; padding: 10px;}

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
        <div className='fixed inset-0 bg-opacity-50 flex justify-center items-center ' style={{ backgroundColor: 'rgba(20, 10, 10, 0.4)' }}>
            <div className='bg-white p-4 rounded-lg shadow-lg  w-[500px] h-[calc(100vh)] overflow-scroll scrollbar-hidden'>

                {/* Receipt content for printing */}
                <div ref={invoiceRef} className='p-2'>

                    {/*Receipt Header*/}
                    <div className='flex justify-center nb-4'>
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1.0, opacity: 1 }}
                            transition={{ duration: 0.5, type: "spring", stiffness: 150 }}
                            className='mt-0 w-10 h-10 border-4 border-[#0ea5e9] rounded-full flex items-center '
                        >
                            <motion.span
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.3, duration: 0.3 }}
                                className='text-xl'
                            >

                            </motion.span>
                        </motion.div>

                    </div>

                    <h2 className='text-md font-semibold text-center mb-2'>Monthly salaries</h2>
                    <p className={`text-center text-sm font-semibold text-gray-600`}>
                        <span className ='text-xs font-semibold'>FOR MONTH :</span> {salaryInfo.month}</p>

                    {/*Salary Details*/}
                    <div className ='mt-4 border-t pt-4 text-sm text-gray-700 '>
                        <h3 className='text-xs font-semibold mb-2'>Salaries Details : </h3>

                        <ul className='text-sm p-2 text-gray-700'>
                            {salaryInfo.details.map((item, index) => (
                                <li
                                    key={index}
                                    className='flex justify-between items-center text-xs border-b border-gray-200 p-2'
                                >
                                    <span>{item.department}</span>
                                    <span>{item.empName}</span>
                                    <span>{item.monthlySalary.toFixed(2)}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <p className ='mt-5'>
                        <span className ='text-gray-600 text-xs font-normal'>Total of salaries : </span>
                        <span className ='text-[#1a1a1a] text-sm font-normal'>{salaryInfo.bills.total.toFixed(2)}</span>
                        <span className ='text-gray-600 text-xs font-normal'> AED</span>
                    </p>


                </div>


                {/** Buttons */}
                <div className='flex justify-between mt-2 border border-gray-400 rounded-sm'>

                    <button
                        onClick={handlePrint}
                        className='text-[#0ea5e9] font-semibold hover underline text-xs px-4 py-2 rounded-lg cursor-pointer'
                    >
                        Print Receipt
                    </button>
                    <button
                        onClick={() => setShowInvoice(false)}
                        className='text-[#be3e3f] font-semibold hover: underline text-xs px-4 py-2 rounded-lg cursor-pointer'
                    >
                        Close
                    </button>

                </div>


            </div>
        </div>

    );
};




export default MonthlySalariesInvoice