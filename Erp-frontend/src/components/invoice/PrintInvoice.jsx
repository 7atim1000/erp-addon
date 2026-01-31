import React, {useEffect, useState, useRef} from 'react'
import { motion } from 'framer-motion'
import { useSelector } from 'react-redux';


import { toast } from 'react-toastify'

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { api, getInvoices } from '../../https';

const PrintInvoice = ({setShowInvoice}) => {
    // Fetching data
    const invoiceData = useSelector(state => state.invoice);

    const [list, setList] = useState([]);
    const [allTransaction, setAllTransaction] = useState([]);

    const invoiceId = invoiceData.invoiceId;

    // fetch item Array
    const fetchinvoiceItems = async() => {
            
        try {
            
            const res = await api.post('/api/invoice/cartOne' , 

            {
                invoiceId
            }   
            );
                
            setList(res.data)
            //setList(res.data.cart)
            //console.log(res.data)
             
            } catch (error) {
                console.log(error)
                toast.error(error.message)
            }
        }
            
    
    // fetch Details
    // fetch item Array
    const fetchinvoiceById = async() => {
            
        try {
            
            const res = await api.post('/api/invoice/cartDetails' , 

            {
                invoiceId
            }   
            );
    
            setAllTransaction(res.data)
            console.log(res.data)
         
                   
            } catch (error) {
            console.log(error)
            message.error('Fetch Issue with transaction')
            }
        }

        
    useEffect(()=>{
        fetchinvoiceById()
    },[invoiceId])
     


     // fetch Orders
    // const {data: resData, isError} = useQuery({
    //     queryKey: ['invoices'],
    //     queryFn: async () => {
    //         return await getInvoicesById(invoiceId);
    //     },
                
    //     placeholderData: keepPreviousData,
        
    //     });
    
    //     if (isError) {
    //         enqueueSnackbar('Something went wrong!', { variant: 'error' });
    //     }
    
    // console.log(resData); 
   

    useEffect(()=>{
        fetchinvoiceItems()
    },[invoiceId])
     


    // Printing
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

        <div className ='fixed inset-0 bg-opacity-50 flex justify-center items-center' style={{ backgroundColor: 'rgba(20, 10, 10, 0.4)' }}>
            <div className = 'bg-white p-4 rounded-lg shadow-lg  w-[500px] h-[calc(100vh-5rem)]'>
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
        
                    <h2 className ='text-xl font-bold text-center mb-2'>Invoice Report</h2>
                    <p className ={`text-center text-gray-600`}>Thank you for your open report</p>
                            
                    {/*Order Details*/}
                        {/* <div className ='mt-4 border-t pt-4  text-sm text-gray-700'>
                            <p>
                                <strong>Order ID: </strong>
                                {buyInfo._id} 
                            </p>
                            <p>
                                <strong>Name: </strong> {buyInfo.supplier} 
                            </p>
                                
                        </div> */}
        
                        {/*Items Summary*/}
                        <div className ='mt-4 border-t pt-4'>
                            <h3 className ='text-sm font-semibold mb-2'>Items Ordered :</h3>
                            <p>{allTransaction.invoiceType}</p> {/** How to display this  */}

                                <ul className ='text-sm text-gray-700'>

                                    {list.map((item, index) => (

                                        <li 
                                            key= {index}
                                            className ='flex justify-between items-center text-xs p-1 border-b border-zinc-200'
                                        >
                                            
                                            <span>
                                                {item.name} * {item.quantity}
                                            </span>
                                            <span className ='text-sm font-semibold'><span className ='text-xs font-normal text-bue-600'>AED</span> {item.price.toFixed(2)}</span>
                                        </li>
                                        ))}  
                                </ul>
                        </div>
         
        
                        {/*Bills Summery */}
                        {/* <div className ={`mt-4 border-t pt-4 text-sm`}>


                        <p className ='flex gap-1'>
                            <span className ='text-sm font-semibold'>SubTotal : </span><span className ='text-xs'>UAE </span><span className ='text-xs font-semibold'>{details.bills.total}</span>  
                        </p>
                        <p>
                            <span className ='text-sm font-semibold'>Tax : </span><span className ='text-xs'>UAE </span><span className ='text-xs font-semibold'>{details.bills.tax.toFixed(2)}</span>
                        </p>
                        <p className ='mt-2'>
                            <strong className ='text-xs'>Grand Total: </strong> <span className ='text-xs'>UAE </span><span className ='text-xs font-semibold'>{details.bills.totalWithTax.toFixed(2)}</span>
                        </p>

                        
                        </div>  */}
        
                    <div className='mt-10' >

                        <div className='overflow-x-auto px-5'>
                            <table className='w-full text-left text-[#1a1a1a]'>
                                <thead className='bg-zinc-100 text-xs font-normal text-[#1a1a1a]'>
                                    <tr>
                                        <th className='p-3'>Total</th>
                                        <th className='p-3'>Tax</th>
                                        <th className='p-3'>Total with tax</th>

                                    </tr>
                                </thead>

                                <tbody>

                                    {allTransaction.length === 0
                                        ? (<p className='ml-5 mt-5 text-xs text-red-700 flex items-start justify-start'>Your tranactions list is empty . Start adding transactions !</p>)

                                        : allTransaction.map((transaction, index) => (
                                            <tr
                                                key={index}
                                                className='border-b border-zinc-200  text-xs'
                                            >
                                                <td className='p-4 text-sm font-semibold'>{transaction.bills.total.toFixed(2)}</td>
                                                <td className='p-4 text-sm font-semibold'>{transaction.bills.tax.toFixed(2)}</td>
                                                <td className='p-4 text-sm text-blue-600 font-semibold'>{transaction.bills.totalWithTax.toFixed(2)}</td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>

                        </div>

                    </div>
                                 
        
                            
                </div>
                        
                {/** Buttons */}
                    <div className ='flex justify-between mt-4'>
                        <button
                            onClick={handlePrint}
                            className ='text-blue-700 font-semibold hover underline text-xs px-4 py-2 rounded-lg cursor-pointer'
                        >  
                            Print Invoice
                        </button>
                        <button
                            onClick={() => setShowInvoice(false)}
                            className ='text-red-700 font-semibold hover: underline text-xs px-4 py-2 rounded-lg cursor-pointer'
                        >
                            Close
                        </button>
        
                    </div>
            </div>
        </div>

    );
}


export default PrintInvoice ;