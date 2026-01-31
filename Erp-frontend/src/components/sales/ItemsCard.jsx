import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { IoCloseCircle } from 'react-icons/io5';
import { useDispatch } from 'react-redux';
import { PiUserCircleCheckLight } from "react-icons/pi";
import { FaSearch, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaWallet, FaFilter, FaUsers } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { setCustomer } from '../../redux/slices/customerSlice';
import { api } from '../../https';

// Custom debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
};

const CustomerSelect = ({ setIsSelectCustomerModalOpen }) => {
  const dispatch = useDispatch();
  const [list, setList] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('-createdAt');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Use the debounce hook
  const debouncedSearch = useDebounce(search, 500);

  const handleClose = (customerId, customerName, email, balance) => {
    dispatch(setCustomer({ customerId, customerName, email, balance }));
    setIsSelectCustomerModalOpen(false);
  };

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/api/customers/fetch', {
        search: debouncedSearch,
        sort,
        page: 1,
        limit: 1000
      });

      if (response.data.success) {
        setList(response.data.customers || []);
      } else {
        setError(response.data.message || 'Failed to fetch customers');
        toast.error(response.data.message || 'Failed to fetch customers');
      }
    } catch (error) {
      console.error('API Error:', error);
      let errorMessage = 'An error occurred while fetching customers';
      
      if (error.response) {
        errorMessage = error.response.data?.message || errorMessage;
      } else if (error.request) {
        errorMessage = 'Network error. Please check your connection.';
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, sort]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  return (
    <div className='fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className='bg-gradient-to-b from-white to-blue-50 rounded-2xl shadow-2xl border border-blue-200 w-full max-w-6xl max-h-[90vh] flex flex-col'
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2.5 rounded-lg">
              <FaUsers className="text-white w-5 h-5" />
            </div>
            <div>
              <h2 className='text-white text-lg md:text-xl font-bold'>Select Customer</h2>
              <p className='text-blue-100 text-sm'>Choose a customer for your sale</p>
            </div>
          </div>
          <button
            onClick={() => setIsSelectCustomerModalOpen(false)}
            className='p-2 text-white hover:bg-white/20 rounded-lg transition-all duration-200 cursor-pointer'
            aria-label="Close"
          >
            <IoCloseCircle size={28} />
          </button>
        </div>

        {/* Search and Filter Section */}
        <div className='p-6 border-b border-blue-100'>
          <div className='flex flex-col md:flex-row gap-4'>
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-5 w-5 text-blue-400" />
              </div>
              <input
                type='text'
                placeholder='Search customers by name, email, or phone...'
                className='w-full pl-10 pr-4 py-3 border border-blue-200 rounded-xl bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition duration-200'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className='appearance-none bg-white border border-blue-200 rounded-xl px-4 py-3 pr-10 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition duration-200 cursor-pointer'
                >
                  <option value='-createdAt'>Newest First</option>
                  <option value='createdAt'>Oldest First</option>
                  <option value='name'>Name A-Z</option>
                  <option value='-name'>Name Z-A</option>
                </select>
                <div className="absolute right-3 top-3.5 text-blue-500 pointer-events-none">
                  <FaFilter className="w-4 h-4" />
                </div>
              </div>
              <div className="text-sm text-gray-500 bg-blue-50 px-3 py-2 rounded-lg">
                {list.length} customers
              </div>
            </div>
          </div>
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600 font-medium">Loading Customers...</p>
            <p className="text-sm text-gray-500 mt-2">Please wait while we fetch the customer list</p>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          {!loading && list.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="mb-6 p-4 bg-blue-50 rounded-full">
                <FaUsers className="w-12 h-12 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {debouncedSearch ? 'No Customers Found' : 'No Customers Available'}
              </h3>
              <p className="text-gray-500 max-w-md">
                {debouncedSearch
                  ? `No customers found matching "${debouncedSearch}"`
                  : 'Your customer list is empty. Start by adding new customers!'}
              </p>
            </div>
          ) : (
            <div className="overflow-y-auto h-full">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                {list.map((customer) => (
                  <motion.div
                    key={customer._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="group bg-white border border-blue-100 rounded-xl p-5 hover:border-blue-300 hover:shadow-lg transition-all duration-300 cursor-pointer"
                    onClick={() => handleClose(customer._id, customer.customerName, customer.email, customer.balance)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
                          <FaUser className="text-white w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-800 text-lg truncate">
                            {customer.customerName}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              Number(customer.balance) === 0
                                ? 'bg-green-100 text-green-700'
                                : Number(customer.balance) > 0
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-blue-100 text-blue-700'
                            }`}>
                              {Number(customer.balance) === 0 ? 'Balance Clear' : 
                               Number(customer.balance) > 0 ? 'Has Balance' : 'In Credit'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <PiUserCircleCheckLight className="w-7 h-7 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                          <FaEnvelope className="w-3.5 h-3.5 text-blue-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-500">Email</p>
                          <p className="text-sm font-medium text-gray-700 truncate">
                            {customer.email || 'Not provided'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                          <FaPhone className="w-3.5 h-3.5 text-blue-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-500">Contact</p>
                          <p className="text-sm font-medium text-gray-700">
                            {customer.contactNo || 'Not provided'}
                          </p>
                        </div>
                      </div>

                      {customer.address && (
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                            <FaMapMarkerAlt className="w-3.5 h-3.5 text-blue-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-500">Address</p>
                            <p className="text-sm font-medium text-gray-700 line-clamp-2">
                              {customer.address}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-5 pt-4 border-t border-blue-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FaWallet className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-500">Balance</span>
                        </div>
                        <span className={`text-lg font-bold ${
                          Number(customer.balance) === 0
                            ? 'text-green-600'
                            : Number(customer.balance) > 0
                              ? 'text-red-600'
                              : 'text-blue-600'
                        }`}>
                          {Number(customer.balance).toFixed(2)} <span className="text-sm font-normal text-gray-500">AED</span>
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 text-center">
                      <button className="w-full py-2.5 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-lg font-medium text-sm hover:from-blue-100 hover:to-blue-200 transition duration-200 cursor-pointer">
                        Select Customer
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className='p-4 border-t border-blue-100 bg-gradient-to-r from-blue-50 to-white rounded-b-2xl'>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Showing <span className="font-semibold text-blue-700">{list.length}</span> customers</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSelectCustomerModalOpen(false)}
                className="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200 cursor-pointer text-sm font-medium"
              >
                Cancel
              </button>
              <div className="text-xs text-gray-500">
                Click on a customer card to select
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CustomerSelect;


// import React, {useState} from 'react'
// import { useDispatch } from 'react-redux';
// import { addItems } from '../../redux/slices/saleSlice';
// import { updateService } from '../../redux/slices/customerSlice';
// import { BsFillCartCheckFill } from "react-icons/bs";

// import { toast } from 'react-toastify'


// const ItemsCard = ({id, name, price, qty, unit, cat}) => {

//     const [qntCount, setQntCount] = useState(0);
//     const [itemId, setItemId] = useState();             
            
//         const increment = (id) => {                        
//             setItemId(id);                                  
//             setQntCount((prev) => prev + 1)
//         }
//         const decrement = (id) => {
//             setItemId(id);
//             if (qntCount <= 0) return;
//             setQntCount((prev) => prev - 1); 
//         }



//         const dispatch = useDispatch();

//         const handleAddToCard = (item) => {
           
           
//             if (qntCount === 0) {
//                 toast.warning('Please specify the required quantity.');
//                 return;
//             }

//             if (qty < 0) {
//                 toast.error('Sorry item does not have balance');
//                 return;

//             }
//             if (qty < qntCount) {
//                 toast.error('Sorry the balance is not enough the procedure.');
//                 return;

//             }
        
//             if (qntCount > 0  && qntCount <= qty) {
            
//             const { name, price } = item;
//             //slice item  for sale send ID versioal ID
//             const service = {serviceId: id}  
//             // editing service or ItemId from this method to itemId = id means id from {id, name, price, qty, unit, cat}

//             //const newObj = { id: new Date(), name, pricePerQuantity :price, quantity :qntCount, price :price * qntCount };
//             const newObj = { id: id, name, pricePerQuantity :price, quantity :qntCount, price :price * qntCount };
            
//             // send data to saleInfo
//             // store data in sale Slice
//             dispatch(addItems(newObj));

//             // slice item
//             dispatch(updateService({service}))
        
//             setQntCount(0);
//         }
//     }

//     return (

//         <div className ='flex flex-col  flex-wrap justify-around gap-1 p-2 rounded-lg h-[185px] cursor-pointer bg-zinc-100  hover:bg-white shadow-lg/30 mt-0' >
           
//             <div className ='flex justify-between items-center flex-wrap mb-0'>
                                                          
//                 <div className ='flex flex-col gap-0 mb-0'>
//                     <h1 className ='text-sm font-semibold text-sky-600 flex justify-start items-start'>{name}</h1>
//                     <p className ={`${qty === 0 ? "text-red-600" : "text-green-600"} text-md font-semibold`}><span className ='text-xs text-black font-normal'>Available : </span>{qty}<span className ='text-xs text-black font-normal'> {unit}</span></p>
//                     <p className ='text-xs underline text-green-600 mt-2'>{cat}</p>
//                 </div>
                   
//                 <div className ='mt-0'>
//                     <button disabled={qty === 0} onClick ={() =>  handleAddToCard({id, name, price, qty, unit, cat})}
//                         className ='cursor-pointer mt-0'>
//                         <BsFillCartCheckFill  className ='text-green-600 rounded-lg flex justify-end items-end' size={35}/>
//                     </button>
//                 </div>
                                                       
//             </div>

//             <div className ='flex items-center justify-between px-0 w-full '>
       
//              <p className ='text-md font-semibold text-red-600'><span className ='text-xs text-black font-normal'>Price : </span>{price.toFixed(2)}<span className ='text-xs text-black font-normal'> AED</span></p>
                                       
//                     <div className ='flex gap-3 items-center  justify-between bg-white shadow-lg/50 px-4 py-3 rounded-lg mr-0'>
//                         <button
//                             onClick ={()=>  decrement(id)}
//                             className ='text-red-500 text-lg  cursor-pointer'
//                         >
//                             &minus;
//                         </button>

//                         <span className ={`${qntCount > 9 ? "text-lg" : "text-5xl"} text-sky-500 flex flex-wrap gap-2  font-semibold`}>{id === itemId ? qntCount : "0"}</span>
                           
//                         <button
//                             disabled={qty === 0}
//                             onClick ={()=> increment(id)}
//                             className ='text-blue-600 text-lg cursor-pointer'
//                         >
//                             &#43;
//                         </button>
//                     </div>
//             </div>

//         </div>

      
        
//     );
        
// }

// export default ItemsCard ;