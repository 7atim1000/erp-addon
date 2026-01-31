import React , {useState, useEffect, useRef} from 'react'
import BackButton from '../components/shared/BackButton';

import { Progress, Flex } from 'antd'
import { api } from '../https';
import InvoicesDetails from '../components/storesinvoices/InvoicesDetails';


const StoresInvoices = () => {

    // fetch Invoices
    const [allInvoices, setAllInvoices] = useState([]);

    // filter by date
    const [frequency, setFrequency] = useState('30')
    const [storeinvoiceStatus, setStoreinvoiceStatus] = useState('all')
    const [shift, setShift] = useState('all')


    useEffect(() => {

        const getStoresInvocies = async () => {
            try {

                const res = await api.post('/api/storeinvoice/fetch',
                    {
                        frequency,
                        storeinvoiceStatus,
                        shift
                    });

                setAllInvoices(res.data)
                console.log(res.data)


            } catch (error) {
                console.log(error)
                message.error('Fetch Issue with transaction')

            }
        };

        getStoresInvocies();

    }, [frequency, storeinvoiceStatus, shift]);




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
        (invoice) => invoice.storeinvocieType === "exchange"
    );
    const totalBuyInvoices = allInvoices.filter(
        (invoice) => invoice.storeinvocieType === "receipt" //&& invoice.invoiceStatus === "Completed" 
    );
    const totalIncomePercent = (totalSaleInvoices.length / totalInvoices) * 100;
    const totalExpensePercent = (totalBuyInvoices.length / totalInvoices) * 100;

    // Total amount 
    const totalTurnover = allInvoices.reduce((acc, invoice) => acc + invoice.bills.total, 0);
    const totalSaleTurnover = allInvoices.filter(invoice => invoice.storeinvocieType === 'exchange').reduce((acc, invoice) => acc + invoice.bills.total, 0);

    const totalBuyTurnover = allInvoices.filter(invoice => invoice.storeinvocieType === 'receipt').reduce((acc, invoice) => acc + invoice.bills.total, 0);
    const totalSaleTaxTurnover = allInvoices.filter(invoice => invoice.storeinvocieType === 'exchange').reduce((acc, invoice) => acc + invoice.bills.tax, 0);

    const totalWithTaxBuyTurnover = allInvoices.filter(invoice => invoice.storeinvocieType === 'receipt').reduce((acc, invoice) => acc + invoice.bills.totalWithTax, 0);
    const totalWithTaxSaleTurnover = allInvoices.filter(invoice => invoice.storeinvocieType === 'exchange').reduce((acc, invoice) => acc + invoice.bills.totalWithTax, 0);


    // Percentage
    const totalSaleTurnoverPercent = (totalSaleTurnover / totalTurnover) * 100;
    const totalBuyTurnoverPercent = (totalBuyTurnover / totalTurnover) * 100;




    return (
        <section className ='h-[calc(100vh-5rem)] overflow-y-scrollbar scrollbar-hidden flex'>
            
            <div className='flex-[1] bg-white h-[calc(100vh-5rem)] overflow-y-scroll scrollbar-hidden'>

                <div className='h-[50%] flex  flex-col items-start gap-4 justify-start p-2 px-2 bg-white overflow-y-scroll'>

                    <p className='text-sky-600 underline text-sm font-semibold'>Exchange Items :</p>
                    
                    {list.map((items) => {
                        const amount = allInvoices.filter((invoice) =>
                     
                            invoice.storeinvocieType === "exchange" && invoice.items.some(item => item.name === items.storeitemName))
                            .reduce((acc, invoice) => acc + invoice.bills.total, 0);
                 
                        return (

                            amount > 0 && (
                                <div className='shadow-lg/30 bg-zinc-100 p-1 w-full'>
                                    <h5 className='text-xs text-green-600 font-medium'>{items.storeitemName}</h5>

                                    <Flex gap="small text-green-600" vertical style={{ width: 345 }}>
                                        <Progress type='line' strokeColor={twoColors} percent={((amount / totalSaleTurnover) * 100).toFixed(0)} />
                                    </Flex>
                                </div>
                            )
                        )

                    })}

                </div>



                <hr className='m-3 border-t border-zinc-200' />

                <div className='h-[50%] flex flex-col items-start gap-4 justify-start p-2 px-2 bg-white overflow-y-scroll'>
                    <p className='text-blue-600 underline text-sm font-semibold'>Receipt Items :</p>
                   
                    {list.map((items) => {
                        const amount = allInvoices.filter((invoice) =>
                     
                            invoice.storeinvocieType === "receipt" && invoice.items.some(item => item.name === items.storeitemName))

                            .reduce((acc, invoice) => acc + invoice.bills.total, 0);
                        /////////////////

                        return (

                            amount > 0 && (
                                <div className='shadow-lg/30 bg-zinc-100 p-1 w-full'>
                                    <h5 className='text-xs text-green-600 font-medium'>{items.storeitemName}</h5>

                                    <Flex gap="small text-green-600" vertical style={{ width: 345 }}>
                                        <Progress type='line' strokeColor={conicColors} percent={((amount / totalBuyTurnover) * 100).toFixed(0)} />
                                    </Flex>
                                </div>

                            )
                        )

                    })}
                </div>

            </div>


            <div className='flex-[4] h-[calc(100vh-5rem)] overflow-y-scroll scrollbar-hidden bg-white shadow-xl py-2'>

                <div className='flex items-center justify-between px-10 py-1'>

                    <div className='flex gap-4 justify-between items-center'>
                        <BackButton />
                        <h1 className='text-[#1a1a1a] text-l font-bold'>Invoices Management</h1>
                    </div>

                    <div className='flex gap-2 mt-1'>

                        <button className={`${frequency === '30' ? 'bg-[#e3d1b9] text-yellow-700' : 'bg-white text-yellow-700'} p-2 rounded-lg  shadow-lg/30 text-xs font-medium cursor-pointer`}
                            onClick={() => setFrequency('1')}
                        >Today
                        </button>
                        <button className={`${frequency === '30' ? 'bg-[#e3d1b9] text-yellow-700' : 'bg-white text-yellow-700'} p-2 rounded-lg  shadow-lg/30 text-xs font-medium cursor-pointer`}
                            onClick={() => setFrequency('30')}
                        >One Month
                        </button>
                        <button className={`${frequency === '365' ? 'bg-[#e3d1b9] text-yellow-700' : 'bg-white text-yellow-700'} p-2 rounded-lg  shadow-lg/30 text-xs font-medium cursor-pointer`}
                            onClick={() => setFrequency('365')}
                        >One Year
                        </button>


                        {/* <button className={`${storeinvoiceStatus === 'In Progress' ? 'bg-[#e3d1b9] text-yellow-700' : 'bg-white text-yellow-700'} p-2 rounded-lg  shadow-lg/30 text-xs font-medium cursor-pointer`}
                            onClick={() => setStoreinvoiceStatus('In Progress')}
                        >In Progress
                        </button>
                        <button className={`${storeinvoiceStatus === 'Completed' ? 'bg-[#e3d1b9] text-yellow-700' : 'bg-white text-yellow-700'} p-2 rounded-lg  shadow-lg/30 text-xs font-medium cursor-pointer`}
                            onClick={() => setStoreinvoiceStatus('Completed')}
                        >Completed
                        </button> */}


                        <button className={`${shift === 'Morning' ? 'bg-[#e3d1b9] text-yellow-700' : 'bg-white text-yellow-700'} p-2 rounded-lg  shadow-lg/30 text-xs font-medium cursor-pointer`}
                            onClick={() => setShift('Morning')}
                        >Morning
                        </button>

                        <button className={`${shift === 'Evening' ? 'bg-[#e3d1b9] text-yellow-700' : 'bg-white text-yellow-700'} p-2 rounded-lg  shadow-lg/30 text-xs font-medium cursor-pointer`}
                            onClick={() => setShift('Evening')}
                        >Evening
                        </button>

                    </div>

                </div>

                <div className='mt-10'>

                    <div className='overflow-x-auto px-5'>
                        <table className='w-full text-left'>
                            <thead className='bg-white text-xs font-semibold text-yellow-700'>
                                <tr className='border-b-3  border-[#E3D1B9]'>

                                    <th className='p-1'></th>
                                    <th className='p-1 ml-0'></th>
                                    <th className='p-1'></th>
                                    <th className='p-1'>Items</th>
                                    <th className='p-1'>Customer</th>
                                    <th className='p-1'>Supplier</th>

                                    <th className='p-1'>Total</th>
                                    <th className='p-1'></th>

                                </tr>
                            </thead>


                            <tbody>
                                {
                                    allInvoices.length === 0
                                        ? (<p className='p-1 w-50 text-lg text-[#be3e3f] flex justify-center'>Invoices menu is empty!</p>)
                                        : allInvoices.map((invoice) => {

                                            return (
                                                <InvoicesDetails id={invoice._id} date={invoice.date} type={invoice.storeinvocieType} shift={invoice.shift} length={invoice.items.length} 
                                                customer={invoice.customer === null ? 'N/A' : invoice.customerName} supplier={invoice.supplier === null ? 'N/A' : invoice.supplierName} 
                                                total={invoice.bills.total} status={invoice.storeinvoiceStatus} items={invoice.items}
                                                />
                                            )
                                        })
                                }
                            </tbody>


                        </table>

                    </div>

                </div>




            </div>

        </section>
    );
};


export default StoresInvoices ; 