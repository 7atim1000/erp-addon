import React, {useState, useEffect}  from 'react' ;
import BackButton from '../components/shared/BackButton';
import { api, getStores, getStoresItemsInvoice } from '../https';

import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { enqueueSnackbar } from 'notistack'
import { FcSearch } from "react-icons/fc";
import { GrRadialSelected } from 'react-icons/gr';
import { getBgColor } from '../utils';
import InventCart from '../components/inventory/InventCart';

const Inventory = () => {

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
   
    // Storee invoices :-
    const [allInvoices, setAllInvoices] = useState([]);
    
    const [frequency, setFrequency] = useState('30');
    const [storeinvoiceStatus, setStoreinvoiceStatus] = useState('all');
    const [shift, setShift] = useState('all');

    const [itemName, setItemName] = useState(null);
    const [itemStore, setItemStore] = useState(null);


    const [filters, setFilters] = useState({
        frequency: '30',
        storeinvoiceStatus: 'all',
        shift: 'all',
        itemName: '',
        itemStore: ''
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
//  Your useEffect might be running too early or not when expected

// Add a loading state to debug:
    const fetchInvoices = async () => {
        setLoading(true);
        setError(null);

        try {
            // Prepare request body
            const requestBody = {
                frequency: filters.frequency,
                ...(filters.storeinvoiceStatus !== 'all' && { storeinvoiceStatus: filters.storeinvoiceStatus }),
                ...(filters.shift !== 'all' && { shift: filters.shift }),
                ...(filters.itemName && { itemName: filters.itemName }),
                ...(filters.itemStore && { itemStore: filters.itemStore })
            };

            const response = await api.post('/api/storeinvoice/fetch', requestBody);

            if (response.data.success) {
                setAllInvoices(response.data.invoices || response.data.data || []);
            } else {
                throw new Error(response.data.message || 'Failed to fetch invoices');
            }
        } catch (err) {
            console.error('Error fetching invoices:', err);
            setError(err.message || 'An error occurred while fetching data');
            // setInvoices([]);
            setAllInvoices([])
        } finally {
            setLoading(false);
        }
    };

    // Fetch data on component mount and filter changes
    useEffect(() => {
        fetchInvoices();
    }, [filters]);

    // Handle filter changes
    const handleFilterChange = (filterName, value) => {
        setFilters(prev => ({
            ...prev,
            [filterName]: value
        }));
    };

    // Reset all filters
    const resetFilters = () => {
        setFilters({
            frequency: '30',
            storeinvoiceStatus: 'all',
            shift: 'all',
            itemName: '',
            itemStore: ''
        });
    };
   
    // When clicking a store button
    // const handleStoreClick = (storeName) => {

    //     if (selectedStore === storeName) {
    //         // Clicking the already selected store deselects it
    //         setSelectedStore(null);
    //         setItemStore(''); // Reset filter
    //     } else {
    //         setSelectedStore(storeName);
    //         setItemStore(storeName); // Apply filter
    //     }
    // };
   
    return (
       <section className ='h-[calc(100vh)] overfow-y-scroll scrollbar-hidden flex'>
           
          
            <div className='flex-[50%] bg-white h-[calc(100vh)] overflow-y-scroll scrollbar-hidden'>
                
                {/* header */}
                <div className='flex items-center justify-between px-10 py-2 shadow-xl '>

                    <div className='flex gap-4 justify-between items-center'>
                        <BackButton />
                        <h1 className='text-[#1a1a1a] text-l font-bold'>Inventory</h1>
                    </div>

                    <div className='flex gap-2 mt-1'>

                        <button className={`${frequency === '1' ? 'bg-[#e3d1b9] text-yellow-700' : 'bg-white text-yellow-700'} p-2 rounded-lg  shadow-lg/30 text-xs font-medium cursor-pointer`}
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

                    </div>

                </div>
                {/* header */}


                <div className='flex w-full gap-1 justify-start items-start mt-2'>
                    {/* Stores */}
                    <div className='flex-col justify-between w-[15%] bg-white px-1 py-4 shadow-xl/30'>


                        {responseData?.data.data.map(store => (

                            <button className='w-[100%] grid grid-cols-1 p-1 items-center  mb-3 rounded-lg h-[60px] cursor-pointer shadow-lg/30'
                                style={{ backgroundColor: getBgColor() }}
                                // onClick={() => handleStoreClick(store.storeName)}
                            >

                                <div className='flex items-center justify-between w-full shadow-lg/30 px-3'>
                                    <h1 className='text-sm font-semibold text-white'>{store.storeName}</h1>
                                    {selectedStore === store.storeName && <GrRadialSelected className='text-[#e6e6e6]' size={20} />}
                                </div>
                            </button>

                        ))}

                    </div>
                    {/* items */}
                    <div className=' flex flex-col justify-between items-center gap-1 w-full p-2 bg-white shadow-xl/30 '>
                        {/*SEARCH*/}
                        <div className='flex items-center gap-2 bg-white rounded-[20px] px-5 py-1 shadow-lg/30 w-[30%] mb-5'>
                            <FcSearch className='text-sky-600' />

                            <input
                                type='text'
                                placeholder="search"
                                className='bg-transparent outline-none text-[#1a1a1a]  w-full border-b-2 border-[#d2b48c] p-1'

                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className='flex items-start justify-between flex-wrap gap-1 w-full px-2 py-2 rounded-lg overflow-y-scroll scrollbar-hidden  h-[calc(100vh-10rem)]'>

                            {resData?.data.data.filter(i => i.store === selectedStore).map((item) => {

                                return (
                                    <InventCart id={item._id} name={item.storeitemName} store={item.store} cat= {item.storeCategory} />
                                )
                            })
                            }


                        </div>
                    </div>

                </div>

           </div>


            <div className='flex-[30%] h-[calc(100vh)] overflow-y-scroll scrollbar-hidden bg-white shadow-xl py-2'>

                   <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Inventory Management</h1>
            
            {/* Filter Controls */}
            <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                <h2 className="text-lg font-semibold mb-4">Filters</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Frequency Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Time Period</label>
                        <select
                            value={filters.frequency}
                            onChange={(e) => handleFilterChange('frequency', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        >
                            <option value="7">Last 7 Days</option>
                            <option value="30">Last 30 Days</option>
                            <option value="90">Last 90 Days</option>
                        </select>
                    </div>

                    {/* Status Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                            value={filters.storeinvoiceStatus}
                            onChange={(e) => handleFilterChange('storeinvoiceStatus', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        >
                            <option value="all">All Statuses</option>
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>

                    {/* Shift Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Shift</label>
                        <select
                            value={filters.shift}
                            onChange={(e) => handleFilterChange('shift', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        >
                            <option value="all">All Shifts</option>
                            <option value="morning">Morning</option>
                            <option value="afternoon">Afternoon</option>
                            <option value="evening">Evening</option>
                        </select>
                    </div>

                    {/* Item Name Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                        <input
                            type="text"
                            value={filters.itemName}
                            onChange={(e) => handleFilterChange('itemName', e.target.value)}
                            placeholder="Filter by item name"
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>

                    {/* Item Store Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
                        <input
                            type="text"
                            value={filters.itemStore}
                            onChange={(e) => handleFilterChange('itemStore', e.target.value)}
                            placeholder="Filter by store"
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                </div>

                <div className="mt-4">
                    <button
                        onClick={resetFilters}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                    >
                        Reset Filters
                    </button>
                </div>
            </div>

            {/* Loading and Error States */}
            {loading && (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-2">Loading invoices...</p>
                </div>
            )}

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                    {error}
                </div>
            )}

            {/* Invoice Table */}
            {!loading && !error && (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Store</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {allInvoices.length > 0 ? (
                                    invoices.map((invoice, index) => (
                                        <tr key={invoice._id || index} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(invoice.date).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {invoice.storeinvocieType}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {invoice.items?.[0]?.store || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {invoice.items?.[0]?.name || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    invoice.storeinvoiceStatus === 'completed' ? 'bg-green-100 text-green-800' :
                                                    invoice.storeinvoiceStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                    {invoice.storeinvoiceStatus}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                                            No invoices found matching your filters
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
               
            </div>

            <div className='flex-[20%] h-[calc(100vh)] overflow-y-scroll scrollbar-hidden bg-white shadow-xl py-2'>

            </div>
           
           
     


        



       </section>
    );
};



export default Inventory ;



//  <div className='mt-5' >

//                     <div className='overflow-x-auto mx-2'>
//                         <table className='w-[100%] text-left text-[#1a1a1a' >
//                             <thead className='border-b border-[#D2B48C] text-xs font-semibold text-yellow-700 bg-white'>
//                                 <tr>
//                                     <th className='p-1'></th>
                                  

//                                     <th className ='py-2 px-1'>Type</th>
//                                     <th className ='py-2 px-1'>Store</th>
//                                     <th className ='py-2 px-1'>Details</th>
//                                     <th className ='py-2 px-1'>Qte</th>
//                                     <th className ='py-2 px-1'>Before</th>
//                                     <th className ='py-2 px-1'>After</th>
//                                     <th className='py-2 px-1'></th>
//                                     <th className='py-2 px-1'>Total</th>

//                                 </tr>
//                             </thead>

                            {/* Option 1: Display all items (if multiple items per invoice) */}
                            // <tbody>
                            //     {allInvoices.length === 0 ? (
                            //         <tr>
                            //             <td colSpan="5" className='ml-5 mt-5 text-xs text-[#be3e3f] flex items-start justify-start'>
                            //                 Your invoices list is empty.
                            //             </td>
                            //         </tr>
                            //     ) : allInvoices.map((invoice, index) => (
                            //         invoice.items.length > 0 ? (
                            //             invoice.items.map((item, itemIndex) => (
                            //                 <tr key={`${index}-${itemIndex}`} className='border-b border-[#D2B48C] text-xs font-semibold'>
                                               
                            //                     <td className ='py-2 px-1' hidden>{invoice._id}</td>
                                         
                            //                     <td className ='py-2 px-1'>{new Date(invoice.date).toLocaleDateString('en-GB')}</td>
                                            
                            //                     <td className ='py-2 px-1'>{invoice.storeinvocieType}</td>
                            //                     <td className ='py-2 px-1'>{item.store}</td>
                            //                     <td className ='py-2 px-1'>{item.name}</td>
                            //                     <td className ='py-2 px-1'>{item.qty}</td>
                            //                     <td className ='py-2 px-1'>{item.quantityBefore}</td>
                            //                     <td className ='py-2 px-1'>{item.quantityAfter}</td>
                            //                     <td className ='py-2 px-1'>{item.unit}</td>
                            //                     <td className ='py-2 px-1'>{invoice.bills.total}
                            //                         <span className ='text-xs font-normal'> AED</span>
                            //                     </td>
                            //                 </tr>
                            //             ))
                            //         ) : (
                            //             <tr key={index} className='border-b border-[#D2B48C] text-xs font-semibold'>
                            //                 <td className='p-2' hidden>{invoice._id}</td>
                            //                 <td className='p-2'>{new Date(invoice.date).toLocaleDateString('en-GB')}</td>
                            //                 <td className='p-2'>{invoice.storeinvocieType}</td>
                            //                 <td className='p-2' colSpan="2">No items</td>
                            //             </tr>
                            //         )
                            //     ))}
                            // </tbody>

                            








                            {/* Option 2: Display only the first item (if single item per invoice is typical) */}
                            {/* <tbody>
                                {allInvoices.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className='ml-5 mt-5 text-xs text-[#be3e3f] flex items-start justify-start'>
                                            Your invoices list is empty.
                                        </td>
                                    </tr>
                                ) : allInvoices.map((invoice, index) => (
                                    <tr key={index} className='border-b border-[#D2B48C] text-xs font-semibold'>
                                        <td className='p-2' hidden>{invoice._id}</td>
                                        <td className='p-2'>{new Date(invoice.date).toLocaleDateString('en-GB')}</td>
                                        <td className='p-2'>{invoice.storeinvocieType}</td>
                                        <td className='p-2'>
                                            {invoice.items.length > 0 ? invoice.items[0].store : 'N/A'}
                                        </td>
                                        <td className='p-2'>
                                            {invoice.items.length > 0 ? invoice.items[0].name : 'N/A'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody> */}



                //         </table>

                //     </div>
                // </div>
