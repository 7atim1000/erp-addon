import React ,{ useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { FaMoneyBillWave, FaCreditCard, FaCashRegister, FaCheckCircle, FaTimesCircle, FaPrint, FaWallet, FaCalculator, FaReceipt } from 'react-icons/fa';
import { getTotalPrice } from '../../redux/slices/saleSlice';
import { removeAllItems } from '../../redux/slices/saleSlice';
import { removeCustomer } from '../../redux/slices/customerSlice';

import { useMutation } from '@tanstack/react-query';
import { enqueueSnackbar } from 'notistack';
import { toast } from 'react-toastify'
import { addInvoice, addTransaction, api, updateCustomer } from '../../https';

import SaleInvoice from '../invoice/SaleInvoice';


const Bills = ({fetchServices}) => {

    // total Accounting
    const dispatch = useDispatch();
    
    // to get from slices
    const customerData = useSelector((state) => state.customer);
    const saleData = useSelector(state => state.sale);
    const userData = useSelector((state) => state.user);

    const total = useSelector(getTotalPrice);
    const taxRate = 0.00;
    const calculations = useMemo(() => {
        const tax = (total * taxRate) / 100;
        const totalPriceWithTax = total + tax;
        return { tax, totalPriceWithTax };
    }, [total]);

    // START Account 
    const [payedAmount, setPayedAmount] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [showInvoice, setShowInvoice] = useState(false);
    const [saleInfo, setSaleInfo] = useState();
    const [isProcessing, setIsProcessing] = useState(false);

    const balance = (calculations.totalPriceWithTax - Number(payedAmount)).toFixed(2);

    const showPayed = () => {
        setPayedAmount(calculations.totalPriceWithTax.toFixed(2));
    }
    
    const cashPaymethod = () => {
        setPaymentMethod('Cash');
        showPayed();
    }

    const onlinePaymethod = () => {
        setPaymentMethod('Online');
        showPayed();
    }

    const handlePayedAmountChange = (e) => {
        const value = e.target.value;
        if (/^\d*\.?\d*$/.test(value)) {
            const numericValue = value === '' ? 0 : parseFloat(value);
            setPayedAmount(numericValue > calculations.totalPriceWithTax
                ? calculations.totalPriceWithTax
                : numericValue
            );
        }
    };
    // END Account


    const handlePlaceOrder = async () => {
        setIsProcessing(true);
            
        if (!paymentMethod){
            enqueueSnackbar('Please select a payment method', {variant: "warning"});
            setIsProcessing(false);
            return;
        }
        if (customerData.customerName === '') {
            enqueueSnackbar('Please select customer', { variant: "warning" });
            setIsProcessing(false);
            return;
        }
        if (saleData.length === 0) {
            enqueueSnackbar('Please select items', { variant: "warning" });
            setIsProcessing(false);
            return;
        }

             
        if (paymentMethod === "Cash" || paymentMethod === 'Online') {

            ////////////////////Start Update quantity....
            const updatedItems = saleData.map(item => ({
                id: item.id, // or item._id, depending on your schema
                quantity: item.quantity // the quantity to subtract from stock
            }));

            await api.post('/api/services/update-salequantities', { items: updatedItems });
            
            ////////////////////End Update quantity.....
        
            const saleOrderData = {
                type :'bills',
                invoiceNumber : customerData.saleId,
                customer : customerData.customerId, 
                customerName :customerData.customerName,
                supplier : null, 
                supplierName : null,
                beneficiary : customerData.customerId, 
                invoiceStatus: "In Progress",
                invoiceType : "Sale invoice",
                saleBills: {
                    total: total.toFixed(2),
                    tax: (calculations.tax).toFixed(2),
                    totalWithTax: (calculations.totalPriceWithTax).toFixed(2),
                    payed: Number(payedAmount).toFixed(2),
                    balance: balance,
                },
                bills: {
                    total: total.toFixed(2),
                    tax: (calculations.tax).toFixed(2),
                    totalWithTax: (calculations.totalPriceWithTax).toFixed(2),
                    payed: Number(payedAmount).toFixed(2),
                    balance: balance,
                },
                items: saleData,
                paymentMethod: paymentMethod,
                user: userData._id,
            };
            
            saleMutation.mutate(saleOrderData);
        }
    }

    const saleMutation = useMutation ({ 
        mutationFn: (reqData) => addInvoice(reqData),
        onSuccess: (resData) => {
            const { data } = resData.data;
            setSaleInfo(data);
            toast.success('Sale invoice placed and confirmed successfully.');

            // add Transaction 
            const transactionData = {   
                transactionNumber :`${Date.now()}`,      
                amount :Number(payedAmount).toFixed(2),
                type :'Income',
                category :'Sale invoice',
                refrence :'-',
                description : '-',
                date :new Date().toISOString().slice(0, 10),
                paymentMethod: paymentMethod,
                user: userData._id,
            }

            setTimeout(() => {
                transactionMutation.mutate(transactionData)
            }, 1500)

            // Update Balance
            const previousBalance = Number(customerData.balance) || 0;
            const numericNewBalance = previousBalance + Number(balance);
            const formattedNewBalance = numericNewBalance.toFixed(2);

            const balanceData = {         
                balance: formattedNewBalance,
                customerId: data.customer
            }

            setTimeout(() => {
                customerUpdateMutation.mutate(balanceData)
            }, 1500)

            setShowInvoice(true);
            setPaymentMethod('');
            dispatch(removeCustomer());
            dispatch(removeAllItems());
            fetchServices({ category: 'all', page: 1});
            setPayedAmount(0);
            setIsProcessing(false);
        },
        onError: (error) => {
            console.log(error);
            toast.error('Error placing order');
            setIsProcessing(false);
        }
    });
    
    // add transaction 
    const transactionMutation = useMutation ({ 
        mutationFn: (reqData) => addTransaction(reqData),
        onSuccess: (resData) => {
            const { data } = resData.data;
            toast.success('The income was transferred to the finance department.');
        },         
        onError: (error) => {
            console.log(error);
        }
    });

    // update Customer
    const customerUpdateMutation = useMutation({
        mutationFn: (reqData) => updateCustomer(reqData),
        onSuccess: (resData) => {
            console.log(resData);
        }, 
        onError : (error) => {
            console.log(error)
        }
    });

    const cancelOrder = () => {
        if (saleData.length === 0) {
            toast.info('No items to cancel');
            return;
        }
        
        if (window.confirm('Are you sure you want to cancel all items?')) {
            dispatch(removeCustomer());
            dispatch(removeAllItems());
            fetchServices({ category: 'all', page: 1});
            setPayedAmount(0);
            toast.success('Order cancelled');
        }
    }

    const handlePrintReceipt = () => {
        if (saleData.length === 0) {
            toast.warning('No items to print');
            return;
        }
        
        // Create temporary receipt for print preview
        const tempReceipt = {
            invoiceNumber: `TEMP-${Date.now().toString().slice(-6)}`,
            date: new Date(),
            items: saleData,
            bills: {
                totalWithTax: calculations.totalPriceWithTax.toFixed(2),
                total: total.toFixed(2),
                tax: calculations.tax.toFixed(2),
                payed: payedAmount,
                balance: balance
            },
            customerName: customerData.customerName || 'Not specified',
            paymentMethod: paymentMethod || 'Not specified'
        };
        
        setSaleInfo(tempReceipt);
        setShowInvoice(true);
    }
    
    return (
        <div className='bg-white rounded-xl shadow-lg border border-blue-100 p-4 md:p-2 h-full'>
            {/* Header */}
            <div className='bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-2 mb-5'>
                <div className='flex items-center gap-3'>
                    <div className='bg-white/20 p-1 rounded-lg'>
                        <FaMoneyBillWave className='text-white w-5 h-5' />
                    </div>
                    <div>
                        <h3 className='text-white font-bold text-lg'>Confirmation and Payment</h3>
                        <p className='text-blue-100 text-sm'>Confirm and complete sale</p>
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className='grid grid-cols-2 gap-3 mb-1'>
                <div className='flex justify-between bg-blue-50 rounded-lg p-1 border border-blue-100'>
                    <p className='text-xs text-blue-600 mb-1'>Items</p>
                    <p className='text-xl font-bold text-blue-800'>{saleData.length}</p>
                    {/* <p className='text-xs text-gray-500'>products</p> */}
                </div>
                
                <div className='flex justify-between bg-blue-50 rounded-lg p-1 border border-blue-100'>
                    <p className='text-xs text-blue-600 mb-1'>Subtotal</p>
                    <p className='text-xl font-bold text-blue-800'>{total.toFixed(2)}</p>
                    {/* <p className='text-xs text-gray-500'>AED</p> */}
                </div>
            </div>

            {/* Price Breakdown */}
            <div className='space-y-2 mb-4'>
                <div className='flex justify-between items-center py-2 border-b border-gray-100'>
                    <span className='text-sm text-gray-600'>Subtotal:</span>
                    <span className='font-medium text-gray-800'>{total.toFixed(2)} AED</span>
                </div>
                
                <div className='flex justify-between items-center py-2 border-b border-gray-100'>
                    <div className='flex items-center gap-2'>
                        <span className='text-sm text-gray-600'>Tax</span>
                        <span className='text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full'>{taxRate}%</span>
                    </div>
                    <span className='font-medium text-gray-800'>{calculations.tax.toFixed(2)} AED</span>
                </div>
                
                <div className='flex justify-between items-center py-3 bg-blue-50 rounded-lg px-3'>
                    <span className='text-sm font-semibold text-blue-800'>Grand Total:</span>
                    <span className='text-lg font-bold text-blue-800'>{calculations.totalPriceWithTax.toFixed(2)} AED</span>
                </div>
            </div>

            {/* Payment Section */}
            <div className='mb-4'>
                <div className='flex justify-between items-center mb-3'>
                    <h4 className='text-sm font-semibold text-gray-700'>Payment Method</h4>
                    <div className='flex gap-2'>
                        <button
                            onClick={cashPaymethod}
                            className={`px-3 py-3.5 text-sm rounded-lg transition duration-200 flex items-center gap-2 ${
                                paymentMethod === 'Cash' 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-[#f6b100]/50 text-gray-900 hover:bg-gray-200'
                            }`}
                        >
                            <FaCashRegister className='w-3.5 h-3.5 text-blue-600' />
                            Cash
                        </button>
                        <button
                            onClick={onlinePaymethod}
                            className={`px-3 py-1.5 text-sm rounded-lg transition duration-200 flex items-center gap-2 ${
                                paymentMethod === 'Online' 
                                    ? 'bg-green-600 text-white' 
                                    : 'bg-blue-100 text-gray-900 hover:bg-gray-200'
                            }`}
                        >
                            <FaCreditCard className='w-3.5 h-3.5 text-green-600' />
                            Online
                        </button>
                    </div>
                </div>

                <div className='space-y-3'>
                    <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-2'>
                        <label className='text-sm text-gray-600'>Amount Paid:</label>
                        <div className='relative flex-1 sm:max-w-[180px]'>
                            <input
                                className='w-full border border-blue-200 rounded-lg px-3 py-2 text-right text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                name='payedAmount'
                                type='number'
                                step='0.01'
                                min='0'
                                max={calculations.totalPriceWithTax}
                                value={payedAmount}
                                onChange={handlePayedAmountChange}
                                placeholder='0.00'
                            />
                            <span className='absolute left-3 top-2.5 text-gray-400 text-sm'>AED</span>
                        </div>
                    </div>
                    
                    <div className='flex justify-between items-center bg-gradient-to-r from-gray-50 to-white p-3 rounded-lg border border-gray-200'>
                        <span className='text-sm font-semibold text-gray-700'>Balance:</span>
                        <span className={`text-lg font-bold ${Number(balance) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {Number(balance).toFixed(2)} AED
                        </span>
                    </div>
                </div>
            </div>

            {/* Customer Info */}
            {/* {customerData.customerName && (
                <div className='mb-4 p-3 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border border-emerald-100'>
                    <div className='flex items-center gap-2 mb-2'>
                        <FaWallet className='w-4 h-4 text-emerald-600' />
                        <span className='text-xs font-medium text-emerald-600'>Current Customer</span>
                    </div>
                    <div className='flex justify-between items-center'>
                        <span className='text-sm text-gray-700'>{customerData.customerName}</span>
                        <span className={`text-sm font-semibold ${Number(customerData.balance) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {Number(customerData.balance || 0).toFixed(2)} AED
                        </span>
                    </div>
                </div>
            )} */}

            {/* Action Buttons */}
            <div className='space-y-3'>
                <button
                    onClick={handlePlaceOrder}
                    disabled={isProcessing || saleData.length === 0}
                    className={`w-full py-3 rounded-lg font-semibold text-sm transition duration-200 cursor-pointer flex items-center justify-center gap-2 ${
                        isProcessing || saleData.length === 0
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md'
                    }`}
                >
                    {isProcessing ? (
                        <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            Processing...
                        </>
                    ) : (
                        <>
                            <FaCheckCircle className='w-5 h-5' />
                            Confirm Invoice
                        </>
                    )}
                </button>
                
                <div className='grid grid-cols-2 gap-3'>
                    <button
                        onClick={handlePrintReceipt}
                        disabled={saleData.length === 0}
                        className={`py-3 rounded-lg font-medium text-sm transition duration-200 cursor-pointer flex items-center justify-center gap-2 ${
                            saleData.length === 0
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-700'
                        }`}
                    >
                        <FaPrint className='w-4 h-4' />
                        Print Receipt
                    </button>
                    
                    <button
                        onClick={cancelOrder}
                        disabled={saleData.length === 0}
                        className={`py-3 rounded-lg font-medium text-sm transition duration-200 cursor-pointer flex items-center justify-center gap-2 ${
                            saleData.length === 0
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white'
                        }`}
                    >
                        <FaTimesCircle className='w-4 h-4' />
                        Cancel
                    </button>
                </div>
            </div>

            {/* Status Message */}
            <div className='mt-4 pt-3 border-t border-blue-100'>
                <div className='flex items-center gap-2'>
                    <div className={`w-2 h-2 rounded-full ${
                        saleData.length > 0 ? 'bg-green-500 animate-pulse' : 'bg-gray-300'
                    }`}></div>
                    <span className='text-xs text-gray-600'>
                        {saleData.length > 0 
                            ? `Ready to confirm - ${saleData.length} items` 
                            : 'No items to confirm'}
                    </span>
                </div>
            </div>

            {/* Invoice Modal */}
            {showInvoice && saleInfo && (
                <SaleInvoice 
                    saleInfo={saleInfo} 
                    setShowInvoice={setShowInvoice} 
                    isTemporary={!saleInfo._id}
                />
            )}
        </div>
    );
}

export default Bills;


// import React ,{ useState, useMemo } from 'react'
// import { useDispatch, useSelector } from 'react-redux';

// import { getTotalPrice } from '../../redux/slices/saleSlice';
// import { removeAllItems } from '../../redux/slices/saleSlice';
// import { removeCustomer } from '../../redux/slices/customerSlice';

// import { useMutation } from '@tanstack/react-query';
// import { enqueueSnackbar } from 'notistack';
// import { toast } from 'react-toastify'
// import { addInvoice, addTransaction, api, updateCustomer } from '../../https';

// import SaleInvoice from '../invoice/SaleInvoice';


// const Bills = ({fetchServices}) => {

//     // total Accounting
//     const dispatch = useDispatch();
    
//     // to get from slices
//     const customerData = useSelector((state) => state.customer);
//     const saleData = useSelector(state => state.sale);
//     const userData = useSelector((state) => state.user);

//     const total = useSelector(getTotalPrice);
//     const taxRate = 5.25;
//     const calculations = useMemo(() => {
//         const tax = (total * taxRate) / 100;
//         const totalPriceWithTax = total + tax;
//         return { tax, totalPriceWithTax };
//     }, [total]);

//     // START Account 
//     const [payedAmount, setPayedAmount] = useState(0);
//     const [paymentMethod, setPaymentMethod] = useState('');
//     const [showInvoice, setShowInvoice] = useState(false);
//     const [saleInfo, setSaleInfo] = useState();

//     const balance = (calculations.totalPriceWithTax - Number(payedAmount)).toFixed(2);

//     const showPayed = () => {
//         setPayedAmount(calculations.totalPriceWithTax.toFixed(2));
//     }
    
//     const cashPaymethod = () => {
//         setPaymentMethod('Cash');
//         showPayed();
//     }

//     const onlinePaymethod = () => {
//         setPaymentMethod('Online');
//         showPayed();
//     }

//     const handlePayedAmountChange = (e) => {
//         const value = e.target.value;
//         if (/^\d*\.?\d*$/.test(value)) {
//             const numericValue = value === '' ? 0 : parseFloat(value);
//             setPayedAmount(numericValue > calculations.totalPriceWithTax
//                 ? calculations.totalPriceWithTax
//                 : numericValue
//             );
//         }
//     };
//     // END Account


//     const handlePlaceOrder = async () => {
            
//         if (!paymentMethod){
//             // toast.warning('Please select payment method !')
//             enqueueSnackbar('please select a payment method', {variant: "warning"});
//             return;
//         }
//         if (customerData.customerName === '') {
//             enqueueSnackbar('please select customer', { variant: "warning" });
//             return;
//         }
//         if (saleData.length === 0) {
//             enqueueSnackbar('please select items', { variant: "warning" });
//             return;
//         }

//         // Check for low stock before placing order
//         // const lowStockItems = saleData.filter(item => item.quantity < 10);
//         // if (lowStockItems.length > 0) {
//         //     lowStockItems.forEach(item => {
//         //         toast.warn(`Warning: Item "${item.name || item.title || item.id}" is low in stock (${item.quantity} left)!`);
//         //     });
//         // }

             
//         if (paymentMethod === "Cash" || paymentMethod === 'Online') {

//             ////////////////////Start Update quantity....
//             const updatedItems = saleData.map(item => ({
//                 id: item.id, // or item._id, depending on your schema
//                 quantity: item.quantity // the quantity to subtract from stock
//             }));
//             //console.log(id, quantity)

//             // Example: Call update endpoint after placing order
//             // await axios.post(backendUrl + '/api/services/update-salequantities', { items: updatedItems });
//             await api.post('/api/services/update-salequantities', { items: updatedItems });
            
//             ////////////////////End Update quantity.....
        
//         const saleOrderData = {
//             type :'bills',
           
//             invoiceNumber : customerData.saleId,
//             customer : customerData.customerId, 
//             customerName :customerData.customerName ,
         

//             supplier : null, supplierName : null,
//             beneficiary : customerData.customerId, 
        
//             // to save Status
//             invoiceStatus: "In Progress",
//             invoiceType : "Sale invoice",

//             // to save TOTALS   || NEEDED            
//             saleBills: {
//                 total: total.toFixed(2),
//                 tax: (calculations.tax).toFixed(2),
//                 totalWithTax: (calculations.totalPriceWithTax).toFixed(2),

//                 payed: Number(payedAmount).toFixed(2),
//                 balance: balance,
//             },
//             bills: {
//                 total: total.toFixed(2),
//                 tax: (calculations.tax).toFixed(2),
//                 totalWithTax: (calculations.totalPriceWithTax).toFixed(2),

//                 payed: Number(payedAmount).toFixed(2),
//                 balance: balance,
//             },
        
//             // to save New Items || NEEDED
//             items: saleData,
//             paymentMethod: paymentMethod,
    
//             user: userData._id,
    
//         };
        
//         setTimeout(() => {
//             saleMutation.mutate(saleOrderData);
//         }, 1500);
        
//         }
//     }

//     // const handlePlaceOrder = async () => {
//     //     if (!paymentMethod) {
//     //         enqueueSnackbar('please select a payment method', { variant: "warning" });
//     //         return;
//     //     }
//     //     if (customerData.customerName === '') {
//     //         enqueueSnackbar('please select customer', { variant: "warning" });
//     //         return;
//     //     }
//     //     if (saleData.length === 0) {
//     //         enqueueSnackbar('please select items', { variant: "warning" });
//     //         return;
//     //     }

//     //     // Clean saleData to remove any circular references or non-serializable data
//     //     const cleanSaleData = saleData.map(item => ({
//     //         // Only include the properties you actually need on the server
//     //         id: item.id,
//     //         name: item.name,
//     //         price: item.price,
//     //         pricePerQuantity: item.pricePerQuantity,
//     //         quantity: item.quantity,
//     //         // Add other properties you need, but avoid React components or functions
//     //     }));

//     //     if (paymentMethod === "Cash" || paymentMethod === 'Online') {
//     //         // Update quantity
//     //         const updatedItems = cleanSaleData.map(item => ({
//     //             id: item.id,
//     //             quantity: item.quantity
//     //         }));

//     //         try {
//     //             await api.post('/api/services/update-salequantities', { items: updatedItems });
//     //         } catch (error) {
//     //             console.error('Error updating quantities:', error);
//     //             enqueueSnackbar('Error updating item quantities', { variant: "error" });
//     //             return;
//     //         }

//     //         const saleOrderData = {
//     //             type: 'bills',
//     //             invoiceNumber: customerData.saleId,
//     //             customer: customerData.customerId,
//     //             supplier: null,
//     //             beneficiary: customerData.customerId,
//     //             invoiceStatus: "In Progress",
//     //             invoiceType: "Sale invoice",
//     //             saleBills: {
//     //                 total: total,
//     //                 tax: tax,
//     //                 totalWithTax: totalPriceWithTax,
//     //                 payed: payedAmount,
//     //                 balance: balance
//     //             },
//     //             bills: {
//     //                 total: total,
//     //                 tax: tax,
//     //                 totalWithTax: totalPriceWithTax,
//     //                 payed: payedAmount,
//     //                 balance: balance
//     //             },
//     //             // Use the cleaned data instead of the original saleData
//     //             items: cleanSaleData,
//     //             paymentMethod: paymentMethod,
//     //             user: userData._id,
//     //         };

//     //         // Add a simple delay instead of setTimeout
//     //         await new Promise(resolve => setTimeout(resolve, 1500));
//     //         saleMutation.mutate(saleOrderData);
//     //     }
//     // }


//     const saleMutation = useMutation ({ 
//     mutationFn: (reqData) => addInvoice(reqData),
                      
//         onSuccess: (resData) => {
//             const { data } = resData.data; // data comes from backend ... resData default on mutation
//             console.log(data);
                           
//             setSaleInfo(data)  // to show details in report            
               
//             //enqueueSnackbar('Order Placed!', {variant: "success"});
//             toast.success('Sale invoice placed and confirm successfully .') ;


//            // add Transaction 
//             const transactionData = {   
//                 transactionNumber :`${Date.now()}`,      
               
//                 amount :Number(payedAmount).toFixed(2),
//                 type :'Income',
//                 category :'Sale invoice',
//                 refrence :'-',
//                 description : '-',
//                 date :new Date().toISOString().slice(0, 10)    ,
//                 paymentMethod: paymentMethod,
//                 user: userData._id,

                    
//                 }
    
//                 setTimeout(() => {
//                     transactionMutation.mutate(transactionData)
//                 }, 1500)

           
//             // Update Balance
//             const previousBalance = Number(customerData.balance) || 0;
//             const numericNewBalance = previousBalance + Number(balance); // Do math with numbers
//             const formattedNewBalance = numericNewBalance.toFixed(2); // Then format to 2 decimal places

//             const balanceData = {         
//                 balance:  formattedNewBalance,
//                 //{(Number(customerData.balance) || 0).toFixed(2)}
            
//                 customerId: data.customer  // data from saving order or invoice above     
                    
//                 }
    
//                 setTimeout(() => {
//                     customerUpdateMutation.mutate(balanceData)
//                 }, 1500)
 
        
                    
//             setShowInvoice(true); // to open report 
//             setPaymentMethod('');
           
     
//             dispatch(removeCustomer());
//             dispatch(removeAllItems());
//             fetchServices({ category: 'all', page: 1}) // to refresh services quantity
//             setPayedAmount(0);
//         },
                           

//             onError: (error) => {
//                 console.log(error);
//             }
//         });
    
    
//     // add transaction 
//     const transactionMutation = useMutation ({ 
//     mutationFn: (reqData) => addTransaction(reqData),
                      
//         onSuccess: (resData) => {
//             const { data } = resData.data; // data comes from backend ... resData default on mutation
//             //console.log(data);       
//             toast.success('The income was transferred to the finance department .') ;
//         },         
//             onError: (error) => {
//                 console.log(error);
//             }
//         });
    


//     // update Customer
//     const customerUpdateMutation = useMutation({
        
//         mutationFn: (reqData) => updateCustomer(reqData),
//         onSuccess: (resData) => {
                    
//         console.log(resData);
        
//         }, 
//             onError : (error) => {
//             console.log(error)
//         }
//     });

//     const cancelOrder = () => {
         
//         dispatch(removeCustomer());
//         dispatch(removeAllItems());
//         fetchServices({ category: 'all', page: 1}) // to refresh services quantity
//         setPayedAmount(0);
//     }
    
    
//     return (
//         <>
//         <div className ='flex bg-[#f5f5f5] items-center justify-between shadow-lg/30 p-2 mt-15'>
//             <p className ='text-xs text-[#1a1a1a] font-normal'>Items : {saleData.length}</p>
//             <p className ='text-[#1a1a1a]'><span className ='text-md font-normal'>{total.toFixed(2)}</span>
//                 <span className ='text-xs font-normal text-yellow-700'> AED</span>
//             </p>
//         </div>

//         <div className ='flex bg-[#f5f5f5] items-center justify-between p-2 mt-1 shadow-lg/30'>
//             <p className ='text-xs text-[#1a1a1a] font-normal'>Tax (5.25%)</p>
//             <p className ='text-[#1a1a1a]'><span className ='text-md font-normal'>
//                 {calculations.tax.toFixed(2)}</span>
//             <span className ='text-xs font-normal text-yellow-700'> AED</span></p>
//         </div>

//         <div className ='flex bg-[#f5f5f5] items-center justify-between p-2 mt-1 shadow-lg/30'>
//             <p className ='text-xs text-[#1a1a1a] font-normal'>Grand Total :</p>
//             <p className ='text-yellow-700'><span className ='text-lg font-semibold'>
//                 {calculations.totalPriceWithTax.toFixed(2)}</span>
//                 <span className ='text-xs font-normal text-[#1a1a1a]'> AED</span>
//             </p>
//         </div>

//         <div className ='flex bg-[#f5f5f5] items-center justify-between mt-1 shadow-lg/30 p-2'>

//             <div className ='flex gap-1 items-center justify-between'>
//                 <p className ='text-xs text-[#1f1f1f] font-medium mt-2'>Payed :</p>
               
//                 <input 
//                     className='w-25 bg-white rounded-sm p-1 text-[#1a1a1a] text-lg font-semibold'
//                     name='payedAmount'
//                     type='number'
//                     step='0.01'
//                     min='0'
//                     max={calculations.totalPriceWithTax}
//                     value={payedAmount}
//                     onChange={handlePayedAmountChange}
//                 />
//                 <span className ='text-xs font-normal text-zinc-500 mt-3'> AED</span>
//             </div>

//             <p className ='text-xs text-[#1f1f1f] font-medium mt-2'>Balance :</p>
//             <p className ='ml-0  text-[#be3e3f]'><span className ='text-2xl font-semibold'>
//                 {Number(balance).toFixed(2)}</span><span className ='text-xs font-normal text-zinc-500'> AED</span>
//             </p>
//                 {/* {Number(balance).toFixed(2)} */}
//         </div>

       

//             <div className='flex items-center justify-between mt-15 bg-white p-5 shadow-lg/30'>

//                 <div className='flex flex-col  items-center gap-3 px-5 py-2'>
//                     <button className={`bg-[#f5f5f5]  text-[#0ea5e9]  w-12 h-12 rounded-full  
//                     text-sm font-semibold cursor-pointer shadow-lg/30
//                     ${paymentMethod === 'Cash' ? "bg-zinc-500 text-white" : "bg-white"}`}
//                         //onClick ={() => setPaymentMethod('Cash')}
//                     onClick={cashPaymethod}

//                     >Cash</button>

//                     <button className={`bg-[#f5f5f5] w-12 h-12 rounded-full text-green-600 text-sm font-semibold 
//                     cursor-pointer shadow-lg/30
//                     ${paymentMethod === 'Online' ? "bg-zinc-500 text-white" : "bg-white "}`}
//                         // onClick ={() => setPaymentMethod('Online')}   onlinePaymethod
//                     onClick={onlinePaymethod}
//                     >Online</button>
//                 </div>

//                 <div className='flex flex-col items-center gap-3 px-5 py-2'>
//                      <button className='bg-[#0ea5e9] px-4 py-4 w-full rounded-sm text-white cursor-pointer font-semibold 
//                     text-sm font-medium shadow-lg/30'
//                         onClick={handlePlaceOrder}
//                     >
//                         Confirm Invoice
//                     </button>
//                     <button className='bg-emerald-600  py-4 w-full rounded-sm  cursor-pointer font-semibold text-white text-sm 
//                     font-medium shadow-lg/30'>
//                         Print Receipt
//                     </button>
//                     <button className='bg-[#be3e3f]/90 px-4 py-4 w-full rounded-sm text-white cursor-pointer font-semibold 
//                     text-sm font-medium shadow-lg/30'
//                         onClick={cancelOrder}
//                     >
//                         Cancel
//                     </button>
//                 </div>

//             </div>

//             {showInvoice && (
//                 <SaleInvoice saleInfo={saleInfo} setShowInvoice={setShowInvoice} />
//             )}
        
//         </>
//     );
// }


// export default Bills ;