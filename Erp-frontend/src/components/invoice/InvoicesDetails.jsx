import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify'
import { updateInvoice } from '../../https';
import { PiListMagnifyingGlassFill } from "react-icons/pi"
import { setInvoice } from '../../redux/slices/invoiceSlice';
import CartModal from './CartModal';
import { LuPrinterCheck } from "react-icons/lu";
import PrintInvoice from './PrintInvoice';
import '../../index.css';

import axios from 'axios';

const InvoicesDetails = ({ fetchInvoices, id, date, type, shift, length, customer, supplier, payment, total, tax, totalWithTax, payed, balance, status, items }) => {

    const dispatch = useDispatch(); // called inside the body STUBED

    const cartButton = [
        { label : '' , icon : <PiListMagnifyingGlassFill className ='text-green-600' size={23} />, action :'cart' }
    ]
    
    const [isCartOpenModal, setIsCartOpenModal] = useState(false);
    const [showInvoice, setShowInvoice] = useState(false);


    const handleOpenReport = () => {
        
        const invoiceId = id;
        dispatch(setInvoice({ invoiceId }))

        setShowInvoice(true);

    }

    // const handleOpenModal = (action) => {

    // const invoiceId = id;   
    // dispatch(setInvoice({ invoiceId }));
    // setIsCartOpenModal(true)    
    //     //if (action === 'cart') setIsCartOpenModal(true)
    // }


    // Update orderStatus & room Status
    const handleStatusChange = ({ invoiceId, invoiceStatus }) => {                          // orderId ?
        invoiceUpdateMutation.mutate({invoiceId, invoiceStatus});
    };
    
   
    const queryClient = useQueryClient();
    const invoiceUpdateMutation = useMutation({
        
        mutationFn: ({reqData, invoiceId, invoiceStatus}) => updateInvoice({reqData, invoiceId, invoiceStatus}),
        onSuccess: (resData) => {                     
        const { data } = resData.data;           
            //enqueueSnackbar('Order status updated successfully..', { variant: 'success' });
            toast.success('Invoice status updated successfully.')
            queryClient.invalidateQueries(['invoices']);
            fetchInvoices();
             
            }, 

            onError: ()=> {
               //enqueueSnackbar('Failed to update order status!', { variant: 'error' });
                toast.error(response.data.message);
            }

    })


    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    // Api call
    const handleOpenModal = async (invoiceId, itemsLength) => {
        if (selectedInvoice && selectedInvoice._id === invoiceId) {
            setIsModalOpen(true);
            return;
        }

        setLoading(true);
        try {
            console.log('Fetching invoice:', invoiceId);
            const response = await axios.get(`/api/invoice/${invoiceId}`);
            console.log('API Response:', response.data);

            if (response.data.success) {
                setSelectedInvoice(response.data.data);
                setIsModalOpen(true);
            } else {
                console.error('API returned error:', response.data.message);
                alert('Failed to load invoice details: ' + response.data.message);
            }
        } catch (error) {
            console.error('Error fetching invoice details:', error);
            console.error('Error response:', error.response?.data);
            alert('Failed to load invoice details. Check console for details.');
        } finally {
            setLoading(false);
        }
    };
 
    return (
          <>
        
        <tr className ='border-b-3 border-[#f5f5f5] text-xs font-normal text-[#1a1a1a] 
                    hover:bg-[#F1E8D9] cursor-pointer'>
            <td className ='IdTd p-2 hidden'>{id}</td>
        
            {/* <td className ='hide-print text-xs'>{new Date(date).toLocaleDateString('en-GB')}</td> */}
            {/*new Date  converts you date string to date objects .toLocaleDateString('en-GB') to date format*/}
            <td className ='p-1 '>{new Date(date).toLocaleDateString('en-GB')}</td>
            <td className ='p-1  '>{type}</td>
            <td className ='p-1  '>{shift}</td>
            {/* <td className ='p-1 cursor-pointer'>{length}</td> */}
                <td
                    className="p-1 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleOpenModal(id, length)}
                >
                    {length}
                </td>

            <td className ='p-1 '>{customer}</td> 
            <td className ='p-1 '>{supplier}</td> 
            <td className ='p-1 '>{total.toFixed(2)}</td>
            <td className ='p-1 '>{tax.toFixed(2)}</td>
            <td className ='p-1 '>{totalWithTax.toFixed(2)}</td>
            <td className ='p-1 '>{payed.toFixed(2)}</td>
            <td className ={`${balance === '0' ? 'text-green-600' : 'text-red-600'} p-2 text-xs font-semibold border-b border-zinc-100`}>{balance.toFixed(2)}</td>
           
                <td className='updateTd p-1'>
                    <select
                        className={`hide-print cursor-pointer h-6 rounded-sm 
                        ${status === 'Completed' ? "text-green-700 bg-green-100" : "text-[#1a1a1a] bg-orange-200"} 
                        font-normal text-xs`}
                        value={status}
                        onChange={(e) => handleStatusChange({ invoiceId: id, invoiceStatus: e.target.value })}
                    >
                        <option className='text-[#1a1a1a] rounded-lg cursor-pointer' value='In Progress'>In Progress</option>
                        <option className='text-[#1a1a1a] rounded-lg cursor-pointer' value='Completed'>Completed</option>
                    </select>
                </td>



                <td className='printTd p-1 border-b border-zinc-100 hide-print'>
                    <div className='flex items-center gap-0 justify-around'>
                        <button className={`cursor-pointer text-xs font-semibold`}>
                            <LuPrinterCheck onClick={handleOpenReport} className='w-6 h-6 text-sky-500 rounded-full' />
                        </button>
                    </div>

                </td>
            </tr>


            <div>
           


            {/* <ul hidden>
                {items.map((item, index) => (
                    <li key={index}>
                        {item.name}{item.quantity}

                    </li>
                ))}

            </ul> */}

                {/* Modal Component */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-11/12 md:w-3/4 lg:w-1/2 max-h-96 overflow-y-auto">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-semibold">
                                    Invoice Items {selectedInvoice && `#${selectedInvoice.invoiceNumber || selectedInvoice.id}`}
                                </h3>
                                <button
                                    onClick={closeModal}
                                    className="text-gray-500 hover:text-gray-700 text-2xl"
                                >
                                    ✕
                                </button>
                            </div>

                            {loading ? (
                                <div className="text-center">Loading...</div>
                            ) : selectedInvoice ? (
                                <div>
                                    <div className="mb-4">
                                        <p><strong>Customer:</strong> {selectedInvoice.customer || selectedInvoice.customer?.customerName || 'N/A'}</p>
                                        <p><strong>Total Items:</strong> {selectedInvoice.items?.length || 0}</p>
                                    </div>

                                    {selectedInvoice.items && selectedInvoice.items.length > 0 ? (
                                        <table className="w-full border-collapse">
                                            <thead>
                                                <tr className="bg-gray-100">
                                                    <th className="p-2 border">Product Name</th>
                                                    <th className="p-2 border">Quantity</th>
                                                    <th className="p-2 border">Price</th>
                                                    <th className="p-2 border">Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {selectedInvoice.items.map((item, index) => (
                                                    <tr key={index}>
                                                        <td className="p-2 border">
                                                            {item.name || item.productName || 'N/A'}
                                                        </td>
                                                        <td className="p-2 border">{item.quantity || 0}</td>
                                                        <td className="p-2 border">${(item.price || 0).toFixed(2)}</td>
                                                        <td className="p-2 border">
                                                            ${((item.quantity || 0) * (item.price || 0)).toFixed(2)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <div>No items found in this invoice</div>
                                    )}
                                </div>
                            ) : (
                                <div>No invoice data available</div>
                            )}
                        </div>
                    </div>
                )}
  
        </div>

        {isCartOpenModal && <CartModal setIsCartOpenModal={setIsCartOpenModal} />}      
        {showInvoice && <PrintInvoice setShowInvoice={setShowInvoice} />}   


    </>
        
    );
};



export default InvoicesDetails ;