import React, { useState, useEffect } from 'react'
import BackButton from '../components/shared/BackButton'
import { useSelector } from 'react-redux'
import { FaShoppingCart, FaBox, FaFilter, FaSearch } from "react-icons/fa";
import { FaCircleUser } from "react-icons/fa6";
import SupplierInfo from '../components/buy/supplierInfo';
import BuyBills from '../components/buy/BuyBills';
import { IoMdArrowDropleft } from "react-icons/io";
import SelectSupplier from '../components/buy/SelectSupplier';
import { ImUserPlus } from "react-icons/im";
import SupplierAdd from '../components/suppliers/SupplierAdd';
import { getCategories, getServices } from '../https';
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { enqueueSnackbar } from 'notistack'
import { getBgColor } from '../utils'
import { GrRadialSelected } from 'react-icons/gr';
import { IoMdArrowDropupCircle } from "react-icons/io";
import { IoMdArrowDropdownCircle } from "react-icons/io";
import { BsFillCartCheckFill } from "react-icons/bs";
import { addItems } from '../redux/slices/buySlice';
import {useDispatch} from 'react-redux';
import { toast } from 'react-toastify'
import BuyCartInfo from '../components/buy/BuyCartInfo';

const Buy = () => {
    // to fetch supplier name from supplier Modal 
    const supplierData = useSelector(state => state.supplier);
    const userData = useSelector(state => state.user);

    const buyBtn = [{ label: "Select Supplier", action: 'buy'}];
    
    const [isSelectSupplierModalOpen, setIsSelectSupplierModalOpen] = useState(false);
    const handleSupplierModalOpen = (action) => {
        if (action === 'buy') setIsSelectSupplierModalOpen(true)
    }

    // Add new Supplier
    const addSuppButton = [
        { label: '', icon: <ImUserPlus className='text-white' size={18} />, action: 'supplier' }
    ];

    const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
    const handleAddSupplierModal = (action) => {
        if (action === 'supplier') setIsSupplierModalOpen(true);
    };

    // Menu container 
    // fetch categories from DB :-
    const { data: responseData, IsError } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            return await getCategories();
        },
        placeholderData: keepPreviousData,
    });

    if (IsError) {
        enqueueSnackbar('Something went wrong!', { variant: 'error' });
    };

    const [services, setServices] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [pagination, setPagination] = useState({});

    const fetchServices = async (filters = {}) => {
        try {
            const response = await getServices({
                category: filters.category || 'all',
                search: filters.search || '',
                sort: filters.sort || '-createdAt',
                page: filters.page || 1,
                limit: filters.limit || 10
            });
            setServices(response.data.data || response.data.services);
            setPagination(response.data.pagination);
        } catch (error) {
            console.error(error);
        }
    };

    // Fetch services when category changes
    useEffect(() => {
        fetchServices({
            category: selectedCategory === 'all' ? '' : selectedCategory,
            page: 1
        });
    }, [selectedCategory]);

    // Increment and decrement functions
    const [selectedService, setSelectedService] = useState(null);
    const [quantities, setQuantities] = useState({});

    const increment = () => {
        if (!selectedService) return;

        setQuantities(prev => ({
            ...prev,
            [selectedService._id]: (prev[selectedService._id] || 1) + 1
        }));
    }

    const decrement = () => {
        if (!selectedService || !quantities[selectedService._id] || quantities[selectedService._id] <= 1) return;

        setQuantities(prev => ({
            ...prev,
            [selectedService._id]: prev[selectedService._id] - 1
        }));
    }

    const handleServiceChange = (e) => {
        const selectedServiceName = e.target.value;
        const service = services.find(s => s.serviceName === selectedServiceName);
        setSelectedService(service || null);
    }

    const getCurrentQuantity = () => {
        if (!selectedService) return 1;
        return quantities[selectedService._id] || 1;
    };

    const dispatch = useDispatch();
    const handleAddToCart = (item) => {
        const { id, name, price, qty, unit } = item;
        const currentQuantity = quantities[item.id] || 1;
        if (currentQuantity === 0) {
            toast.warning('Please specify the required quantity.');
            return;
        }
       
        if (currentQuantity > 0 ) {
            const newObj = { 
                id: id, 
                name, 
                pricePerQuantity: price, 
                quantity: currentQuantity, 
                price: price * currentQuantity 
            };
            
            dispatch(addItems(newObj));

            setSelectedService(null);
            fetchServices({ category: selectedCategory === 'all' ? '' : selectedCategory, page: 1 })
        }

        return;
    }

    return (
        <section className='min-h-screen bg-gradient-to-br from-blue-50 to-white p-3 md:p-4 lg:p-1'>
            <div className='max-w-7xl mx-auto'>
                {/* Header Section */}
                <div className='bg-white rounded-xl shadow-lg mb-2 overflow-hidden border border-blue-100'>
                    <div className='flex flex-col md:flex-row justify-between items-start md:items-center p-4 md:p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white'>
                        <div className='flex items-center gap-3 mb-4 md:mb-0'>
                            <BackButton className="text-white" />
                            <div className='flex items-center gap-3'>
                                <div className='bg-white/20 p-2 rounded-lg'>
                                    <FaShoppingCart className='text-white w-5 h-5' />
                                </div>
                                <div>
                                    <h1 className='text-lg md:text-xl font-bold'>Purchase Invoices</h1>
                                    <p className='text-blue-100 text-sm'>Manage and track purchase operations</p>
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto'>
                            <div className='flex items-center gap-3 bg-white/10 px-4 py-2 rounded-lg'>
                                <FaCircleUser className='h-5 w-5 text-blue-200'/>
                                <div className='flex flex-col sm:flex-row sm:items-center gap-2'>
                                    <div className='flex items-center gap-1'>
                                        <p className='text-sm font-medium text-blue-100'>
                                            Supplier:
                                        </p>
                                        <p className='text-sm font-bold text-white'>
                                            {supplierData.supplierName || 'Supplier Name'}
                                        </p>
                                    </div>
                                    
                                    <div className='flex items-center gap-1'>
                                        <p className='text-sm font-medium text-blue-100'>
                                            Balance:
                                        </p>
                                        <p className={`text-sm font-bold ${supplierData.balance === 0 ? 'text-green-200' : 'text-red-200'}`}>
                                            {(Number(supplierData.balance) || 0).toFixed(2)}
                                            <span className='text-blue-100 font-normal'> AED</span>
                                        </p>  
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleAddSupplierModal('supplier')}
                                    className='p-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition duration-150 cursor-pointer'
                                    title="Add New Supplier"
                                >
                                    <ImUserPlus size={18} />
                                </button>
                            </div>

                            <button 
                                onClick={() => handleSupplierModalOpen('buy')}
                                className='flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition duration-200 cursor-pointer'
                            >
                                <p className='text-sm'>Select Supplier</p>
                                <IoMdArrowDropleft className='text-white' size={18}/>
                            </button>
                        </div>
                    </div>
                </div>
                
                {/* Main Content Grid */}
                <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
                    {/* Left Column - Categories */}
                    <div className='lg:col-span-1'>
                        <div className='bg-white rounded-xl shadow-lg border border-blue-100 p-4 sticky top-6'>
                            <div className='flex items-center gap-2 mb-4'>
                                <FaFilter className='text-blue-600 w-5 h-5' />
                                <h3 className='text-sm font-semibold text-blue-800'>Categories</h3>
                            </div>
                            
                            <div className='space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto pr-2'>
                                <button
                                    className='w-full flex items-center justify-between p-3 rounded-lg transition duration-200 cursor-pointer'
                                    style={{ 
                                        backgroundColor: selectedCategory === 'all' ? getBgColor() : '#f3f4f6',
                                        color: selectedCategory === 'all' ? 'white' : '#374151'
                                    }}
                                    onClick={() => setSelectedCategory('all')}
                                >
                                    <div className='flex items-center gap-2'>
                                        <FaBox className={`w-4 h-4 ${selectedCategory === 'all' ? 'text-white' : 'text-gray-400'}`} />
                                        <span className='text-sm font-medium'>All Categories</span>
                                    </div>
                                    {selectedCategory === 'all' && <GrRadialSelected className='text-white' size={20} />}
                                </button>

                                {responseData?.data.data.map(category => (
                                    <button
                                        key={category._id}
                                        className='w-full flex items-center justify-between p-3 rounded-lg transition duration-200 cursor-pointer hover:bg-blue-50'
                                        style={{ 
                                            backgroundColor: selectedCategory === category.categoryName ? getBgColor() : '#f3f4f6',
                                            color: selectedCategory === category.categoryName ? 'white' : '#374151'
                                        }}
                                        onClick={() => setSelectedCategory(category.categoryName)}
                                    >
                                        <div className='flex items-center gap-2'>
                                            <div className={`w-2 h-2 rounded-full ${selectedCategory === category.categoryName ? 'bg-white' : 'bg-blue-500'}`}></div>
                                            <span className='text-sm font-medium truncate'>{category.categoryName}</span>
                                        </div>
                                        {selectedCategory === category.categoryName && <GrRadialSelected className='text-white' size={20} />}
                                    </button>
                                ))}
                            </div>

                            {/* Categories Count */}
                            <div className='mt-4 pt-4 border-t border-blue-100'>
                                <div className='flex items-center justify-between'>
                                    <span className='text-xs text-gray-500'>Categories Count</span>
                                    <span className='text-sm font-semibold text-blue-700'>
                                        {responseData?.data.data.length || 0}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className='mt-6 bg-gradient-to-r from-blue-50 to-emerald-50 rounded-xl p-4 border border-blue-100'>
                            <div className='flex items-center gap-2 mb-3'>
                                <div className='bg-blue-100 p-2 rounded-lg'>
                                    <FaSearch className='text-blue-600 w-5 h-5' />
                                </div>
                                <h4 className='text-sm font-semibold text-blue-800'>Quick Tips</h4>
                            </div>
                            <ul className='space-y-2 text-xs text-gray-600'>
                                <li className='flex items-start gap-2'>
                                    <div className='w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5'></div>
                                    <span>Select category to view available items</span>
                                </li>
                                <li className='flex items-start gap-2'>
                                    <div className='w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5'></div>
                                    <span>Adjust quantity then add to cart</span>
                                </li>
                                <li className='flex items-start gap-2'>
                                    <div className='w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5'></div>
                                    <span>Make sure to select supplier before confirmation</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Middle Column - Items Selection */}
                    <div className='lg:col-span-2 space-y-6'>
                        {/* Item Selection Card */}
                        <div className='bg-white rounded-xl shadow-lg p-5 border border-blue-100'>
                            <h2 className='text-blue-800 font-semibold mb-4 text-sm flex items-center gap-2'>
                                <FaBox className="text-blue-600 w-4 h-4" />
                                Select Item for Purchase
                            </h2>
                            
                            <div className='flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6'>
                                <label className='text-sm font-medium text-gray-700 whitespace-nowrap'>Item Name:</label>
                                <div className='relative flex-1'>
                                    <select
                                        className='w-full bg-white border border-blue-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer'
                                        required
                                        onChange={handleServiceChange}
                                        value={selectedService?.serviceName || ''}
                                    >
                                        <option value="">Select item to purchase...</option>
                                        {services.map((service, index) => (
                                            <option
                                                key={index}
                                                value={service.serviceName}
                                                className='text-sm'
                                            >
                                                {service.serviceName}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute right-3 top-2.5 text-blue-500 pointer-events-none">
                                        ▼
                                    </div>
                                </div>
                            </div>

                            {selectedService && (
                                <div className='bg-gradient-to-r from-blue-50 to-white rounded-xl p-4 border border-blue-200'>
                                    <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
                                        <div className='flex-1'>
                                            <h3 className='text-lg font-bold text-blue-800 mb-2'>{selectedService.serviceName}</h3>
                                            <div className='grid grid-cols-2 gap-4'>
                                                <div className='bg-white p-3 rounded-lg border border-blue-100'>
                                                    <p className='text-xs text-gray-500 mb-1'>Purchase Price</p>
                                                    <p className='text-lg font-bold text-blue-600'>
                                                        {selectedService.buyingPrice}
                                                        <span className='text-sm text-gray-500'> AED</span>
                                                    </p>
                                                </div>
                                                <div className='bg-white p-3 rounded-lg border border-blue-100'>
                                                    <p className='text-xs text-gray-500 mb-1'>Available Quantity</p>
                                                    <p className='text-lg font-bold text-green-600'>
                                                        {selectedService.qty}
                                                        <span className='text-sm text-gray-500'> {selectedService.unit}</span>
                                                    </p>
                                                </div>
                                            </div>
                                            
                                            {selectedService.category && (
                                                <div className='mt-3'>
                                                    <span className='text-xs text-gray-500'>Category:</span>
                                                    <span className='text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded ml-2'>
                                                        {selectedService.category}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div className='flex flex-col items-center gap-4'>
                                            <div className='flex items-center gap-4 bg-white px-4 py-2 rounded-lg border border-blue-200 shadow-sm'>
                                                <button
                                                    onClick={decrement}
                                                    className='text-red-500 hover:text-red-600 cursor-pointer transition duration-200'
                                                >
                                                    <IoMdArrowDropdownCircle className='w-6 h-6'/>
                                                </button>

                                                <span className='text-2xl font-bold text-blue-700 w-8 text-center'>
                                                    {getCurrentQuantity()}
                                                </span>

                                                <button
                                                    onClick={increment}
                                                    className='text-blue-600 hover:text-blue-700 cursor-pointer transition duration-200'
                                                >
                                                    <IoMdArrowDropupCircle className='w-6 h-6'/>
                                                </button>
                                            </div>

                                            <button 
                                                onClick={() => handleAddToCart({
                                                    id: selectedService._id,
                                                    name: selectedService.serviceName,
                                                    price: selectedService.buyingPrice,
                                                    qty: selectedService.qty,
                                                    unit: selectedService.unit,
                                                    cat: selectedService.category
                                                })}
                                                className='bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 transition duration-200 cursor-pointer shadow-md'
                                            >
                                                <BsFillCartCheckFill className='text-white' size={18} />
                                                <span className='font-medium'>Add to Cart</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Cart Information */}
                        <div className='bg-white rounded-xl shadow-lg border border-blue-100'>
                            <BuyCartInfo />
                        </div>
                    </div>

                    {/* Right Column - Cart & Supplier Info */}
                    <div className='lg:col-span-1 space-y-6'>
                        <div className='bg-white rounded-xl shadow-lg border border-blue-100'>
                            <SupplierInfo />
                        </div>
                        
                        <div className='bg-white rounded-xl shadow-lg border border-blue-100'>
                            <BuyBills 
                                fetchServices={fetchServices} 
                                selectedCategory={selectedCategory}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {isSelectSupplierModalOpen && 
                <SelectSupplier 
                    setIsSelectSupplierModalOpen={setIsSelectSupplierModalOpen}
                />
            }

            {isSupplierModalOpen && 
                <SupplierAdd 
                    setIsSupplierModalOpen={setIsSupplierModalOpen} 
                />
            }
        </section>
    );
}

export default Buy;
// import React, { useState, useEffect } from 'react'

// import BackButton from '../components/shared/BackButton'
// import { useSelector } from 'react-redux'
// import { FaCircleUser } from "react-icons/fa6";
// import BuyMenuContainer from '../components/buy/BuyMenuContainer';
// import SupplierInfo from '../components/buy/supplierInfo';
// import BuyCartInfo from '../components/buy/BuyCartInfo';
// import BuyBills from '../components/buy/BuyBills';
// import { IoMdArrowDropright } from "react-icons/io";
// import SelectSupplier from '../components/buy/SelectSupplier';
// import { ImUserPlus } from "react-icons/im";
// import SupplierAdd from '../components/suppliers/SupplierAdd';

// import { getCategories, getServices } from '../https';
// import { keepPreviousData, useQuery } from '@tanstack/react-query'
// import { enqueueSnackbar } from 'notistack'
// import { getBgColor } from '../utils'
// import { GrRadialSelected } from 'react-icons/gr';

// import { IoMdArrowDropupCircle } from "react-icons/io";
// import { IoMdArrowDropdownCircle } from "react-icons/io";
// import { BsFillCartCheckFill } from "react-icons/bs";
// import { addItems } from '../redux/slices/buySlice';
// import {useDispatch} from 'react-redux';
// import { toast } from 'react-toastify'

// const Buy = () => {
//     // to fetch customer name from customer Modal 
//     const supplierData = useSelector(state => state.supplier);
//     const userData = useSelector(state => state.user);

//     const buyBtn = [{ label: "Select Supplier", action: 'buy'}];
    
//     const [isSelectSupplierModalOpen, setIsSelectSupplierModalOpen] = useState(false);
//     const handleSupplierModalOpen = (action) => {
//         if (action === 'buy') setIsSelectSupplierModalOpen(true)
//     }

//     // Add new Supplier
//     const addSuppButton = [
//         { label: '', icon: <ImUserPlus className='text-[#0ea5e9]' size={20} />, action: 'supplier' }
//     ];

//     const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);
//     const handleAddSupplierModal = (action) => {
//         if (action === 'supplier') setIsSupplierModalOpen(true);
//     };

//     // Menu container 
//     // fetch categories from DB :-
//     const { data: responseData, IsError } = useQuery({
//         queryKey: ['categories'],
//         queryFn: async () => {
//             return await getCategories();
//         },
//         placeholderData: keepPreviousData,
//     });

//     if (IsError) {
//         enqueueSnackbar('Something went wrong!', { variant: 'error' });
//     };

//     const [services, setServices] = useState([]);
//     const [selectedCategory, setSelectedCategory] = useState('all');
//     const [pagination, setPagination] = useState({});

//     const fetchServices = async (filters = {}) => {
//         try {
//             const response = await getServices({
//                 category: filters.category || 'all',
//                 search: filters.search || '',
//                 sort: filters.sort || '-createdAt',
//                 page: filters.page || 1,
//                 limit: filters.limit || 10
//             });
//             setServices(response.data.data || response.data.services);
//             setPagination(response.data.pagination);
//         } catch (error) {
//             console.error(error);
//         }
//     };

//     // Fetch services when category changes
//     useEffect(() => {
//         fetchServices({
//             category: selectedCategory === 'all' ? '' : selectedCategory,
//             page: 1 // Reset to first page when category changes
//         });
//     }, [selectedCategory]);

//     // Increment and decrement functions
//     const [selectedService, setSelectedService] = useState(null);
//     const [quantities, setQuantities] = useState({});

//     const increment = () => {
//         if (!selectedService) return;

//         setQuantities(prev => ({
//             ...prev,
//             [selectedService._id]: (prev[selectedService._id] || 1) + 1
//         }));
//     }

//     const decrement = () => {
//         if (!selectedService || !quantities[selectedService._id] || quantities[selectedService._id] <= 1) return;

//         setQuantities(prev => ({
//             ...prev,
//             [selectedService._id]: prev[selectedService._id] - 1
//         }));
//     }

//     const handleServiceChange = (e) => {
//         const selectedServiceName = e.target.value;
//         const service = services.find(s => s.serviceName === selectedServiceName);
//         setSelectedService(service || null);
//     }

//     const getCurrentQuantity = () => {
//         if (!selectedService) return 1;
//         return quantities[selectedService._id] || 1;
//     };

//     const dispatch = useDispatch();
//     const handleAddToCard = (item) => {
//         const { id, name, price, qty, unit } = item;
//         const getCurrentQuantity = quantities[item.id] || 1;
//         if (getCurrentQuantity === 0) {
//             toast.warning('Please specify the required quantity.');
//             return;
//         }
       
//         if (getCurrentQuantity > 0 ) {
//             // slice item for sale send ID versiaal ID
//             const service = { serviceId: id }
//             // editing service or ItemId from this method to itemId = id means id from {id, name, price, qty, unit, cat}
//             const newObj = { id: id, name, pricePerQuantity: price, quantity: getCurrentQuantity, price: price * getCurrentQuantity }
//             // send data to saleInfo
//             // store data in sale Slice
//             dispatch(addItems(newObj));
//             // slice item
           
//             // dispatch(updateService({ service }))
//             // setQuantities(prev => ({
//             //     ...prev, [item.id]: 0
//             // }))

//             setSelectedService(null);
//             fetchServices({ category: selectedCategory === 'all' ? '' : selectedCategory, page: 1 })
//         }

//         return;
//     }



      
//     return (
//         <section className ='h-[calc(100vh)] overflow-y-scroll scrollbar-hidden flex gap-2 bg-[#f5f5f5] shadow-xl'>
       
//             <div className ='flex-[1] bg-white shadow-xl rounded-lg pt-0'>
//                 <SupplierInfo />
                
//                 <BuyBills 
//                     fetchServices={fetchServices} selectedCategory={selectedCategory}
//                 />
//             </div>
                   
//             <div className='flex-[3] bg-white shadow-xl rounded-lg pt-0'>

//                 <div className='flex items-center justify-between px-4 py-2 shadow-xl mb-2 bg-white rounded-t-lg'>
//                     <div className='flex flex-wrap gap-0 items-center cursor-pointer'>
//                         <BackButton />
//                         <h1 className='text-[#1a1a1a] text-md font-bold tracking-wide'>Purchases Invoice</h1>
//                     </div>

//                     <div className='flex items-center justify-content gap-4 shadow-xl px-1 h-8 bg-[#f5f5f5] rounded-sm'>
//                         <div className='flex items-center gap-3 cursor-pointer '>
//                             <div className='p-2 mb-4 flex justify-center cursor-pointer'>

//                                 {buyBtn.map(({ label, action }) => {
//                                     return (
//                                         <button
//                                             onClick={() => handleSupplierModalOpen(action)}
//                                             className='flex gap-1 items-center cursor-pointer'>
//                                             <p className='text-xs mt-3 underline text-zinc-600 font-semibold'>{label}</p>
//                                             <IoMdArrowDropright className='inline mt-4 text-[#0ea5e9]' size={20} />
//                                         </button>
//                                     );
//                                 })}
//                             </div>

//                             <FaCircleUser className='h-5 w-5 text-yellow-700' />
//                             <div className='flex items-center gap-1'>
//                                 <p className='text-xs font-normal text-[#1a1a1a]'>
//                                     Supplier :
//                                 </p>
//                                 <p className='text-xs font-medium text-yellow-700'>
//                                     {supplierData.supplierName || 'Supplier name'}
//                                 </p>
//                             </div>

//                             <div className='flex items-center gap-1'>
//                                 <p className='text-xs font-normal text-[#1a1a1a]'>
//                                     Balance :
//                                 </p>

//                                 <p className={`${supplierData.balance === 0 ? 'text-[#0ea5e9]' : 'text-[#be3e3f]'} 
//                                                         text-xs font-medium`}>
//                                     {(Number(supplierData.balance) || 0).toFixed(2)}
//                                     <span className='text-xs text-[#1a1a1a] font-normal'> AED</span>
//                                 </p>
//                             </div>

//                             <div className='flex items-center justify-around gap-3'>
//                                 {addSuppButton.map(({ label, icon, action }) => {
//                                     return (
//                                         <button
//                                             onClick={() => handleAddSupplierModal(action)}
//                                             className='cursor-pointer px-2 py-2 font-semibold text-sm 
//                                                 flex items-center gap-2'>
//                                             {label} {icon}
//                                         </button>
//                                     )
//                                 })}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//                 {/* <BuyMenuContainer />  */}
                  
//                 <div className='flex w-full gap-1 justify-start items-start p-1'>
                    
                    
//                     {/* Services */}
//                     <div className='flex flex-col w-full px-5 gap-5'>

//                         <div className='flex items-center'>
//                             <label className='w-[10%] text-[#0ea5e9] block mb-2 mt-3 text-xs font-medium'>Item Name :</label>
//                             <div className='flex w-[90%] items-center p-3 bg-white shadow-xl'>
//                                 <select
//                                     className='w-full bg-[#f5f5f5] h-8 rounded-sm w-[500px] text-xs font-normal border-b-1 border-yellow-700'
//                                     required
//                                     onChange={handleServiceChange}
//                                     value={selectedService?.serviceName || ''}
//                                 >
//                                     <option value="">Select a service</option>
//                                     {services.map((service, index) => (
//                                         <option
//                                             key={index}
//                                             value={service.serviceName}
//                                             className='text-xs font-normal'>
//                                             {service.serviceName}
//                                         </option>
//                                     ))}
//                                 </select>
//                             </div>
//                         </div>

//                         {selectedService && (
//                             <div className='flex items-center justify-between p-2 bg-white shadow-lg/30 rounded-sm'>

//                                 <div className='flex-1'>
//                                     <h3 className='text-sm font-semibold text-[#0ea5e9]'>{selectedService.serviceName}</h3>
//                                     <p>
//                                         <span className='text-xs text-gray-600 font-normal'>Purchase price : </span>
//                                         <span className='text-sm font-semibold text-[#0ea5e9]'>{selectedService.buyingPrice}</span>
//                                         <span className='text-xs text-gray-600'> AED</span>
//                                     </p>
//                                     <p>
//                                         <span className='text-xs text-gray-600 font-normal'>Available Quantity: </span>
//                                         <span className='text-sm font-semibold text-[#0ea5e9]'>{selectedService.qty}</span>
//                                         <span className='text-xs text-gray-600'> {selectedService.unit}</span>
//                                     </p>
//                                 </div>

//                                 <div className='flex gap-3 items-center justify-between shadow-xl
//                                     px-4 py-1 rounded-sm mr-0 bg-[#f5f5f5]'>
//                                     <button
//                                         onClick={decrement}
//                                         className='text-emerald-600 text-md cursor-pointer'
//                                     >
//                                         <IoMdArrowDropdownCircle className='w-5 h-5' />
//                                     </button>

//                                     <span className={`${getCurrentQuantity() > 9 ? "text-lg" : "text-xl"} text-[#0ea5e9] flex flex-wrap gap-2 font-semibold`}>
//                                         {getCurrentQuantity()}
//                                     </span>

//                                     <button
//                                         onClick={increment}
//                                         className='text-[#0ea5e9] text-md cursor-pointer'
//                                     >
//                                         <IoMdArrowDropupCircle className='w-5 h-5' />
//                                     </button>
//                                 </div>

//                                 <div className='ml-3'>
//                                     {/* disabled={getCurrentQuantity() === 0}  */}
//                                     <button onClick={() => handleAddToCard({
//                                         id: selectedService._id,
//                                         name: selectedService.serviceName,
//                                         price: selectedService.buyingPrice,
//                                         qty: selectedService.qty,
//                                         unit: selectedService.unit,
//                                         cat: selectedService.category
//                                     })}
//                                         className='cursor-pointer mt-0'>
//                                         <BsFillCartCheckFill className='text-[#0ea5e9] rounded-lg flex justify-end items-end' size={25} />
//                                     </button>
//                                 </div>
//                             </div>
//                         )}

//                         <BuyCartInfo />
//                     </div>




//                     {/* Categories Sidebar */}
//                     <div className='flex-col justify-between p-2 w-[16%] bg-white shadow-xl/30 rounded-sm h-[calc(90vh)]'>
//                         <button
//                             className='w-[100%] grid grid-cols-1 p-1 items-center mb-3 rounded-sm h-[45px] cursor-pointer shadow-lg/30'
//                             style={{ backgroundColor: selectedCategory === 'all' ? getBgColor() : '#f3f4f6' }}
//                             onClick={() => setSelectedCategory('all')}
//                         >
//                             <div className='flex items-center justify-between w-full shadow-lg/30'>
//                                 <h1 className='text-xs font-normal' style={{ color: selectedCategory === 'all' ? 'white' : 'black' }}>
//                                     All Categories
//                                 </h1>
//                                 {selectedCategory === 'all' && <GrRadialSelected className='text-[#e6e6e6]' size={20} />}
//                             </div>
//                         </button>

//                         {responseData?.data.data.map(category => (
//                             <button
//                                 key={category._id}
//                                 className='w-[100%] grid grid-cols-1 p-1 items-center mb-3 rounded-sm h-[45px] 
//                                                     cursor-pointer shadow-lg/30 '
//                                 style={{ backgroundColor: selectedCategory === category.categoryName ? getBgColor() : '#f3f4f6' }}
//                                 onClick={() => setSelectedCategory(category.categoryName)}
//                             >
//                                 <div className='flex items-center justify-between w-full shadow-lg/30'>
//                                     <h1
//                                         className='text-xs font-normal'
//                                         style={{ color: selectedCategory === category.categoryName ? 'white' : 'black' }}
//                                     >
//                                         {category.categoryName}
//                                     </h1>
//                                     {selectedCategory === category.categoryName && <GrRadialSelected className='text-[#e6e6e6]' size={20} />}
//                                 </div>
//                             </button>
//                         ))}
//                     </div>


//                 </div>
               
                
//                 </div>

//                 {isSelectSupplierModalOpen && 
//                 <SelectSupplier 
//                 setIsSelectSupplierModalOpen={setIsSelectSupplierModalOpen}
//                 />
//                 }

//                 {isSupplierModalOpen && 
//                 <SupplierAdd 
//                 setIsSupplierModalOpen ={setIsSupplierModalOpen} 
//                 />
//                 }
       
//               </section>
//     );
// }


// export default Buy ;