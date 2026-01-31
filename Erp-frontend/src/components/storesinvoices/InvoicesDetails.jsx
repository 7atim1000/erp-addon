import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify'
import { updateInvoice } from '../../https';
import { PiListMagnifyingGlassFill } from "react-icons/pi"
import { setInvoice } from '../../redux/slices/invoiceSlice';
// import CartModal from './CartModal';
import { LuPrinterCheck } from "react-icons/lu";
// import PrintInvoice from './PrintInvoice';
import '../../index.css';

const InvoicesDetails = ({ id, date, type, shift, length, customer, supplier,  total,  payed, status, items }) => {

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

    const handleOpenModal = (action) => {

    const invoiceId = id;   
    dispatch(setInvoice({ invoiceId }));
    setIsCartOpenModal(true)    
        //if (action === 'cart') setIsCartOpenModal(true)
    }
    



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
            toast.success('Invoice status updated successfully ...')
            queryClient.invalidateQueries(['invoices']);
             
            }, 

            onError: ()=> {
               //enqueueSnackbar('Failed to update order status!', { variant: 'error' });
                toast.error(response.data.message);
            }

    })

   
 
    return (
          <>
        
        <tr className ='border-b border-[#E3D1B9] text-xs font-semibold'>
            <td className ='p-2 text-xs font-normal  hidden'>{id}</td>
        
         
            <td className ='p-1'>{new Date(date).toLocaleDateString('en-GB')}</td>
            <td className ='p-1 text-yellow-700 text-sm'>{type}</td>
            <td className ='p-1'>{shift}</td>
            <td className ='p-1 text-xs text-sky-600 un ml-0 underline cursor-pointer'>
                <div  onClick = {handleOpenModal}>{length}</div></td>
            <td className ='p-1'>{customer}</td> 
            <td className ='p-1'>{supplier}</td> 
         
            <td className ='p-1'>{total.toFixed(2)}</td>

            <td className ='p-1 border-b border-[#E3D1B9] hide-print'>
                <div className ='flex items-center gap-0 justify-around'>
                 
                    <button className ={`cursor-pointer text-xs font-semibold`}>
                        <LuPrinterCheck  onClick ={handleOpenReport} className ='w-6 h-6 text-yellow-700 rounded-full'/> 
                    </button>
            
                </div>
               
            </td>
        
              
        </tr>


        <div>
           


            <ul hidden>
                {items.map((item, index) => (
                    <li key={index}>
                        {item.name}{item.quantity}

                    </li>
                ))}

            </ul>
        </div>



        

        {/* {isCartOpenModal && <CartModal setIsCartOpenModal={setIsCartOpenModal} />}      
        {showInvoice && <PrintInvoice setShowInvoice={setShowInvoice} />}       */}
    </>
        
    );
};



export default InvoicesDetails ;