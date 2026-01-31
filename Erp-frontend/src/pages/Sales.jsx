import React, { useState, useEffect } from 'react'
import { FaCalculator, FaShoppingCart, FaBox, FaFilter } from "react-icons/fa";
import { FaCircleUser } from "react-icons/fa6";
import { FaArrowRight } from "react-icons/fa";
import { ImUserPlus } from "react-icons/im";
import { BsFillCartCheckFill } from "react-icons/bs";
import { RiLogoutCircleLine } from "react-icons/ri";
import { GrRadialSelected } from 'react-icons/gr';

import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { keepPreviousData, useQuery, useMutation } from '@tanstack/react-query'
import { enqueueSnackbar } from 'notistack'
import { toast } from 'react-toastify';

import BackButton from '../components/shared/BackButton'
import SelectCustomer from '../components/sales/SelectCustomer';
import CustomerAdd from '../components/customers/CustomerAdd';
import QuantityCalculatorModal from '../components/sales/QuantityCalculatorModal';
import CartInfo from '../components/sales/CartInfo';
import Bills from '../components/sales/Bills';

import { getBgColor } from '../utils'
import { getCategories, getServices, logout } from '../https';
import { addItems } from '../redux/slices/saleSlice';
import { updateService } from '../redux/slices/customerSlice';
import { removeUser } from '../redux/slices/userSlice';

const Sales = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Customer selection modal
    const [isSelectCustomerModalOpen, setIsSelectCustomerModalOpen] = useState(false);
    const handleSaleModalOpen = (action) => {
        if (action === 'sale') setIsSelectCustomerModalOpen(true)
    }

    // Add new customer modal
    const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
    const handleOpenModal = (action) => {
        if (action === 'customer') setIsCustomerModalOpen(true);
    };

    // Categories fetch
    const { data: responseData, isError } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            return await getCategories();
        },
        placeholderData: keepPreviousData,
    });
    
    if (isError) {
        enqueueSnackbar('Something went wrong!', { variant: 'error' });
    }

    // Services state
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
            setServices(response.data.data || response.data.services || []);
            if (response.data.pagination) {
                setPagination(response.data.pagination);
            }
        } catch (error) {
            console.error('Error fetching services:', error);
            toast.error('Failed to load services');
        }
    };

    // Fetch services when category changes
    useEffect(() => {
        fetchServices({
            category: selectedCategory === 'all' ? '' : selectedCategory,
            page: 1
        });
    }, [selectedCategory]);

    // Customer and user data
    const customerData = useSelector(state => state.customer);
    const userData = useSelector(state => state.user);

    // Calculator modal state
    const [selectedService, setSelectedService] = useState(null);
    const [quantities, setQuantities] = useState({});
    const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
    const [selectedServiceForCalculator, setSelectedServiceForCalculator] = useState(null);

    // Open calculator modal
    const openCalculator = (service) => {
        setSelectedServiceForCalculator(service);
        setIsCalculatorOpen(true);
    };

    // Handle calculator confirmation
    const handleCalculatorConfirm = (quantity) => {
        if (!selectedServiceForCalculator) return;

        // Set the quantity in state
        setQuantities(prev => ({
            ...prev,
            [selectedServiceForCalculator._id]: quantity
        }));

        // Automatically add to cart after quantity selection
        handleAddToCart({
            id: selectedServiceForCalculator._id,
            name: selectedServiceForCalculator.serviceName,
            price: selectedServiceForCalculator.price,
            qty: selectedServiceForCalculator.qty,
            unit: selectedServiceForCalculator.unit,
            cat: selectedServiceForCalculator.category
        }, quantity);
    };

    // Handle service selection from dropdown
    const handleServiceChange = (e) => {
        const selectedServiceName = e.target.value;
        const service = services.find(s => s.serviceName === selectedServiceName);
        setSelectedService(service || null);
    }

    // Get current quantity for a service
    const getCurrentQuantity = (serviceId) => {
        return quantities[serviceId] || 1;
    };

    // Add item to cart
    const handleAddToCart = (item, customQuantity = null) => {
        const { id, name, price, qty, unit } = item;
        const currentQuantity = customQuantity || getCurrentQuantity(id);

        if (currentQuantity === 0) {
            toast.warning('Please specify the required quantity.');
            return;
        }
        if (qty < 0) {
            toast.error('Sorry item does not have balance');
            return;
        }
        if (qty < currentQuantity) {
            toast.error('Sorry the balance is not enough for the requested quantity.');
            return;
        }

        if (currentQuantity > 0 && currentQuantity <= qty) {
            const service = { serviceId: id };
            const newObj = {
                id: id,
                name,
                pricePerQuantity: price,
                quantity: currentQuantity,
                price: price * currentQuantity
            };

            dispatch(addItems(newObj));
            dispatch(updateService({ service }));

            // Reset quantity for this item
            setQuantities(prev => ({
                ...prev,
                [item.id]: 0
            }));

            // Clear selected service and refresh services
            setSelectedService(null);
            fetchServices({ 
                category: selectedCategory === 'all' ? '' : selectedCategory, 
                page: 1 
            });
        }
    };

    // Logout mutation
    const logOutMutation = useMutation({
        mutationFn: () => logout(),
        onSuccess: (data) => {
            dispatch(removeUser());
            localStorage.removeItem('token');
            document.cookie = 'accessToken=; Max-Age=0; path=/;';
            navigate('/auth');
        },
        onError: (error) => {
            console.error('Logout error:', error);
            toast.error('Logout failed');
        }
    });

    const handleLogOut = () => {
        if (!logOutMutation.isLoading) {
            document.cookie = 'accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            logOutMutation.mutate();
        }
    };

    return (
        <section className='min-h-screen bg-gradient-to-br from-blue-50 to-white p-3 md:p-4 lg:p-1'>
            <div className='max-w-7xl mx-auto'>
                {/* Header Section */}
                <div className='bg-white rounded-xl shadow-lg mb-2 overflow-hidden border border-blue-100'>
                    <div className='flex flex-col md:flex-row justify-between items-start md:items-center p-4 md:p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white'>
                        <div className='flex items-center gap-3 mb-4 md:mb-0'>
                            {/* Conditional rendering based on user role */}
                            {userData?.role === 'cashier' ? (
                                <RiLogoutCircleLine
                                    className="text-[#f6b100] w-7 h-7 cursor-pointer hover:opacity-80 transition-opacity"
                                    onClick={handleLogOut}
                                    title="Logout"
                                />
                            ) : userData?.role === 'admin' ? (
                                <BackButton className="text-white hover:opacity-80" />
                            ) : (
                                <BackButton className="text-white hover:opacity-80" />
                            )}

                            <div className='flex items-center gap-3'>
                                <div className='bg-white/20 p-2 rounded-lg'>
                                    <FaShoppingCart className='text-white w-5 h-5' />
                                </div>
                                <div>
                                    <h1 className='text-lg md:text-xl font-bold'>Sales Invoice</h1>
                                    <p className='text-blue-100 text-sm'>Create and manage sales invoices</p>
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto'>
                            <button 
                                onClick={() => handleSaleModalOpen('sale')}
                                className='flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition duration-200 cursor-pointer'
                            >
                                <p className='text-sm'>Select Customer</p>
                                <FaArrowRight className='text-white' size={18}/>
                            </button>

                            <div className='flex items-center gap-3 bg-white/10 px-4 py-2 rounded-lg'>
                                <FaCircleUser className='h-5 w-5 text-blue-200'/>
                                <div className='flex flex-col sm:flex-row sm:items-center gap-2'>
                                    <div className='flex items-center gap-1'>
                                        <p className='text-sm font-medium text-blue-100'>
                                            Customer:
                                        </p>
                                        <p className='text-sm font-bold text-white'>
                                            {customerData.customerName || 'Select Customer'}
                                        </p>
                                    </div>
                                    
                                    <div className='flex items-center gap-1'>
                                        <p className='text-sm font-medium text-blue-100'>
                                            Balance:
                                        </p>
                                        <p className={`text-sm font-bold ${customerData.balance === 0 ? 'text-green-200' : 'text-red-200'}`}>
                                            {(Number(customerData.balance) || 0).toFixed(2)}
                                            <span className='text-blue-100 font-normal'> AED</span>
                                        </p>  
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleOpenModal('customer')}
                                    className='p-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition duration-150 cursor-pointer'
                                    title="Add New Customer"
                                >
                                    <ImUserPlus size={18} className='text-white' />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Main Content Grid */}
                <div className='grid grid-cols-1 lg:grid-cols-4 gap-2'>
                    {/* Left Column - Categories */}
                    <div className='lg:col-span-1'>
                        <div className='bg-white rounded-xl shadow-lg border border-blue-100 p-4 sticky top-6'>
                            <div className='flex items-center gap-2 mb-4'>
                                <FaFilter className='text-blue-600 w-5 h-5' />
                                <h3 className='text-sm font-semibold text-blue-800'>Categories</h3>
                            </div>
                            
                            <div className='space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto pr-2'>
                                <button
                                    className='w-full flex items-center justify-between p-3 rounded-lg transition duration-200 cursor-pointer hover:bg-blue-50'
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

                                {responseData?.data?.data?.map(category => (
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
                                        {responseData?.data?.data?.length || 0}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Middle Column - Items Selection & Cart */}
                    <div className='lg:col-span-2 space-y-6'>
                        {/* Item Selection Card */}
                        <div className='bg-white rounded-xl shadow-lg p-5 border border-blue-100'>
                            <h2 className='text-blue-800 font-semibold mb-4 text-sm flex items-center gap-2'>
                                <FaBox className="text-blue-600 w-4 h-4" />
                                Select Item for Sale
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
                                        <option value="">Select item for sale...</option>
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
                                                    <p className='text-xs text-gray-500 mb-1'>Selling Price</p>
                                                    <p className='text-lg font-bold text-blue-600'>
                                                        {selectedService.price}
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

                                        {/* Calculator Button Section */}
                                        <div className='flex flex-col items-center gap-4'>
                                            <div className='text-center'>
                                                <p className='text-sm text-gray-500 mb-2'>Current Quantity</p>
                                                <p className='text-3xl font-bold text-blue-700'>
                                                    {getCurrentQuantity(selectedService._id)}
                                                    <span className='text-sm text-gray-500 ml-1'>{selectedService.unit}</span>
                                                </p>
                                            </div>

                                            <button
                                                onClick={() => openCalculator(selectedService)}
                                                className='bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 rounded-lg flex items-center gap-3 transition duration-200 cursor-pointer shadow-lg hover:shadow-xl'
                                            >
                                                <FaCalculator className='text-white' size={20} />
                                                <div className='text-left'>
                                                    <span className='font-bold block'>Select Quantity</span>
                                                    <span className='text-sm opacity-90'>Use Calculator</span>
                                                </div>
                                            </button>

                                            <button
                                                onClick={() => handleAddToCart({
                                                    id: selectedService._id,
                                                    name: selectedService.serviceName,
                                                    price: selectedService.price,
                                                    qty: selectedService.qty,
                                                    unit: selectedService.unit,
                                                    cat: selectedService.category
                                                })}
                                                className='bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 transition duration-200 cursor-pointer shadow-md w-full justify-center'
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
                            <CartInfo />
                        </div>
                    </div>

                    {/* Right Column - Bills */}
                    <div className='lg:col-span-1 space-y-6'>
                        {/* Bills Section */}
                        <div className='bg-white rounded-xl shadow-lg border border-blue-100'>
                            <Bills 
                                fetchServices={fetchServices} 
                                selectedCategory={selectedCategory}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Calculator Modal */}
            <QuantityCalculatorModal
                isOpen={isCalculatorOpen}
                onClose={() => setIsCalculatorOpen(false)}
                onConfirm={handleCalculatorConfirm}
                service={selectedServiceForCalculator}
                maxQuantity={selectedServiceForCalculator?.qty || 0}
            />

            {/* Select Customer Modal */}
            {isSelectCustomerModalOpen && 
                <SelectCustomer 
                    setIsSelectCustomerModalOpen={setIsSelectCustomerModalOpen}
                />
            }

            {/* Add Customer Modal */}
            {isCustomerModalOpen && 
                <CustomerAdd 
                    setIsCustomerModalOpen={setIsCustomerModalOpen} 
                />
            }
        </section>
    );
};

export default Sales;