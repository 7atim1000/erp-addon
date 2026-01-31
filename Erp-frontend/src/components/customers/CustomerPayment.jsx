import React, { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { addCustomer } from '../../https';
import { motion } from 'framer-motion'
import { enqueueSnackbar } from 'notistack';
import { IoCloseCircle } from 'react-icons/io5'; 
import { MdPersonAdd, MdPerson, MdEmail, MdPhone, MdLocationOn, MdAttachMoney } from "react-icons/md";

const CustomerAdd = ({ setIsCustomerModalOpen, fetchCustomers }) => {
    const [loading, setLoading] = useState(false);
    
    const handleClose = () => {
        setIsCustomerModalOpen(false);
    }

    const [formData, setFormData] = useState({
        customerName: "", 
        email: "", 
        contactNo: "", 
        address: "", 
        balance: 0
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ 
            ...prev, 
            [name]: name === 'balance' ? parseFloat(value) || 0 : value 
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            await CustomerMutation.mutateAsync(formData);
            setIsCustomerModalOpen(false);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    
    const CustomerMutation = useMutation({
        mutationFn: (reqData) => addCustomer(reqData),
        onSuccess: (res) => {
            const { data } = res;
            enqueueSnackbar(data.message, { variant: "success" });
            fetchCustomers();
            setFormData({
                customerName: "", 
                email: "", 
                contactNo: "", 
                address: "", 
                balance: 0
            });
        },
        onError: (error) => {
            const { response } = error;
            enqueueSnackbar(response?.data?.message || "An error occurred", { variant: "error" });
            console.log(error);
        },
    });

    return (
        <div className='fixed inset-0 bg-blue-900/30 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4'>
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className='bg-gradient-to-br from-white via-blue-50 to-white rounded-2xl shadow-2xl 
                          border border-blue-100 w-full max-w-2xl mx-auto max-h-[95vh] overflow-hidden 
                          shadow-blue-900/10'
            >
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 p-4 sm:p-5 md:p-6 
                              relative overflow-hidden">
                    <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="bg-white p-2 sm:p-3 rounded-xl shadow-lg">
                                <MdPersonAdd className="text-blue-600 w-6 h-6 sm:w-7 sm:h-7" />
                            </div>
                            <div>
                                <h2 className='text-lg sm:text-xl md:text-2xl font-bold text-white'>
                                    Add New Customer
                                </h2>
                                <p className='text-blue-100 text-xs sm:text-sm mt-1'>
                                    Fill in the customer details below
                                </p>
                            </div>
                        </div>
                        <button 
                            onClick={handleClose}
                            className='p-2 text-white hover:bg-white/20 rounded-xl transition-all 
                                     duration-200 cursor-pointer active:scale-95 disabled:cursor-not-allowed'
                            disabled={loading}
                        >
                            <IoCloseCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>
                    </div>
                </div>

                {/* Modal Body - Form */}
                <div className='overflow-y-auto max-h-[calc(95vh-180px)] p-4 sm:p-5 md:p-6'>
                    <form className='space-y-4 sm:space-y-6' onSubmit={handleSubmit}>
                        {/* Customer Name */}
                        <div className="space-y-2">
                            <label className='text-sm font-semibold text-gray-700 flex items-center gap-2'>
                                <MdPerson className="text-blue-500 w-5 h-5" />
                                Customer Name
                                <span className="text-red-500">*</span>
                            </label>
                            <div className="relative group">
                                <input 
                                    type="text"
                                    name="customerName"
                                    value={formData.customerName}
                                    onChange={handleInputChange}
                                    placeholder="Enter customer full name"
                                    className='w-full px-4 py-3 pl-11 bg-white border border-blue-200 rounded-xl 
                                             text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 
                                             focus:border-blue-400 transition-all duration-200 placeholder:text-gray-400 
                                             hover:border-blue-300 disabled:bg-gray-50 disabled:cursor-not-allowed shadow-sm'
                                    required
                                    autoComplete='off'
                                    disabled={loading}
                                />
                                <MdPerson className='absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500' />
                            </div>
                        </div>

                        {/* Email and Contact - Side by side on desktop */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                            {/* Email Address */}
                            <div className="space-y-2">
                                <label className='text-sm font-semibold text-gray-700 flex items-center gap-2'>
                                    <MdEmail className="text-blue-500 w-5 h-5" />
                                    Email Address
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="relative group">
                                    <input 
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="customer@example.com"
                                        className='w-full px-4 py-3 pl-11 bg-white border border-blue-200 rounded-xl 
                                                 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 
                                                 focus:border-blue-400 transition-all duration-200 placeholder:text-gray-400 
                                                 hover:border-blue-300 disabled:bg-gray-50 disabled:cursor-not-allowed shadow-sm'
                                        required
                                        autoComplete='off'
                                        disabled={loading}
                                    />
                                    <MdEmail className='absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500' />
                                </div>
                            </div>

                            {/* Contact Number */}
                            <div className="space-y-2">
                                <label className='text-sm font-semibold text-gray-700 flex items-center gap-2'>
                                    <MdPhone className="text-blue-500 w-5 h-5" />
                                    Contact Number
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="relative group">
                                    <input 
                                        type="tel"
                                        name="contactNo"
                                        value={formData.contactNo}
                                        onChange={handleInputChange}
                                        placeholder="+971 5X XXX XXXX"
                                        className='w-full px-4 py-3 pl-11 bg-white border border-blue-200 rounded-xl 
                                                 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 
                                                 focus:border-blue-400 transition-all duration-200 placeholder:text-gray-400 
                                                 hover:border-blue-300 disabled:bg-gray-50 disabled:cursor-not-allowed shadow-sm'
                                        required
                                        autoComplete='off'
                                        disabled={loading}
                                    />
                                    <MdPhone className='absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500' />
                                </div>
                            </div>
                        </div>

                        {/* Address */}
                        <div className="space-y-2">
                            <label className='text-sm font-semibold text-gray-700 flex items-center gap-2'>
                                <MdLocationOn className="text-blue-500 w-5 h-5" />
                                Address
                                <span className="text-red-500">*</span>
                            </label>
                            <div className="relative group">
                                <input 
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    placeholder="Enter complete address"
                                    className='w-full px-4 py-3 pl-11 bg-white border border-blue-200 rounded-xl 
                                             text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 
                                             focus:border-blue-400 transition-all duration-200 placeholder:text-gray-400 
                                             hover:border-blue-300 disabled:bg-gray-50 disabled:cursor-not-allowed shadow-sm'
                                    required
                                    autoComplete='off'
                                    disabled={loading}
                                />
                                <MdLocationOn className='absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500' />
                            </div>
                        </div>

                        {/* Opening Balance */}
                        <div className="space-y-2">
                            <label className='text-sm font-semibold text-gray-700 flex items-center gap-2'>
                                <MdAttachMoney className="text-blue-500 w-5 h-5" />
                                Opening Balance
                                <span className="text-red-500">*</span>
                            </label>
                            <div className="relative group">
                                <input 
                                    type="number"
                                    name="balance"
                                    value={formData.balance}
                                    onChange={handleInputChange}
                                    placeholder="0.00"
                                    className='w-full px-4 py-3 pl-11 pr-14 bg-white border border-blue-200 rounded-xl 
                                             text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 
                                             focus:border-blue-400 transition-all duration-200 placeholder:text-gray-400 
                                             hover:border-blue-300 disabled:bg-gray-50 disabled:cursor-not-allowed shadow-sm'
                                    required
                                    step="0.01"
                                    min="0"
                                    autoComplete='off'
                                    disabled={loading}
                                />
                                <MdAttachMoney className='absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500' />
                                <span className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 font-medium text-sm'>
                                    AED
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 pl-1">
                                Enter the opening balance in AED (0 if no balance)
                            </p>
                        </div>
                    </form>
                </div>

                {/* Modal Footer - Form Actions */}
                <div className="bg-gradient-to-r from-blue-50 via-white to-blue-50 p-4 sm:p-5 
                              border-t border-blue-200/50">
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <button
                            type='button'
                            onClick={handleClose}
                            className='flex-1 px-4 py-3 sm:py-3.5 bg-white border border-blue-300 
                                     text-blue-700 rounded-xl hover:bg-blue-50 transition-all duration-200 
                                     cursor-pointer font-semibold text-sm shadow-sm hover:shadow-md
                                     active:shadow-sm disabled:cursor-not-allowed disabled:opacity-50'
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type='submit'
                            onClick={handleSubmit}
                            disabled={loading || !formData.customerName.trim()}
                            className={`flex-1 px-4 py-3 sm:py-3.5 rounded-xl transition-all duration-200 
                                     cursor-pointer font-semibold text-sm flex items-center justify-center gap-2
                                     ${loading || !formData.customerName.trim()
                                        ? 'bg-blue-400 cursor-not-allowed' 
                                        : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-sm hover:shadow-md'
                                     } text-white`}
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    <span>Adding Customer...</span>
                                </>
                            ) : (
                                <>
                                    <MdPersonAdd className="w-4 h-4" />
                                    <span>Add Customer</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default CustomerAdd;

// import React, { useState } from 'react'

// import { enqueueSnackbar } from 'notistack';
// import { motion } from 'framer-motion'
// import { IoCloseCircle } from "react-icons/io5";

// import { useSelector } from 'react-redux'
// import { useMutation } from '@tanstack/react-query'
// import { addInvoice, addTransaction, updateCustomer } from '../../https';
// import { toast } from 'react-toastify'
// import PaymentInvoice from './PaymentInvoice';


// const CustomerPayment = ({setIsPaymentModal, fetchCustomers}) => {
//     const customerData = useSelector((state) => state.customer);
//     const userData = useSelector((state) => state.user);

//     const [formData, setFormData] = useState({
//         payed : 0 ,  description :''  ,  
//         // date: new Date().toISOString().slice(0, 10)
//         // date :new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10)
//         date: new Date().toISOString().slice(0, 10)
       
//     });

//     // to set date and no shift 
//     // Before sending to backend
//     const localDate = formData.date; // e.g. "2025-06-20"
//     //const utcDate = new Date(localDate + 'T00:00:00Z').toISOString().slice(0, 10);
//     // Use utcDate instead of formData.date
        
//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prev) => ({...prev, [name] : value}));
//     };
    
//     const handleClose = () => {
//         setIsPaymentModal(false)
//     };


//     ///////////////////////////

//     const [paymentMethod, setPaymentMethod] = useState();
      
//     //  Invoice
//     const [paymentInvoice, setPaymentInvoice] = useState(false);
//     const [paymentInfo, setPaymentInfo] = useState();
//     /////////////////



//     const handlePlaceOrder = async () => {

//         if (!paymentMethod) {
//             toast.warning('Please select payment method !')
//             return;
//         }
//          if (formData.payed === 0) {
//             enqueueSnackbar('please specify amount', { variant: "warning" });
//             return;
//         }

//         if (paymentMethod === "Cash" || paymentMethod === 'Online') {

//             const paymentOrderData = {

//                 invoiceNumber : `${Date.now()}`,
//                 type :'customersPayment',
//                 invoiceStatus: "Completed",
//                 invoiceType: "customersPayment",

//                 customer: customerData.customerId,
//                 customerName : customerData.customerName ,

//                 supplier : null, supplierName : null, 


//                 beneficiary: customerData.customerId,

//                 // to save TOTALS   || NEEDED  
//                 buyBills: {
//                     total: 0,
//                     tax: 0,
//                     totalWithTax: 0,
//                     payed: 0,
//                     balance: 0
//                 },          

//                 saleBills: {
//                     total: 0,
//                     tax: 0,
//                     totalWithTax: 0,
//                     payed : formData.payed,
//                     balance: (customerData.balance - formData.payed)
//                 },
//                 bills: {
//                     total: 0,
//                     tax: 0,
//                     totalWithTax: 0,
//                     payed : formData.payed,
//                     balance: (customerData.balance - formData.payed)
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
//     };

//     const paymentMutation = useMutation({
//         mutationFn: (reqData) => addInvoice(reqData),

//         onSuccess: (resData) => {
//             const { data } = resData.data; // data comes from backend ... resData default on mutation
//             console.log(data);

//             setPaymentInfo(data)  // to show details in report            

//             toast.success('Customer payment confirm successfully .');

//             // transfer to financial 
//              const transactionData = {   
                
//                 transactionNumber :`${Date.now()}`,
//                 amount :formData.payed,
//                 type :'Income',
//                 category :'customerPayment',
//                 refrence :'-',
//                 description : '-',
//                 date : formData.date
                    
//                 }
    
//                 setTimeout(() => {
//                     transactionMutation.mutate(transactionData)
//                 }, 1500)


           

//             // Update customer 
//             const balanceData = {
//                 balance: customerData.balance - formData.payed,
//                 customerId: customerData.customerId  
//             }

//             setTimeout(() => {
//                 customerUpdateMutation.mutate(balanceData)
//             }, 1500)

//             setPaymentInvoice(true); // to open report 
//             setPaymentMethod('')

//         },


//         onError: (error) => {
//             console.log(error);
//         }
//     });

//     // update Customer balance ...

//     const customerUpdateMutation = useMutation({

//         mutationFn: (reqData) => updateCustomer(reqData),
//         onSuccess: (resData) => {
//             console.log(resData);

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
//             toast.success('The revenue was transferred to the finance department .');
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
//         <div className='fixed inset-0 bg-opacity-50 flex items-center justify-center z-50' 
//         style={{ backgroundColor:  'rgba(20, 10, 10, 0.4)'}} >
//             <motion.div
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.9 }}
//                 transition={{ durayion: 0.3, ease: 'easeInOut' }}
//                 className='bg-white p-2 rounded-sm shadow-lg/30 w-120 md:mt-5 mt-5 h-[calc(100vh)]'
//             >


//                 {/*Modal Header */}
//                 <div className="flex justify-between items-center mb-2 shadow-xl p-2">
//                     <div className ='flex flex-col gap-2'>
//                         <h2 className='text-[#1a1a1a] text-md font-semibold'>Customers Payment</h2>
//                         <p className='text-sm text-[#1a1a1a] font-medium'> 
//                             <span className='text-[#0ea5e9] font-normal text-sm'>Make a payment to the customer : </span> 
//                             {customerData.customerName}
//                         </p>
//                         <p className='text-md  font-medium text-[#be3e3f]'> 
//                             <span className='text-black font-normal text-sm'>he has debt of : </span> 
//                             {customerData.balance.toFixed(2)}
//                             <span className='text-xs font-normal text-[#1a1a1a]'> AED</span></p>
//                     </div>
//                     <button onClick={handleClose} className='rounded-xs text-[#be3e3f] hover:bg-[#be3e3f]/30 cursor-pointer
//                     border-b border-[#be3e3f]'>
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

//                     <div className ='flex items-center justify-between mt-15 mx-10 p-3 shadow-xl'>
                       
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
//                         paymentInfo ={paymentInfo} 
//                         setPaymentInvoice ={setPaymentInvoice}
//                         fetchCustomers ={fetchCustomers}
//                         />
//                     )}

//                 </form>
//             </motion.div>
//         </div>

//     );
// };


// export default CustomerPayment ;
