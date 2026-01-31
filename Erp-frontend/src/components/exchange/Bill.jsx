import React , {useState} from 'react'

import { useMutation }  from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { toast } from 'react-toastify';

import { useSelector, useDispatch } from 'react-redux' ;
import { getExchangeTotalPrice, removeAllExchange } from '../../redux/slices/exchangeSlice';
import { addStoreInvoice, api } from '../../https';
import { removeCustomerExchange } from '../../redux/slices/customerExchangeSlice';
import ExchangeInvoice from './ExchangeInvoice';





const Bill = () => {
    const dispatch = useDispatch();

    const userData = useSelector((state) => state.user);
    const customerData = useSelector((state) => state.customerExchange);
    const cartData = useSelector((state) => state.exchange);  

    const total = useSelector(getExchangeTotalPrice);
    const taxRate = 5.25;
    const tax = (total * taxRate) / 100;
    const totalPriceWithTax = total + tax;

    const [showInvoice, setShowInvoice] = useState(false);
    const [exchangeInfo, setExchangeInfo] = useState();

    const handlePlaceOrder = async () => {

        if (customerData.customerName === '') {
            enqueueSnackbar('please select customer', { variant: "warning" });
            return;
        }
        if (cartData.length === 0) {
            enqueueSnackbar('please select items', { variant: "warning" });
            return;
        }


        ////////Start Update quantity....

        const updatedItems = cartData.map(item => ({
            id: item.id, // or item._id, depending on your slice
            qty: item.qty // the quantity to subtract from stock
        }));
 
        await api.post('/api/storesitems/update-exchangequantities', { items: updatedItems });

        ////////////////////End Update quantity.....

        const exchangeData = {

            storeinvoiceNumber: `${Date.now()}`,
            storeinvoiceStatus: "In Progress",
            storeinvoiceType: "exchange",

            customer: customerData.customerId,
            customerName: customerData.customerName,
            supplier: null,
            supplierName: null,

            customerDetails: {
                name: customerData.customerName,
                phone: customerData.contactNo,
                //email: customerData.customerEmail,
            },


            bills: {
                total: total,
                tax: tax,
                totalWithTax: totalPriceWithTax,
          
            },
            exchangeBills: {
                total: total,
                tax: tax,
                totalWithTax: totalPriceWithTax,

            },

            items: cartData,
            user: userData._id,
        };

        exchangeMutation.mutate(exchangeData);

    };


    const exchangeMutation = useMutation({

        mutationFn: (reqData) => addStoreInvoice(reqData),
        onSuccess: (resData) => {
            const { data } = resData.data;
            console.log(data);

            setExchangeInfo(data)
            toast.success('Exchange invoice Placed and Confirmed Successfully .');


            setShowInvoice(true); // to open report 

            dispatch(removeCustomerExchange());
            dispatch(removeAllExchange());

        },


        onError: (error) => {
            console.log(error);
        }
    });

    const handleCancel = () => {
        dispatch(removeCustomerExchange());
        dispatch(removeAllExchange());
    }


    return(

        <>
        <div className ='flex items-center justify-between'>
            <div className='flex flex-col gap-2 p-2 w-40'>

                    <div className='shadow-lg/30 p-1'>
                        <p className='text-xs text-[#1f1f1f] font-medium mt-2'>Items :
                            <span className='text-sky-600 text-sm font-semibold'> {cartData.length}</span>
                        </p>

                    </div>
                

                    <div className='shadow-lg/30 p-1'>
                        <p>Total : </p>
                        <p className='ml-0  text-[#1f1f1f]'><span className='text-md font-semibold'>
                            {total.toFixed(2)}</span>
                            <span className='text-xs font-normal text-sky-600'> AED</span>
                        </p>

                    </div>
                
                    <div className='shadow-lg/30 p-1'>
                        <p className='text-xs text-[#1a1a1a] font-medium mt-2'>Tax(5.25%)</p>
                        <p className='ml-0 text-[#1a1a1a]'><span className='text-md font-semibold'>
                            {tax.toFixed(2)}</span><span className='text-xs font-normal text-sky-600'> AED</span>
                        </p>

                    </div>
                
                    <div className='shadow-lg/30 p-1'>
                        <p className='text-xs text-[#1a1a1a] font-medium mt-2'>Grand Total :</p>
                        <p className='ml-0  text-sky-600'><span className='text-xl  font-semibold'>{totalPriceWithTax.toFixed(2)}</span>
                            <span className='text-xs font-normal text-[#1a1a1a]'> AED</span>
                        </p>

                    </div>
                
           
            </div>

                <div className='flex flex-col gap-3 p-3'>
                    
                    <button className='bg-[#0ea5e9] px-4 py-4 w-full rounded-sm text-white cursor-pointer font-semibold text-sm font-medium shadow-lg/30'
                        onClick={handlePlaceOrder}
                    >Confirm Exchange
                    </button>
                    <button className='bg-green-600 px-4 py-4 w-full rounded-sm cursor-pointer font-semibold text-white text-sm font-medium shadow-lg/30'>
                        Print Receipt
                    </button>
                    <button className='bg-[#be3e3f]/80 px-4 py-4 w-full rounded-sm text-white cursor-pointer font-semibold text-sm font-medium shadow-lg/30'
                        onClick={handleCancel}
                    >Cancel
                    </button>
                </div>

        </div>



        

       

        

            {showInvoice && (
                <ExchangeInvoice exchangeInfo={exchangeInfo} setShowInvoice={setShowInvoice} />
            )} 
        
        </>

    );
};


export default Bill ;