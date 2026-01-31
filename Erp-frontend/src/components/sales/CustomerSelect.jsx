import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { IoCloseCircle } from 'react-icons/io5';
import { useDispatch } from 'react-redux';
import { PiUserCircleCheckLight } from "react-icons/pi";
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
        // Server responded with error status
        errorMessage = error.response.data?.message || errorMessage;
      } else if (error.request) {
        // Request was made but no response received
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
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className='bg-white p-4 rounded-lg shadow-xl w-11/12 md:w-4/5 lg:w-3/4 max-h-[90vh] overflow-hidden flex flex-col'
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-4 pb-2 border-b">
          <h2 className='text-lg font-semibold text-gray-800'>Select Customer</h2>
          <button 
            onClick={() => setIsSelectCustomerModalOpen(false)}
            className='text-red-600 hover:text-red-800 transition-colors'
          >
            <IoCloseCircle size={25} />
          </button>
        </div>

        {/* Search and Filters */}
        <div className='mb-4'>
          <div className='flex flex-col md:flex-row gap-4'>
            <div className='flex-1'>
              <input 
                type='text' 
                placeholder='Search by name, email, phone or address...' 
                className='w-full border-2 border-yellow-600 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className='w-full md:w-48'>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className='w-full border-2 border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500'
              >
                <option value='-createdAt'>Newest First</option>
                <option value='createdAt'>Oldest First</option>
                <option value='name'>Name A-Z</option>
                <option value='-name'>Name Z-A</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading and Error States */}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
            <span className="ml-3 text-gray-600">Loading customers...</span>
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Customers List */}
        <div className='flex-1 overflow-auto'>
          {!loading && list.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">
                {debouncedSearch 
                  ? `No customers found for "${debouncedSearch}"` 
                  : 'No customers found. Start adding customers!'
                }
              </p>
            </div>
          ) : (
            <div className='overflow-x-auto'>
              <table className='min-w-full bg-white'>
                <thead>
                  <tr className='bg-gray-100 border-b-2 border-yellow-600 text-gray-700 text-sm'>
                    <th className='py-3 px-4 text-left'>Name</th>
                    <th className='py-3 px-4 text-left'>Email</th>
                    <th className='py-3 px-4 text-left'>Contact No</th>
                    <th className='py-3 px-4 text-left'>Address</th>
                    <th className='py-3 px-4 text-left'>Balance</th>
                    <th className='py-3 px-4 text-center'>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((customer) => (
                    <tr
                      key={customer._id}
                      className='border-b border-gray-200 hover:bg-yellow-50 transition-colors'
                    >
                      <td className='py-3 px-4'>{customer.customerName}</td>
                      <td className='py-3 px-4'>{customer.email}</td>
                      <td className='py-3 px-4'>{customer.contactNo}</td>
                      <td className='py-3 px-4'>{customer.address}</td>
                      <td className={`py-3 px-4 font-medium ${customer.balance === 0 ? 'text-gray-600' : 'text-red-600'}`}>
                        ${(Number(customer.balance) || 0).toFixed(2)}
                      </td>
                      <td className='py-3 px-4 text-center'>
                        <button
                          onClick={() => handleClose(customer._id, customer.customerName, customer.email, customer.balance)}
                          className='text-blue-600 hover:text-blue-800 transition-colors'
                          title="Select Customer"
                        >
                          <PiUserCircleCheckLight size={24} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className='mt-4 pt-3 border-t border-gray-200 text-sm text-gray-500'>
          Showing {list.length} customers
        </div>
      </motion.div>
    </div>
  );
};

export default CustomerSelect;