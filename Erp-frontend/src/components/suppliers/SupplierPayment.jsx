import React, { useState } from 'react'
import { enqueueSnackbar } from 'notistack';
import { motion } from 'framer-motion'
import { IoCloseCircle } from "react-icons/io5";
import { useSelector } from 'react-redux'
import { useMutation } from '@tanstack/react-query'
import { addInvoice, addTransaction, updateSupplier } from '../../https';
import { toast } from 'react-toastify'
import PaymentInvoice from './PaymentInvoice';
import { MdAttachMoney, MdDescription, MdDateRange, MdPayment } from "react-icons/md";
import { FaCashRegister, FaCreditCard } from "react-icons/fa";

const SupplierPayment = ({ setIsPaymentModal, fetchSuppliers }) => {
    const supplierData = useSelector((state) => state.supplier);
    const userData = useSelector((state) => state.user);

    const [formData, setFormData] = useState({
        payed: 0,
        description: '',
        date: new Date().toISOString().slice(0, 10)
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleClose = () => {
        setIsPaymentModal(false);
    };

    ///////////////////////////
    const [paymentMethod, setPaymentMethod] = useState();
    const [loading, setLoading] = useState(false);

    // Invoice print report
    const [paymentInvoice, setPaymentInvoice] = useState(false);
    // for show data in report
    const [paymentInfo, setPaymentInfo] = useState();

    /////////////////
    const handlePlaceOrder = async () => {
        if (!paymentMethod) {
            enqueueSnackbar('Please select payment method!', { variant: "warning" });
            return;
        }
        if (formData.payed === 0 || formData.payed === '0') {
            enqueueSnackbar('Please specify amount', { variant: "warning" });
            return;
        }

        if (paymentMethod === "Cash" || paymentMethod === 'Online') {
            setLoading(true);
            const paymentOrderData = {
                type: 'suppliersPayment',
                invoiceNumber: `${Date.now()}`,
                invoiceStatus: "Completed",
                invoiceType: "suppliersPayment",
                supplier: supplierData.supplierId,
                supplierName: supplierData.supplierName,
                customer: null,
                customerName: null,
                beneficiary: supplierData.supplierId,
                saleBills: {
                    total: 0,
                    tax: 0,
                    totalWithTax: 0,
                    payed: 0,
                    balance: 0,
                },
                buyBills: {
                    total: 0,
                    tax: 0,
                    totalWithTax: 0,
                    payed: formData.payed,
                    balance: (supplierData.balance - formData.payed)
                },
                bills: {
                    total: 0,
                    tax: 0,
                    totalWithTax: 0,
                    payed: formData.payed,
                    balance: (supplierData.balance - formData.payed)
                },
                items: null,
                paymentMethod: paymentMethod,
                date: formData.date,
                user: userData._id,
            };

            setTimeout(() => {
                paymentMutation.mutate(paymentOrderData);
            }, 1500);
        }
    }

    const paymentMutation = useMutation({
        mutationFn: (reqData) => addInvoice(reqData),
        onSuccess: (resData) => {
            const { data } = resData.data;
            console.log(data);

            setPaymentInfo(data);
            toast.success('Supplier payment confirmed successfully.');

            // transfer to financial 
            const transactionData = {
                transactionNumber: `${Date.now()}`,
                amount: formData.payed,
                type: 'Expense',
                category: 'supplierPayment',
                refrence: '-',
                description: '-',
                date: formData.date
            }

            setTimeout(() => {
                transactionMutation.mutate(transactionData)
            }, 1500);

            // Update supplier Balance 
            const balanceData = {
                balance: supplierData.balance - formData.payed,
                supplierId: supplierData.supplierId
            }

            setTimeout(() => {
                supplierUpdateMutation.mutate(balanceData)
            }, 1500);

            setPaymentInvoice(true);
            setPaymentMethod('');
            setLoading(false);
        },
        onError: (error) => {
            console.log(error);
            setLoading(false);
        }
    });

    // update Supplier balance ...
    const supplierUpdateMutation = useMutation({
        mutationFn: (reqData) => updateSupplier(reqData),
        onSuccess: (resData) => {
            //console.log(resData);
        },
        onError: (error) => {
            console.log(error);
        }
    });

    // add transaction  ...
    const transactionMutation = useMutation({
        mutationFn: (reqData) => addTransaction(reqData),
        onSuccess: (resData) => {
            const { data } = resData.data;
            toast.success('The Expense was transferred to the finance department.');
        },
        onError: (error) => {
            console.log(error);
        }
    });

    const cancelPayment = () => {
        setPaymentMethod('');
        setFormData({
            payed: 0,
            description: '',
            date: new Date().toISOString().slice(0, 10)
        });
    };

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
                <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 to-blue-700 p-4 sm:p-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-2 rounded-lg">
                                <MdPayment className="text-white w-5 h-5" />
                            </div>
                            <div>
                                <h2 className='text-lg sm:text-xl font-bold text-white'>Supplier Payment</h2>
                                <div className="flex flex-wrap items-center gap-2 text-blue-100 text-xs sm:text-sm">
                                    <span className="font-medium">Supplier: {supplierData.supplierName}</span>
                                    <span className="hidden sm:inline">•</span>
                                    <span className="text-red-200 font-semibold">
                                        Due: {supplierData.balance.toFixed(2)} AED
                                    </span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            className='p-2 text-white hover:bg-white/20 rounded-lg transition duration-200 cursor-pointer'
                            disabled={loading}
                        >
                            <IoCloseCircle size={22} />
                        </button>
                    </div>
                </div>

                {/* Modal Body */}
                <div className='flex-1 overflow-y-auto p-4 sm:p-5'>
                    <form onSubmit={(e) => e.preventDefault()}>
                        {/* Date Field */}
                        <div className="mb-4">
                            <label className='text-sm font-medium text-gray-700 flex items-center gap-2 mb-2'>
                                <MdDateRange className="text-blue-600 w-4 h-4" />
                                Payment Date
                            </label>
                            <div className="relative">
                                <input
                                    type='date'
                                    name='date'
                                    value={formData.date}
                                    onChange={handleInputChange}
                                    className='w-full px-4 py-3 pl-10 bg-white border border-blue-200 rounded-lg 
                                             text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 
                                             focus:border-transparent transition duration-200'
                                    required
                                    disabled={loading}
                                />
                                <MdDateRange className='absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600' />
                            </div>
                        </div>

                        {/* Amount Field */}
                        <div className="mb-4">
                            <label className='text-sm font-medium text-gray-700 flex items-center gap-2 mb-2'>
                                <MdAttachMoney className="text-blue-600 w-4 h-4" />
                                Payment Amount
                            </label>
                            <div className="relative">
                                <input
                                    type='number'
                                    name='payed'
                                    value={formData.payed}
                                    onChange={handleInputChange}
                                    placeholder='Enter payment amount'
                                    className='w-full px-4 py-3 pl-10 pr-12 bg-white border border-blue-200 rounded-lg 
                                             text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 
                                             focus:border-transparent transition duration-200'
                                    required
                                    min="0"
                                    step="0.01"
                                    disabled={loading}
                                />
                                <MdAttachMoney className='absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600' />
                                <span className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm'>
                                    AED
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                Current balance: {supplierData.balance.toFixed(2)} AED
                            </p>
                        </div>

                        {/* Description Field */}
                        <div className="mb-6">
                            <label className='text-sm font-medium text-gray-700 flex items-center gap-2 mb-2'>
                                <MdDescription className="text-blue-600 w-4 h-4" />
                                Description (Optional)
                            </label>
                            <div className="relative">
                                <input
                                    type='text'
                                    name='description'
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder='Enter payment description'
                                    className='w-full px-4 py-3 pl-10 bg-white border border-blue-200 rounded-lg 
                                             text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 
                                             focus:border-transparent transition duration-200'
                                    disabled={loading}
                                />
                                <MdDescription className='absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600' />
                            </div>
                        </div>

                        {/* Payment Method Selection */}
                        <div className="mb-6">
                            <label className='text-sm font-medium text-gray-700 flex items-center gap-2 mb-3'>
                                <MdPayment className="text-blue-600 w-4 h-4" />
                                Select Payment Method
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type='button'
                                    onClick={() => setPaymentMethod('Cash')}
                                    disabled={loading}
                                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border 
                                             transition duration-200 cursor-pointer text-sm font-medium
                                             ${paymentMethod === 'Cash'
                                                ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                                                : 'bg-white border-blue-200 text-blue-700 hover:bg-blue-50'
                                             }`}
                                >
                                    <FaCashRegister className="w-4 h-4" />
                                    Cash
                                </button>
                                <button
                                    type='button'
                                    onClick={() => setPaymentMethod('Online')}
                                    disabled={loading}
                                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border 
                                             transition duration-200 cursor-pointer text-sm font-medium
                                             ${paymentMethod === 'Online'
                                                ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                                                : 'bg-white border-blue-200 text-blue-700 hover:bg-blue-50'
                                             }`}
                                >
                                    <FaCreditCard className="w-4 h-4" />
                                    Online
                                </button>
                            </div>
                            {paymentMethod && (
                                <p className="text-xs text-green-600 mt-2 text-center">
                                    Selected: {paymentMethod} Payment
                                </p>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                type='button'
                                onClick={handlePlaceOrder}
                                disabled={loading || !paymentMethod || !formData.payed}
                                className={`flex-1 px-4 py-3 rounded-lg transition duration-200 cursor-pointer 
                                         font-medium text-sm flex items-center justify-center gap-2
                                         ${loading || !paymentMethod || !formData.payed
                                            ? 'bg-blue-400 cursor-not-allowed' 
                                            : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                                         } text-white shadow-sm hover:shadow-md`}
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        <span>Processing...</span>
                                    </>
                                ) : (
                                    <>
                                        <MdPayment className="w-4 h-4" />
                                        <span>Confirm Payment</span>
                                    </>
                                )}
                            </button>
                            <button
                                type='button'
                                onClick={cancelPayment}
                                disabled={loading}
                                className='flex-1 px-4 py-3 bg-white border border-blue-300 text-blue-700 rounded-lg 
                                         hover:bg-blue-50 transition duration-200 cursor-pointer font-medium text-sm'
                            >
                                Clear Form
                            </button>
                        </div>
                    </form>

                    {/* Payment Summary */}
                    <div className="mt-6 pt-5 border-t border-blue-200">
                        <div className="bg-blue-50 rounded-lg p-4">
                            <h3 className='font-semibold text-blue-700 mb-2 flex items-center gap-2'>
                                <MdAttachMoney className="text-blue-600" />
                                Payment Summary
                            </h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Current Balance:</span>
                                    <span className="font-medium text-red-600">
                                        {supplierData.balance.toFixed(2)} AED
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Payment Amount:</span>
                                    <span className="font-medium text-green-600">
                                        {formData.payed ? parseFloat(formData.payed).toFixed(2) : '0.00'} AED
                                    </span>
                                </div>
                                <div className="flex justify-between pt-2 border-t border-blue-200">
                                    <span className="text-gray-700 font-medium">New Balance:</span>
                                    <span className={`font-bold ${(supplierData.balance - (formData.payed || 0)) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                        {(supplierData.balance - (formData.payed || 0)).toFixed(2)} AED
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-blue-200 bg-blue-50 p-4">
                    <button
                        onClick={handleClose}
                        disabled={loading}
                        className='w-full py-2.5 bg-white border border-blue-300 text-blue-700 rounded-lg 
                                 hover:bg-blue-50 transition duration-200 cursor-pointer font-medium text-sm'
                    >
                        Close Payment
                    </button>
                </div>

                {/* Payment Invoice Modal */}
                {paymentInvoice && (
                    <PaymentInvoice
                        paymentInfo={paymentInfo}
                        setPaymentInvoice={setPaymentInvoice}
                        fetchSuppliers={fetchSuppliers}
                    />
                )}
            </motion.div>
        </div>
    );
};

export default SupplierPayment;

// import React, { useState } from 'react'

// import { enqueueSnackbar } from 'notistack';

// import { motion } from 'framer-motion'
// import { IoCloseCircle } from "react-icons/io5";

// import { useSelector } from 'react-redux'
// import { useMutation } from '@tanstack/react-query'
// import { addInvoice, addTransaction, updateSupplier  } from '../../https';
// import { toast } from 'react-toastify'
// import PaymentInvoice from './PaymentInvoice';


// const SupplierPayment = ({setIsPaymentModal, fetchSuppliers}) => {

//     const supplierData = useSelector((state) => state.supplier);
//     const userData = useSelector((state) => state.user);

//     const [formData, setFormData] = useState({
//         payed : 0 ,  description :''  ,  
//         // date :new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10)
//         date: new Date().toISOString().slice(0, 10)
       
//     });

        
//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prev) => ({...prev, [name] : value}));
//     };
    
//     const handleClose = () => {
//         setIsPaymentModal(false)
//     };


//     ///////////////////////////

//     const [paymentMethod, setPaymentMethod] = useState();
      
//     //  Invoice print report
//     const [paymentInvoice, setPaymentInvoice] = useState(false);
//     // for show data in report
//     const [paymentInfo, setPaymentInfo] = useState();
   
//     /////////////////
//     const handlePlaceOrder = async () => {

//         if (!paymentMethod) {
//             enqueueSnackbar('Please select payment method !', { variant: "warning" })
//             return;
//         }
//         if (formData.payed === 0) {
//             enqueueSnackbar('please specify amount', { variant: "warning" });
//             return;
//         }

//         if (paymentMethod === "Cash" || paymentMethod === 'Online') {

//             const paymentOrderData = {

//                 type : 'suppliersPayment',
//                 invoiceNumber : `${Date.now()}`,
//                 invoiceStatus: "Completed",
//                 invoiceType: "suppliersPayment",

//                 supplier: supplierData.supplierId,
//                 supplierName : supplierData.supplierName ,

//                 customer : null, customerName : null,
//                 beneficiary: supplierData.supplierId,
              
//                 // to save TOTALS   || NEEDED            
//                 saleBills: {
//                     total: 0,
//                     tax: 0,
//                     totalWithTax: 0,
//                     payed : 0,
//                     balance: 0,
//                 },

//                 buyBills: {
//                     total: 0,
//                     tax: 0,
//                     totalWithTax: 0,
//                     payed : formData.payed,
//                     balance: (supplierData.balance - formData.payed)
//                 },
//                 bills: {
//                     total: 0,
//                     tax: 0,
//                     totalWithTax: 0,
//                     payed : formData.payed,
//                     balance: (supplierData.balance - formData.payed)
//                 },

//                 // to save New Items || NEEDED
//                 items: null,
//                 paymentMethod: paymentMethod,

//                 // date :  new Date(formData.date + 'T00:00:00Z').toISOString().slice(0, 10)
//                 date :formData.date, 
//                 user: userData._id,

//             };

//             setTimeout(() => {
//                 paymentMutation.mutate(paymentOrderData);
//             }, 1500);

//         }
//     }

//     const paymentMutation = useMutation({
//         mutationFn: (reqData) => addInvoice(reqData),

//         onSuccess: (resData) => {
//             const { data } = resData.data; // data comes from backend ... resData default on mutation
//             console.log(data);

//             setPaymentInfo(data)  // to show details in report            

//             toast.success('Supplier payment confirm successfully .');

//             // transfer to financial 
//              const transactionData = {         

//                 transactionNumber: `${Date.now()}`,
//                 amount :formData.payed,
//                 type :'Expense',
//                 category :'supplierPayment',
//                 refrence :'-',
//                 description : '-',
//                 date : formData.date
//             }
    
//             setTimeout(() => {
//                 transactionMutation.mutate(transactionData)
//             }, 1500)


           

//             // Update supplier Balance 
//             const balanceData = {
//                 balance: supplierData.balance - formData.payed,
//                 supplierId: supplierData.supplierId  
//             }

//             setTimeout(() => {
//                 supplierUpdateMutation.mutate(balanceData)
//             }, 1500)

//             setPaymentInvoice(true); // to open report 
//             setPaymentMethod('')
//         },


//         onError: (error) => {
//             console.log(error);
//         }
//     });

//     // update Supplier balance ...

//     const supplierUpdateMutation = useMutation({

//         mutationFn: (reqData) => updateSupplier(reqData),
//         onSuccess: (resData) => {
//         //console.log(resData);
//         },
//         onError: (error) => {
//             console.log(error)
//         }
//     });

//     // add transaction  ...
//     const transactionMutation = useMutation({
//         mutationFn: (reqData) => addTransaction(reqData),

//         onSuccess: (resData) => {
//             const { data } = resData.data; // data comes from backend ... resData default on mutation
//             //console.log(data);       
//             toast.success('The Expense was transferred to the finance department .');
//         },
//         onError: (error) => {
//             console.log(error);
//         }
//     });

//     const cancelPayment = () => {
//         setPaymentMethod('');
//         setFormData({
//             payed : 0 , description : '' , date : new Date().toISOString().slice(0, 10)
//         })
//     };




//     return (
//         <div className='fixed inset-0 bg-opacity-50 flex items-center justify-center  z-50' 
//         style={{ backgroundColor: 'rgba(20, 10, 10, 0.4)'}}>
//             <motion.div
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.9 }}
//                 transition={{ durayion: 0.3, ease: 'easeInOut' }}
//                 className='bg-white p-2 rounded-sm shadow-lg/30 w-120 md:mt-5 mt-5 h-[calc(100vh)]'
//             >


//                 {/*Modal Header */}
//                 <div className="flex justify-between items-center mb-2 shadow-xl p-2">
//                     <div className='flex flex-col gap-2'>
//                         <h2 className='text-[#1a1a1a] text-md font-semibold'>Suppliers Payment</h2>
//                         <p className='text-sm text-[#1a1a1a] font-medium'>
//                             <span className='text-[#0ea5e9] font-normal text-sm'>Make a payment to the supplier : </span>
//                             {supplierData.supplierName}
//                         </p>
//                         <p className='text-md  font-medium text-[#be3e3f]'>
//                             <span className='text-black font-normal text-sm'>he has debt of : </span>
//                             {supplierData.balance.toFixed(2)}
//                             <span className='text-xs font-normal text-[#1a1a1a]'> AED</span></p>
//                     </div>
//                     <button onClick={handleClose} className='rounded-xs text-[#be3e3f] hover:bg-[#be3e3f]/30 cursor-pointer
//                                     border-b border-[#be3e3f]'>
//                         <IoCloseCircle size={22} />
//                     </button>
//                 </div>

//                 {/*Modal Body  onSubmit={handlePlaceOrder}*/}
//                 <form className='mt-5 space-y-6' >

//                     <div className ='flex items-center justify-between'>
//                         <label className='w-[20%] text-yellow-700 block text-sm font-normal'>Date :</label>
//                         <div className='flex w-[80%] items-center rounded-xs p-3 bg-white shadow-xl'>
//                             <input
//                                 type='date'
//                                 name='date'
//                                 value={formData.date}
//                                 onChange={handleInputChange}

//                                 placeholder='Enter date'
//                                 className='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none text-xs font-normal
//                                 border-b border-yellow-700'
//                                 required
//                                 autoComplete='none'
//                             />
//                         </div>
//                     </div>

//                     <div className ='flex items-center justify-between'>
//                         <label className='w-[20%] text-yellow-700 block  text-sm font-normal'>Amount :</label>
//                         <div className='flex w-[80%] items-center rounded-xs p-3 bg-white shadow-xl'>
//                             <input
//                                 type='text'
//                                 name='payed'
//                                 value={formData.payed}
//                                 onChange={handleInputChange}

//                                 placeholder='Enter amount'
//                                 className='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none text-xs font-normal
//                                 border-b border-yellow-700'
//                                 required
//                                 autoComplete='none'
//                             />
//                         </div>
//                     </div>


//                     <div className ='flex  items-center justify-between'>
//                         <label className='w-[20%] text-yellow-700  block mb-2 mt-3 text-sm font-normal'>Descripion :</label>
//                         <div className='flex w-[80%] items-center rounded-xs p-3 bg-white shadow-xl'>
//                             <input
//                                 type='text'
//                                 name='description'
//                                 value={formData.description}
//                                 onChange={handleInputChange}

//                                 placeholder='Enter description'
//                                 className='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none text-xs font-normal
//                                 border-b border-yellow-700'
//                                 required
//                                 autoComplete='none'
//                             />
//                         </div>
//                     </div>

           
//                     <div className='flex items-center justify-between mt-15 mx-10 p-3 shadow-xl'>

//                         <div className='flex flex-col gap-3 p-2'>
//                             <button className={`text-[#1a1a1a] p-3 w-15 h-15 rounded-full text-sm font-semibold  
//                         cursor-pointer shadow-lg/30
//                         ${paymentMethod === 'Cash' ? "bg-emerald-500 text-zinc-100" : "bg-zinc-100"}`}
//                                 //onClick ={() => setPaymentMethod('Cash')}
//                                 type='button'
//                                 onClick={() => setPaymentMethod('Cash')}


//                             >Cash</button>

//                             <button className={`text-[#1a1a1a] p-3 w-15 h-15 rounded-full text-sm font-semibold  
//                         cursor-pointer shadow-lg/30
//                             ${paymentMethod === 'Online' ? "bg-emerald-500 text-zinc-100" : "bg-zinc-100"}`}
//                                 onClick={() => setPaymentMethod('Online')}
//                                 type='button'
//                             >Online</button>
//                         </div>

//                         <div className='flex flex-col gap-3 p-2 '>
//                             {/*bg-[#F6B100] */}
//                             <button className='bg-[#0ea5e9] text-white p-3 w-full rounded-xs cursor-pointer
//                         text-sm font-medium shadow-lg/30'
//                                 type='button'
//                                 onClick={handlePlaceOrder}
//                             >Confirm Payment
//                             </button>

//                             <button className='bg-[#be3e3f]/70 text-white p-3 w-full rounded-xs cursor-pointer
//                         text-sm font-medium shadow-lg/30'
//                                 type='button'
//                                 onClick={cancelPayment}
//                             >Cancel Payment
//                             </button>
//                         </div>


//                     </div>

//                     {paymentInvoice && (
//                         <PaymentInvoice 
//                         paymentInfo={paymentInfo} 
//                         setPaymentInvoice ={setPaymentInvoice} 
//                         fetchSuppliers ={fetchSuppliers}
//                         />
//                     )}


//                 </form>
//             </motion.div>
//         </div>

//     );
// };


// export default SupplierPayment ;
