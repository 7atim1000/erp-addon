import React, { useState, useEffect } from 'react';
import BackButton from '../components/shared/BackButton';
import { api, getStores, getStoresItemsInvoice } from '../https';

import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { enqueueSnackbar } from 'notistack'
import { FcSearch } from "react-icons/fc";
import { GrRadialSelected } from 'react-icons/gr';
import { getAvatarName, getBgColor } from '../utils';
import InventCart from '../components/inventory/InventCart';

import { Progress, Flex } from 'antd'


const StoresInventory = () => {

    // Start Stores and Items
    const { data: responseData, IsError } = useQuery({
        queryKey: ['stores'],
        queryFn: async () => {
            return await getStores();
        },

        placeholderData: keepPreviousData,
    });

    if (IsError) {
        enqueueSnackbar('Something went wrong!', { variant: 'error' });
    }
    console.log(responseData);


    // Implementing Search Functionality in Your Service List
    const [searchTerm, setSearchTerm] = useState('');
    // fetch Sevices
    const { data: resData, isError } = useQuery({
        queryKey: ['items', searchTerm],

        queryFn: async () => {
            return await getStoresItemsInvoice(searchTerm);
        },
        placeholderData: keepPreviousData,
    });
    if (isError) {
        enqueueSnackbar('Something went wrong!', { variant: 'error' })
    }

    console.log(resData);

    const [selectedStore, setSelectedStore] = useState(`Store -1`);
    // End Stores and Items 


    // Start Invoices
    const [allInvoices, setAllInvoices] = useState([]);

    const [frequency, setFrequency] = useState('500');
    const [storeinvoiceType, setStoreinvoiceType] = useState('all');
   
    const [shift, setShift] = useState('all');

    
    const [itemStore, setItemStore] = useState('all');
    const [itemName, setItemName] = useState('all');

    const fetchInvoices = async () => {
        try {
            const response = await api.post('/api/storeinvoice/fetch', {

                sort: '-createdAt',
                frequency,
                storeinvoiceType,
                shift,

                itemStore,
                itemName
            })

            if (response.data.success) {
                setAllInvoices(response.data.invoices)
                console.log(response.data.invoices)
            } else {
                toast.error(response.data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    useEffect(() => {
        fetchInvoices()
    }, [frequency, storeinvoiceType, shift, itemStore, itemName]);

    // End Invocies  



    // fetch Items or services
    const [list, setList] = useState([])
    const fetchStoresItems = async () => {
        try {
            const response = await api.post('/api/storesitems/fetch', {
                sort: '-createdAt'
            })

            if (response.data.success) {
                setList(response.data.items)
                console.log(response.data.items)
            } else {
                toast.error(response.data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    useEffect(() => {
        fetchStoresItems()
    }, []);

    const twoColors = {
        '0%': '#108ee9',
        '100%': '#87d068',
    };

    const conicColors = {
        '0%': '#87d068',
        '50%': '#ffe58f',
        '100%': '#ffccc7',
    };

    const totalInvoices = allInvoices.length;

    const totalSaleInvoices = allInvoices.filter(
        (invoice) => invoice.storeinvoiceType === "exchange"
    );
    const totalBuyInvoices = allInvoices.filter(
        (invoice) => invoice.storeinvoiceType === "receipt" //&& invoice.invoiceStatus === "Completed" 
    );
    const totalIncomePercent = (totalSaleInvoices.length / totalInvoices) * 100;
    const totalExpensePercent = (totalBuyInvoices.length / totalInvoices) * 100;

    // Total amount 
    const totalTurnover = allInvoices.reduce((acc, invoice) => acc + invoice.bills.total, 0);
    const totalSaleTurnover = allInvoices.filter(invoice => invoice.storeinvoiceType === 'exchange').reduce((acc, invoice) => acc + invoice.bills.total, 0);

    const totalBuyTurnover = allInvoices.filter(invoice => invoice.storeinvoiceType === 'receipt').reduce((acc, invoice) => acc + invoice.bills.total, 0);
    const totalSaleTaxTurnover = allInvoices.filter(invoice => invoice.storeinvoiceType === 'exchange').reduce((acc, invoice) => acc + invoice.bills.tax, 0);

    const totalWithTaxBuyTurnover = allInvoices.filter(invoice => invoice.storeinvoiceType === 'receipt').reduce((acc, invoice) => acc + invoice.bills.totalWithTax, 0);
    const totalWithTaxSaleTurnover = allInvoices.filter(invoice => invoice.storeinvoiceType === 'exchange').reduce((acc, invoice) => acc + invoice.bills.totalWithTax, 0);

    // Percentage
    const totalSaleTurnoverPercent = (totalSaleTurnover / totalTurnover) * 100;
    const totalBuyTurnoverPercent = (totalBuyTurnover / totalTurnover) * 100;



    // When clicking a store button
    const handleStoreClick = (storeName) => {

        if (selectedStore === storeName) {
            // Clicking the already selected store deselects it
            setSelectedStore(null);
            setItemStore(''); // Reset filter
        } else {
            setSelectedStore(storeName);
            setItemStore(storeName); // Apply filter
        }
    };


    // Calculate quantity totals  CALCULATE TOTALS BEFORE RENDING IN TABLE: TFOOT:
    // Calculate totals before rendering
    const totals = allInvoices.reduce((acc, invoice) => {
        // Filter items based on itemName
        const items = itemName === 'all'
            ? invoice.items
            : invoice.items.filter(item => item._id === itemName);

        // Sum quantities
        const itemsSum = items.reduce((itemAcc, item) => {
            itemAcc.qty += item.qty || 0;
            itemAcc.qtyBefore += item.quantityBefore || 0;
            itemAcc.qtyAfter += item.quantityAfter || 0;
            return itemAcc;
        }, { qty: 0, qtyBefore: 0, qtyAfter: 0 });

        // Add to main accumulator
        acc.qty += itemsSum.qty;
        acc.qtyBefore += itemsSum.qtyBefore;
        acc.qtyAfter += itemsSum.qtyAfter;
        acc.billsTotal += invoice.bills?.total || 0;
        acc.exchangeTotal += invoice.exchangeBills?.total || 0;
        acc.receiptTotal += invoice.receiptBills?.total || 0;

        return acc;
    }, {
        qty: 0,
        qtyBefore: 0,
        qtyAfter: 0,
        billsTotal: 0,
        exchangeTotal: 0,
        receiptTotal: 0
    });

    return (
        <section className='h-[calc(100vh)] overfow-y-scroll scrollbar-hidden flex'>

            <div className='flex-[45%] bg-white h-[calc(100vh)] overflow-y-scroll scrollbar-hidden shadow-xl'>
                {/* header */}
                <div className='flex items-center justify-between px-2 py-2 shadow-xl'>

                    <div className='flex gap-1 justify-between items-center'>
                        <BackButton />
                        <h1 className='text-[#1a1a1a] text-lg font-bold'>Inventory</h1>
                    </div>

                    <div className='flex items-center justify-between px-2 py-2 shadow-xl'>
                        <div className='flex items-center gap-2 '>
                            <label htmlFor='frequency' className='text-sm text-[#0ea5e9] font-semibold'>Frequency</label>
                            <select id='frequency' value={frequency} onChange={(e) => setFrequency(e.target.value)}
                                className='px-2 py-1 text-sm shadow-lg/30'>
                                <option value='90'>90 Day</option>
                                <option value='30'>30 Days</option>
                                <option value='7'>7 Days</option>
                                <option value='1'>Today</option>

                            </select>

                            <label htmlFor='orderSatus' className='text-sm text-[#0ea5e9] font-semibold'>Status</label>
                            <select id='orderStatus' value={storeinvoiceType} onChange={(e) => setStoreinvoiceType(e.target.value)}
                                className='px-2 py-1 text-sm shadow-lg/30'>
                                <option value='all'>All</option>
                                <option value='exchange'>Exchange</option>
                                <option value='receipt'>Receipt</option>
                            </select>

                        </div>
                    </div>

                </div>
                {/* header */}
                <hr className ='border-t-5 border-zinc-200'/>

                <div className='grid grid-cols-3 gap-4 px-10 py-4 w-[100%] shadow-xl bg-white'>
                    {/* {menus.map((menu) => { */}

                    {responseData?.data.data.map(store => (

                        <div key={store.storeName} 
                            className='flex flex-col bg-[#f5f5f5] items-center justify-between p-3 rounded-sm h-[45px] cursor-pointer shadow-lg/30'
                            // style={{ backgroundColor: getBgColor() }}

                            // selected Item
                            // onClick={() => setSelectedStore(store.storeName)}
                             onClick={() => handleStoreClick(store.storeName)}
                        >

                            <div className='flex bg-[#f5f5f5] items-center justify-between w-full shadow-lg/30 px-2'>
                                <h1 className='text-sm font-semibold text-[#1a1a1a]'>{store.storeName}</h1>
                                {selectedStore === store.storeName && <GrRadialSelected className='text-green-600' size={20} />}
                            </div>

                        </div>
                    ))}

                </div>
                <hr className ='border-t-5 border-zinc-200'/>

                <div className='bg-white shadow-xl grid grid-cols-4 gap-2 px-2 py-2 w-[100%] overflow-y-scroll 
                scrollbar-hidden h-[calc(100vh-12rem)]'>

                    {resData?.data.data.filter(i => i.store === selectedStore).map((item) => (
                        <div
                            className ='border-b-3 border-[#e3d1b9]'
                            key={item._id}
                            onClick={() => setItemName(itemName === item._id ? 'all' : item._id)}
                            style={{
                                cursor: 'pointer',
                                // border: itemName === item._id ? '2px solid #e3d1b9' : 'none',
                                borderRadius: '8px',
                                padding: '6px',
                                background: '#fff',
                                marginBottom: '8px',
                            
                                height: "130px",
                                boxShadow: '0 2px 8px #e3d1b9'
                            }}    // #eab308
                        >
                            <div className ='flex items-center justify-between gap-1'>
                                <button
                                    className='w-5 h-5 flex justify-center items-center text-xs font-medium rounded-full 
                                    p-1 text-white'
                                    style={{ backgroundColor: getBgColor() }}
                                >
                                    {getAvatarName(item.storeitemName)}
                                </button> 
                                <h3 style={{ fontWeight: 'semibold', color: '#1a1a1a' }} className ='text-xs font-semibold'>
                                    {item.storeitemName}</h3>
                            </div>
                            
                           
                           
                            <div className ='flex flex-col gap-1 mt-5'>
                                {/* text-amber-900 */}
                                <span className ='text-xs font-medium text-emerald-600'>{item.store}</span>
                                <span style={{ color: '#0ea5e9' }} className ='text-xs font-normal'>{item.storeCategory}</span>
                            </div>
                            {/* Add more fields if you want */}
                            <div className ='flex justify-between gap-1 mt-2 items-center'>
                                <span className ='text-[#1a1a1a] font-normal text-xs'>Balance : </span>
                                <p className ='text-[#0ea5e9] text-xs font-medium'><span className ='underline'>{item.quantity}</span>
                                    <span className ='text-[#1a1a1a] text-xs font-normal'> {item.unit}</span>
                                </p>
                            </div>

                            {/* <div className='flex justify-center items-center w-full mt-5'>
                                <button
                                    className='w-12 h-12 flex justify-center items-center text-sm font-bold rounded-full text-white'
                                    style={{ backgroundColor: getBgColor() }}
                                >
                                    {getAvatarName(item.storeitemName)}
                                </button>
                            </div> */}

                        </div>
                    ))}

                </div>

            </div>


            <div className='flex-[45%] bg-white h-[100vh] overflow-y-scroll scrollbar-hidden shadow-xl'>
               
                <div className='mt-5' >
                    <div className='overflow-x-auto mx-1'>
                        <table className='w-[100%] text-left w-full' >
                            <thead>
                                <tr className ='bg-white border-b-2 border-yellow-700 text-[#1a1a1a] text-xs font-normal'>
                                    <th className='p-1'></th>


                                    <th className='p-1'>Type</th>
                                    <th className='p-1'>Store</th>
                                    <th className='p-1'>Details</th>
                                    <th className='p-1'>Qte</th>
                                    <th className='p-1'>Before</th>
                                    <th className='p-1'>After</th>
                                    <th className='p-1'></th>
                                 

                                    <th className='p-1'>Exc.Total</th>
                                    <th className='p-1'>Rec.Total</th>

                                </tr>
                            </thead>

                            <tbody>
                                {allInvoices.length === 0 ? (
                                    <tr className ='border-b-3 border-[#f5f5f5] text-xs font-normal text-[#1a1a1a] 
                                        hover:bg-[#F1E8D9] cursor-pointer'>
                                        <td colSpan="5" className='ml-5 mt-5 text-xs text-[#be3e3f] flex items-start justify-start'>
                                            Your invoices list is empty.
                                        </td>
                                    </tr>
                                ) : allInvoices.map((invoice, index) => {
                                    // Filter items in the invoice if itemName is set
                                    const filteredItems = itemName === 'all'
                                        ? invoice.items
                                        : invoice.items.filter(item => item._id === itemName);

                                    return filteredItems.length > 0 ? (
                                        filteredItems.map((item, itemIndex) => (
                                            <tr key={`${index}-${itemIndex}`} className='border-b-3 border-[#f5f5f5] text-xs font-normal text-[#1a1a1a] 
                                        hover:bg-[#F1E8D9] cursor-pointer'>
                                                <td className='p-1' hidden>{invoice._id}</td>
                                                <td className='p-1'>{new Date(invoice.date).toLocaleDateString('en-GB')}</td>
                                                <td className={`p-1 ${invoice.storeinvoiceType === 'receipt' ? 'text-[#0ea5e9]' : 'text-green-600'}`}>
                                                    {invoice.storeinvoiceType}
                                                </td>
                                                <td className='p-1 w-full'>{item.store}</td>
                                                <td className='p-1'>{item.name}</td>
                                                <td className='p-1'>{item.qty}</td>
                                                <td className='p-1'>{item.quantityBefore}</td>
                                                <td className='p-1 text-[#0ea5e9] underline'>{item.quantityAfter}</td>
                                                <td className='p-1'>{item.unit}</td>
                                               
                                                {/* <td className='py-2 px-1'>{invoice.bills.total}
                                                    <span className='text-xs font-normal'> AED</span>
                                                </td> */}
                                               
                                                <td className='p-1 text-green-600'>
                                                    {invoice.exchangeBills && invoice.exchangeBills.total !== undefined
                                                        ? invoice.exchangeBills.total
                                                        : '-'}
                                                    <span className='text-xs font-normal text-[#1a1a1a]'> AED</span>
                                                </td>
                                                <td className='p-1 text-green-600'>
                                                    {invoice.receiptBills && invoice.receiptBills.total !== undefined
                                                        ? invoice.receiptBills.total
                                                        : '-'}
                                                    <span className='text-xs font-normal text-[#1a1a1a]'> AED</span>
                                                </td>
                                           
                                            </tr>
                                        ))
                                    ) : (
                                            

                                            <tr key={index} className='border-b-3 border-[#f5f5f5] text-xs font-normal text-[#1a1a1a] 
                                        hover:bg-[#F1E8D9] cursor-pointer'>
                                                <td className='p-1' hidden>{invoice._id}</td>
                                                <td className='p-1 text-xs'>{new Date(invoice.date).toLocaleDateString('en-GB')}</td>
                                                <td className='p-1'>{invoice.storeinvoiceType}</td>
                                              
                                                {itemName !== 'all' ? (() => {
                                                    // Try to find the item details from the invoice's items array
                                                    const itemInInvoice = invoice.items.find(i => i.id === itemName);
                                                    // Or, if not found, fallback to the global items list
                                                    const found = itemInInvoice || resData?.data?.data?.find(i => i._id === itemName);
                                                    return found ? (
                                                        <>
                                                            <td className='p-1'>{found.store}</td>
                                                            <td className='p-1'>{found.name}</td>
                                                          
                                                            <td className='p-1'>{itemInInvoice ? itemInInvoice.qty : '-'}</td>
                                                            <td className='p-1'>{itemInInvoice ? itemInInvoice.quantityBefore : '-'}</td>
                                                            <td className='p-1 text-[#0ea5e9] underline'>{itemInInvoice ? itemInInvoice.quantityAfter : '-'}</td>
                                                            
                                                            <td className='p-1'>{found.unit || ''}</td>
                                                            {/* <td className='p-2'>{invoice.bills.total}
                                                                <span className='text-xs font-normal'> AED</span>
                                                            </td> */}


                                                            <td className='p-1'>
                                                                {invoice.exchangeBills && invoice.exchangeBills.total !== undefined
                                                                    ? invoice.exchangeBills.total
                                                                    : '-'}
                                                                <span className='text-xs font-normal'> AED</span>
                                                            </td>
                                                            <td className='p-1'>
                                                                {invoice.receiptBills && invoice.receiptBills.total !== undefined
                                                                    ? invoice.receiptBills.total
                                                                    : '-'}
                                                                <span className='text-xs font-normal'> AED</span>
                                                            </td>


                                                        </>
                                                    ) : (
                                                        <td className='p-1' colSpan="7">{itemName}</td>
                                                    );
                                                })() : (
                                                    <td className='p-1' colSpan="7">No items</td>
                                                )}


                                            </tr>
                                    );
                                })}
                            </tbody>

                            <tfoot>
                                <tr className='bg-[#F1E8D9] border-t-2 border-emerald-600 text-xs font-semibold text-[#1a1a1a]'>
                                    <td className='p-1' colSpan="4">Totals : </td>
                                    <td className='p-1'>
                                        {allInvoices.reduce((sum, invoice) => {
                                            const items = itemName === 'all'
                                                ? invoice.items
                                                : invoice.items.filter(item => item.id === itemName);
                                            // return sum + items.reduce((itemSum, item) => itemSum + (item.qty || 0), 0);
                                            return sum + items.reduce((itemSum, item) => itemSum + Number(item.qty) || 0, 0);
                                        }, 0)}
                                    </td>
                                    {/* <td className='p-2'>
                                        {allInvoices.reduce((sum, invoice) => {
                                            const items = itemName === 'all'
                                                ? invoice.items
                                                : invoice.items.filter(item => item._id === itemName);
                                            return sum + items.reduce((itemSum, item) => itemSum + (item.quantityBefore || 0), 0);
                                        }, 0)}
                                    </td>
                                    <td className='p-2 text-[#0ea5e9] underline'>
                                        {allInvoices.reduce((sum, invoice) => {
                                            const items = itemName === 'all'
                                                ? invoice.items
                                                : invoice.items.filter(item => item._id === itemName);
                                            return sum + items.reduce((itemSum, item) => itemSum + (item.quantityAfter || 0), 0);
                                        }, 0)}
                                    </td> */}
                                    <td className='p-1'></td>
                                    <td className='p-1'></td>
                                    <td className='p-1'></td>
                                   
                                    {/* <td className='p-2'>
                                        {allInvoices.reduce((sum, invoice) => sum + Number(invoice.bills?.total) || 0, 0)}
                                        <span className='text-xs font-normal'> AED</span>
                                    </td> */}
                                   
                                    <td className='py-2 px-1 w-full text-xs font-normal text-sky-600'>
                                        {allInvoices.reduce((sum, invoice) => sum + Number(invoice.exchangeBills?.total || 0), 0)}
                                        {/* <span className='text-xs font-normal text-[#1a1a1a]'> AED</span> */}
                                    </td>
                                    <td className='py-2 px-1 w-full'>
                                        {allInvoices.reduce((sum, invoice) => sum + Number(invoice.receiptBills?.total) || 0, 0)}
                                        {/* <span className='text-xs font-normal'> AED</span> */}
                                    </td>
                                </tr>
                            </tfoot>

                            
                            {/* Tfoot depent on function called totals up */}
                            {/* <tfoot>
                                <tr className='bg-[#F5F5DC] font-bold text-xs'>
                                    <td className='p-2' colSpan="4">Totals</td>
                                    <td className='p-2'>{totals.qty}</td>
                                    <td className='p-2'>{totals.qtyBefore}</td>
                                    <td className='p-2 text-[#0ea5e9] underline'>{totals.qtyAfter}</td>
                                    <td className='p-2'></td>
                                    <td className='p-2'>
                                        {totals.billsTotal}
                                        <span className='text-xs font-normal'> AED</span>
                                    </td>
                                    <td className='py-2 px-1'>
                                        {totals.exchangeTotal}
                                        <span className='text-xs font-normal'> AED</span>
                                    </td>
                                    <td className='py-2 px-1'>
                                        {totals.receiptTotal}
                                        <span className='text-xs font-normal'> AED</span>
                                    </td>
                                </tr>
                            </tfoot> */}


                           


                        </table>

                    </div>




                </div>

            </div>
            <div className='flex-[20%] bg-white h-[calc(100vh)] overflow-y-scroll scrollbar-hidden shadow-xl'>

                <div className='h-[50%] flex  flex-col items-start gap-4 justify-start p-2 px-1 bg-white overflow-y-scroll'>

                    <p className='text-sky-600 underline text-sm font-semibold'>Exchange Items :</p>

                    {list.map((items) => {
                        const amount = allInvoices.filter((invoice) =>

                            invoice.storeinvoiceType === "exchange" && invoice.items.some(item => item.name === items.storeitemName))
                            .reduce((acc, invoice) => acc + invoice.bills.total, 0);

                        return (

                            amount > 0 && (
                                <div className='shadow-lg/30 bg-white p-1 w-full'>
                                    <h5 className='text-xs text-green-600 font-medium'>{items.storeitemName}</h5>

                                    <Flex gap="small text-green-600" vertical style={{ width:219 }}>
                                        <Progress type='line' strokeColor={twoColors} percent={((amount / totalSaleTurnover) * 100).toFixed(0)} />
                                    </Flex>
                                </div>
                            )
                        )

                    })}

                </div>



                <hr className='m-3 border-t-5 border-zinc-200' />

                <div className='h-[50%] flex flex-col items-start gap-4 justify-start p-2 px-1 bg-white overflow-y-scroll'>
                    <p className='text-blue-600 underline text-sm font-semibold'>Receipt Items :</p>

                    {list.map((items) => {
                        const amount = allInvoices.filter((invoice) =>

                            invoice.storeinvoiceType === "receipt" && invoice.items.some(item => item.name === items.storeitemName))

                            .reduce((acc, invoice) => acc + invoice.bills.total, 0);
                        /////////////////

                        return (

                            amount > 0 && (
                                <div className='shadow-lg/30 bg-white p-1 w-full'>
                                    <h5 className='text-xs text-green-600 font-medium'>{items.storeitemName}</h5>

                                    <Flex gap="small text-green-600" vertical style={{ width: 219 }}>
                                        <Progress type='line' strokeColor={conicColors} percent={((amount / totalBuyTurnover) * 100).toFixed(0)} />
                                    </Flex>
                                </div>

                            )
                        )

                    })}
                </div>

            </div>

        </section>


    );
};



export default StoresInventory;