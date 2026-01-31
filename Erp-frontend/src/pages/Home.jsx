import React, { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast';
import BottomNav from '../components/shared/BottomNav';
import Greetings from '../components/home/Greetings';
import ErpMenu from '../components/home/ErpMenu';
import HomeInvoicesList from '../components/home/HomeInvoicesList';
import { api } from '../https';
import { TbArrowsExchange2, TbArrowsExchange } from "react-icons/tb";
import MiniCard, { MiniCardGrid } from '../components/home/MiniCard';
import { FaFileInvoice, FaChartLine, FaExchangeAlt, FaReceipt, FaShoppingCart, FaBox } from "react-icons/fa";
import { BsCashCoin, BsGraphUp } from 'react-icons/bs';
import { MdDateRange } from "react-icons/md";

const Home = () => {
    // stores
    const [exchange, setExchange] = useState([]);
    const [receipt, setReceipt] = useState([]);
    // stores and invoices frequency
    const [frequency, setFrequency] = useState('1');

    // invoices
    const [sale, setSale] = useState([]);
    const [purchase, setPurchase] = useState([]);

    const [type, setType] = useState('bills');
    const [invoiceType, setInvoiceType] = useState('all');
    const [invoiceStatus, setInvoiceStatus] = useState('all');
    const [customer, setCustomer] = useState('all');
    const [supplier, setSupplier] = useState('all');
    const [shift, setShift] = useState('all');

    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('-createdAt');

    // stores
    const [storeinvoiceType, setStoreinvoiceType] = useState('');
    const [itemStore, setItemStore] = useState('all');
    const [itemName, setItemName] = useState('all');

    // Loading states
    const [loading, setLoading] = useState({
        exchange: false,
        receipt: false,
        sale: false,
        purchase: false
    });

    const fetchExchange = async () => {
        setLoading(prev => ({ ...prev, exchange: true }));
        try {
            const response = await api.post('/api/storeinvoice/fetch', {
                sort: '-createdAt',
                frequency,
                storeinvoiceType: 'exchange',
                shift,
                itemStore,
                itemName
            });

            if (response.data.success) {
                setExchange(response.data.invoices);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message || 'Failed to fetch exchange data');
        } finally {
            setLoading(prev => ({ ...prev, exchange: false }));
        }
    };

    const fetchReceipt = async () => {
        setLoading(prev => ({ ...prev, receipt: true }));
        try {
            const response = await api.post('/api/storeinvoice/fetch', {
                sort: '-createdAt',
                frequency,
                storeinvoiceType: 'receipt',
                shift,
                itemStore,
                itemName
            });

            if (response.data.success) {
                setReceipt(response.data.invoices);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message || 'Failed to fetch receipt data');
        } finally {
            setLoading(prev => ({ ...prev, receipt: false }));
        }
    };

    const fetchSale = async () => {
        setLoading(prev => ({ ...prev, sale: true }));
        try {
            const response = await api.post('/api/invoice/fetch', {
                type,
                frequency,
                invoiceType: 'Sale invoice',
                invoiceStatus,
                customer,
                supplier,
                shift,
                search,
                sort,
                page: 1,
                limit: 1000
            });

            if (response.data.success) {
                setSale(response.data.data || []);
            } else {
                toast.error(response.data.message || 'Invoices not found');
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message || 'Failed to fetch sales data');
        } finally {
            setLoading(prev => ({ ...prev, sale: false }));
        }
    };

    const fetchPurchase = async () => {
        setLoading(prev => ({ ...prev, purchase: true }));
        try {
            const response = await api.post('/api/invoice/fetch', {
                type,
                frequency,
                invoiceType: 'Purchase invoice',
                invoiceStatus,
                customer,
                supplier,
                shift,
                search,
                sort,
                page: 1,
                limit: 1000
            });

            if (response.data.success) {
                setPurchase(response.data.data || []);
            } else {
                toast.error(response.data.message || 'Invoices not found');
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message || 'Failed to fetch purchase data');
        } finally {
            setLoading(prev => ({ ...prev, purchase: false }));
        }
    };

    // Calculate totals
    const exchangeTotal = exchange.reduce((acc, invoice) => acc + invoice.bills.total, 0);
    const receiptTotal = receipt.reduce((acc, invoice) => acc + invoice.bills.total, 0);
    const saleTotal = sale.reduce((acc, invoice) => acc + invoice.bills.total, 0);
    const purchaseTotal = purchase.reduce((acc, invoice) => acc + invoice.bills.total, 0);

    useEffect(() => {
        fetchExchange();
        fetchReceipt();
        fetchSale();
        fetchPurchase();
    }, [frequency, storeinvoiceType, shift, itemStore, itemName, invoiceType, invoiceStatus, shift, search, sort]);

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-blue-200 via-white to-blue-500 ">
            {/* Main Content */}
            <div className="container mx-auto px-3 sm:px-4 md:px-2 lg:px-2 py-4 sm:py-6 max-w-full">
                <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 ">
                    
                    {/* Left Column - Main Content (3/5 on desktop) */}
                    <div className="lg:flex-3 flex flex-col gap-4 sm:gap-6">
                        
                        {/* Greetings Section */}
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
                            <Greetings />
                        </div>

                        {/* ERP Menu Section */}
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2">
                                    <FaChartLine className="h-5 w-5 text-blue-600" />
                                    Quick Actions
                                </h2>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <MdDateRange className="h-4 w-4" />
                                    <span>Today</span>
                                </div>
                            </div>
                            <ErpMenu />
                        </div>

                        {/* Dashboard Cards Section */}
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
                            <div className="mb-6">
                                <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                                    <BsGraphUp className="h-5 w-5 text-blue-600" />
                                    Financial Overview
                                </h2>
                                <p className="text-sm text-gray-600">Real-time financial metrics and insights</p>
                            </div>

                            {/* Stores Section */}
                            {/* <div className="mb-8">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-base sm:text-lg font-semibold text-gray-700 flex items-center gap-2">
                                        <FaBox className="h-4 w-4 text-blue-500" />
                                        Stores Management
                                    </h3>
                                    <div className="flex gap-2">
                                        <button className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-lg font-medium">
                                            Today
                                        </button>
                                    </div>
                                </div>
                                <MiniCardGrid cols={2}>
                                    <MiniCard 
                                        title="Exchange" 
                                        icon={<FaExchangeAlt className="h-5 w-5" />} 
                                        number={exchangeTotal.toFixed(2)} 
                                        footerNum={2.4}
                                    />
                                    <MiniCard 
                                        title="Receipt" 
                                        icon={<FaReceipt className="h-5 w-5" />} 
                                        number={receiptTotal.toFixed(2)} 
                                        footerNum={1.2}
                                    />
                                </MiniCardGrid>
                            </div> */}

                            {/* Invoices Section */}
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-base sm:text-lg font-semibold text-gray-700 flex items-center gap-2">
                                        <FaShoppingCart className="h-4 w-4 text-blue-500" />
                                        Sales & Purchase
                                    </h3>
                                    <div className="flex gap-2">
                                        <button className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-lg font-medium">
                                            Today
                                        </button>
                                    </div>
                                </div>
                                <MiniCardGrid cols={2}>
                                    <MiniCard 
                                        title="Sales" 
                                        icon={<BsCashCoin className="h-5 w-5" />} 
                                        number={saleTotal.toFixed(2)} 
                                        footerNum={3.8}
                                    />
                                    <MiniCard 
                                        title="Purchase" 
                                        icon={<FaFileInvoice className="h-5 w-5" />} 
                                        number={purchaseTotal.toFixed(2)} 
                                        footerNum={-1.5}
                                    />
                                </MiniCardGrid>
                            </div>

                            {/* Stats Summary */}
                            <div className="mt-8 pt-6 border-t border-gray-100">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center">
                                        <p className="text-sm text-gray-600 mb-1">Total Transactions</p>
                                        <p className="text-lg font-bold text-blue-700">
                                            {sale.length + purchase.length}
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm text-gray-600 mb-1">Net Balance</p>
                                        <p className="text-lg font-bold text-green-600">
                                            AED {(saleTotal - purchaseTotal).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Sidebar (2/5 on desktop) */}
                    <div className="lg:flex-2">
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 h-full">
                            <div className="mb-6">
                                <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                                    <FaFileInvoice className="h-5 w-5 text-blue-600" />
                                    Recent Invoices
                                </h2>
                                <p className="text-sm text-gray-600">Latest transaction activities</p>
                            </div>
                            <div className="h-[calc(100%-5rem)]">
                                <HomeInvoicesList />
                            </div>
                            <div className="mt-6 pt-4 border-t border-gray-100">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Showing recent activities</span>
                                    <button className="text-blue-600 hover:text-blue-700 font-medium">
                                        View All →
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Navigation */}
            <BottomNav />
        </div>
    );
};

export default Home;

// import React, {useState, useEffect} from 'react'
// import BottomNav from '../components/shared/BottomNav';
// import Greetings from '../components/home/Greetings';
// import ErpMenu from '../components/home/ErpMenu';
// import HomeInvoicesList from '../components/home/HomeInvoicesList';
// import { api } from '../https';

// import { TbArrowsExchange2 } from "react-icons/tb";
// import { TbArrowsExchange } from "react-icons/tb";
// import MiniCard from '../components/home/MiniCard';
// import { FaFileInvoice } from "react-icons/fa";
// import { BsCashCoin } from 'react-icons/bs'
// // stone-500  slate-500  [#D2B48C] bg-[#D2B48C]

// const Home = () => {
//     // stores
//     const [exchange, setExchange] = useState([]);
//     const [receipt, setReceipt] = useState([]);
//     // stores and invoices frequency
//     const [frequency, setFrequency] = useState('1');

//     // invoices
//     const [sale, setSale] = useState([]);
//     const [purchase, setPurchase] = useState([]);

//     const [type, setType] = useState('bills');
//     const [invoiceType, setInvoiceType] = useState('all');
//     const [invoiceStatus, setInvoiceStatus] = useState('all');
//     const [customer, setCustomer] = useState('all');
//     const [supplier, setSupplier] = useState('all');
//     const [shift, setShift] = useState('all');

//     const [search, setSearch] = useState('');
//     const [sort, setSort] = useState('-createdAt');

//     // stores
//     const [storeinvoiceType, setStoreinvoiceType] = useState('');
//     const [itemStore, setItemStore] = useState('all');
//     const [itemName, setItemName] = useState('all');
    
   

//     const fetchExchange = async () => {
//         try {
//             const response = await api.post('/api/storeinvoice/fetch', {

//                 sort: '-createdAt',
//                 frequency,
//                 storeinvoiceType: 'exchange',
//                 shift,
//                 itemStore,
//                 itemName
//             })

//             if (response.data.success) {
//                 setExchange(response.data.invoices)
//                 console.log(response.data.invoices)
//             } else {
//                 toast.error(response.data.message)
//             }

//         } catch (error) {
//             console.log(error)
//             toast.error(error.message)
//         }
//     };

//     const fetchReceipt = async () => {
//         try {
//             const response = await api.post('/api/storeinvoice/fetch', {

//                 sort: '-createdAt',
//                 frequency,
//                 storeinvoiceType: 'receipt',
//                 shift,
//                 itemStore,
//                 itemName
//             })

//             if (response.data.success) {
//                 setReceipt(response.data.invoices)
//                 console.log(response.data.invoices)
//             } else {
//                 toast.error(response.data.message)
//             }

//         } catch (error) {
//             console.log(error)
//             toast.error(error.message)
//         }
//     };

//     const fetchSale = async () => {
//         try {
//             const response = await api.post('/api/invoice/fetch' , 
//              {
//                     type,
//                     frequency,
//                     invoiceType:'Sale invoice',
//                     invoiceStatus,
//                     customer,
//                     supplier,
//                     shift,

//                     search,
//                     sort,
                    
//                     page: 1,
//                     limit: 1000
//                 },
//             );

//             setSale(response.data)
//             console.log(response.data)

//             if (response.data.success) {
//                 setSale(response.data.data || []);

//             } else {
//                 toast.error(response.data.message || 'invocies not found')
//             }


//         } catch (error) {
//             console.log(error)
//         }
//     };

//     const fetchPurchase = async () => {
//         try {
//             const response = await api.post('/api/invoice/fetch',
//                 {
//                     type,
//                     frequency,
//                     invoiceType:'Purchase invoice',
//                     invoiceStatus,
//                     customer,
//                     supplier,
//                     shift,

//                     search,
//                     sort,

//                     page: 1,
//                     limit: 1000
//                 },
//             );

//             setPurchase(response.data)
//             console.log(response.data)

//             if (response.data.success) {
//                 setPurchase(response.data.data || []);

//             } else {
//                 toast.error(response.data.message || 'invocies not found')
//             }

//         } catch (error) {
//             console.log(error)
//         }
//     };


//     useEffect(() => {
//         fetchExchange() , fetchReceipt(), fetchSale(), fetchPurchase()
//     }, [frequency, storeinvoiceType, shift, itemStore, itemName, invoiceType,  invoiceStatus, shift, search, sort]);

//     return (
//         <section className='bg-[#f5f5f5] h-[calc(100vh-5rem)] overflow-hidden flex gap-3'>

//             <div className='flex-[3]  bg-white'>

//                 <div className='bg-white mt-0 bg-white'>
//                     <Greetings />
//                 </div>

//                 <div className='mt-1 px-2 py-2 flex justify-between flex-wrap shadow-xl bg-[#f5f5f5]'>
//                     <ErpMenu />
//                 </div>

    
//                     {/* <div className ='flex flex-col gap-1 mt-2 px-10 bg-white'>
//                         <h1 className ='text-amber-900 text-sm font-semibold mt-3'>Stores :</h1>
//                         <div className='flex items-center w-full gap-3 px-8'>
//                             <MiniCard title='Exchange' icon ={<TbArrowsExchange className='w-6 h-6 text-white' />} number ={exchange.reduce((acc, invoice) => acc + invoice.bills.total, 0).toFixed(2)} />
//                             <MiniCard title='Receipt' icon ={<TbArrowsExchange2 className='w-6 h-6 text-white' />} number ={receipt.reduce((acc, invo) => acc + invo.bills.total, 0).toFixed(2)} />
//                         </div>
//                     </div> */}

//                     <div className ='flex flex-col gap-1 mt-2 px-10 bg-white mt-3'>
//                         {/* <h1 className ='text-amber-900 text-sm font-semibold'>Invoices :</h1> */}
//                         <div className='flex items-center justify-between w-full gap-3 py-15 px-0'>
//                             <MiniCard title='Sales' icon ={<BsCashCoin className='w-6 h-6 text-white' />} number ={sale.reduce((acc, invoice) => acc + invoice.bills.total, 0).toFixed(2)} />
//                             <MiniCard title='Purchase' icon ={<FaFileInvoice className='w-6 h-6 text-white' />} number ={purchase.reduce((acc, invo) => acc + invo.bills.total, 0).toFixed(2)} />
//                         </div>
//                     </div>

//             </div>

//             <div className='flex-[2] bg-white'>

//                 <div className='flex flex-col gap-5'>
//                     <HomeInvoicesList />
//                 </div> 

//             </div>

//             <BottomNav />

//         </section>
//     );
// };

// export default Home;