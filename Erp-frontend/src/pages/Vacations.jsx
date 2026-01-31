import React, {useState, useEffect, useRef} from 'react' 
import { api, getDepartments, updateVacation } from '../https';
import { toast } from 'react-toastify';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import BackButton from '../components/shared/BackButton';
import BottomNav from '../components/shared/BottomNav';

const Vacations = () => {
    const [list, setList] = useState([]);
    const [search, setSearch] = useState(''); // Match backend parameter name
    const [sort, setSort] = useState('-createdAt');
    const [department, setDepartment] = useState('all');
    const [empName, setEmpName] = useState('all');

    const [vacationType, setVacationType] = useState('all');
    const [vacationStatus, setVcationStatus] = useState('all');
  
    const [pagination, setPagination] = useState({
        currentPage: 1,
        itemsPerPage: 10,
        totalItems: 0,
        totalPages: 1
    });

    // Fetch Function:
    const fetchVacations = async (search = '') => {
        try {

            const response = await api.post('/api/vacation/fetch',
                // { sort }, { params: {search} }
                {
                    empName,
                    department,
                    search,
                    // sort: sort === 'createdAt' ? '-createdAt' : sort,
                    sort,
                    vacationType,
                    vacationStatus,

                    page: pagination.currentPage,
                    limit: pagination.itemsPerPage
                }
            );

            if (response.data.success) {
                //setList(response.data.employees)
                setList(response.data.data || response.data.vacations || []);

                // Only update pagination if the response contains valid data
                if (response.data.pagination) {
                    setPagination(prev => ({
                        ...prev,  // Keep existing values
                        currentPage: response.data.pagination.currentPage ?? prev.currentPage,
                        itemsPerPage: response.data.pagination.limit ?? prev.itemsPerPage,
                        totalItems: response.data.pagination.total ?? prev.totalItems,
                        totalPages: response.data.pagination.totalPages ?? prev.totalPages
                    }));
                }


            } else {
                toast.error(response.data.message || 'Employee is not found')
            }

        } catch (error) {
            // Show backend error message if present in error.response
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error(error.message)
            }
            console.log(error)
        }
    }

    // useEffect(() => {
    //     fetchEmployees()
    // }, []);
    const isInitialMount = useRef(true);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            fetchVacations();
        }
    }, [department, empName, search, sort, vacationType, vacationStatus, pagination.currentPage, pagination.itemsPerPage]);

  // Emplementation ...

  // searching and sorting
  // Debounce search to avoid too many API calls
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchVacations(search);
        }, 500); // 500ms delay

        return () => clearTimeout(timer);
    }, [search, sort]);

    // Initial fetch
    useEffect(() => {
        fetchVacations();
    }, []);

    // pagination
    const PaginationControls = () => {

        const handlePageChange = (newPage) => {
            setPagination(prev => ({
                ...prev,
                currentPage: newPage
            }));
        };

        const handleItemsPerPageChange = (newItemsPerPage) => {
            setPagination(prev => ({
                ...prev,
                itemsPerPage: newItemsPerPage,
                currentPage: 1  // Reset to first page only when items per page changes
            }));
        };

        return (  //[#0ea5e9]
            <div className="flex justify-between items-center mt-2 py-2 px-5 bg-white shadow-lg/30 rounded-lg
            text-xs font-medium border-b border-yellow-700 border-t border-yellow-700">
                <div>
                    Showing
                    <span className='text-yellow-700'> {list.length} </span>
                    of
                    <span className='text-yellow-700'> {pagination.totalItems} </span>
                    records
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        disabled={pagination.currentPage === 1}
                        className="px-2 py-1 shadow-lg/30 border-b border-yellow-700
                        text-xs font-normal disabled:opacity-50"
                    >
                        Previous
                    </button>

                    <span className="px-3 py-1">
                        Page
                        <span className='text-yellow-700'> {pagination.currentPage} </span>
                        of
                        <span className='text-yellow-700'> {pagination.totalPages} </span>
                    </span>

                    <button
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        disabled={pagination.currentPage === pagination.totalPages}
                        className="px-2 py-1 shadow-lg/30 border-b border-yellow-700 text-xs font-normal disabled:opacity-50"
                    >
                        Next
                    </button>

                    <select
                        value={pagination.itemsPerPage}
                        onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                        className="border-b border-yellow-700 px-2 font-normal shadow-lg/30"
                    >
                        <option value="5">5 per page</option>
                        <option value="10">10 per page</option>
                        <option value="20">20 per page</option>
                        <option value="50">50 per page</option>
                    </select>
                </div>
            </div>
        );
    };


      const handleStatusChange = ({ vacationId, vacationStatus }) => {                          // orderId ?
        vacationUpdateMutation.mutate({ vacationId, vacationStatus });
    };




    const queryClient = useQueryClient();
    const vacationUpdateMutation = useMutation({

        mutationFn: ({ reqData, vacationId, vacationStatus }) => updateVacation({ reqData, vacationId, vacationStatus }),
        onSuccess: (resData) => {
            const { data } = resData.data;

            //enqueueSnackbar('Order status updated successfully..', { variant: 'success' });
            toast.success('Required status updated successfully ...')
            queryClient.invalidateQueries(['vacations']);
            fetchVacations();
        },

        
        onError: () => {
            toast.error(resData.data.message);
        }
        
    });

  return (
   <section className='bg-white shadow-xl h-[calc(100vh)] overflow-y-scroll scrollbar-hidden'>
            <div className='flex justify-between items-center px-5 py-2 shadow-xl'>
                <div className='flex items-center'>
                  <BackButton />
                  <h1 className='text-md font-semibold text-[#1a1a1a]'>Vacations Management</h1>
                </div>
          </div>

          {/* Search Input */}
          <div className="flex items-center px-15 py-2 shadow-xl">
              <input
                  type="text"
                  placeholder="Search vacations..."
                  className="border border-[#D2B48C] p-1 rounded-lg w-full text-sm font-semibold"
                  // max-w-md
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
              />
              {/* Optional: Sort dropdown */}
              <select
                  className="ml-4 border border-[#D2B48C] p-1  rounded-lg text-[#1f1f1f text-sm font-semibold]"
                  value={sort}

                  onChange={(e) => {
                      setSort(e.target.value);
                      setPagination(prev => ({ ...prev, currentPage: 1 })); // Reset to first page when changing sort
                  }}
              >
                  <option value="-createdAt">Newest First</option>
                  <option value="createdAt">Oldest First</option>
                  <option value="empName">Employee (A-Z)</option>
                  <option value="-empName">Employee (Z-A)</option>
                  <option value="department">Department (A-Z)</option>
              </select>
          </div>


          <div className='mt-5 bg-white py-1 px-10'>
              <div className='overflow-x-auto'>
                  <table className='text-left w-full' >
                      <thead>
                          <tr className='bg-white border-b-2 border-yellow-700 text-[#1a1a1a] text-xs font-normal'> {/**bg-[#D2B48C] */}
                              <th className='p-1'></th>
                              <th className='p-1'></th>
                              <th className='p-1'>Employee</th>
                              <th className='p-1'></th>
                              <th className='p-1'>Job</th>
                              <th className='p-1'>Start</th>
                              <th className='p-1'>End</th>
                              <th className='p-1'></th>
                              <th className='p-1'></th>
                          </tr>
                      </thead>

                      <tbody>

                          {list.length === 0
                              ? (<p className='ml-5 mt-5 text-xs text-[#be3e3f] flex items-start justify-start'>Your vacations requirement list is empty.</p>)
                              : list.map((vacation, index) => (

                                  <tr
                                      // key ={index}
                                      className='border-b-3 border-[#f5f5f5] text-xs font-normal text-[#1a1a1a] 
                                        hover:bg-[#F1E8D9] cursor-pointer'
                                  >
                                        <td className='p-1' hidden>{vacation._id}</td>
                                        <td className='p-1 bg-[#F1E8D9]'>{vacation.vacationType}</td>
                                        <td className='p-1'>{vacation.date ? new Date(vacation.date).toLocaleDateString('en-GB') : ''}</td>
                                        <td className='p-1'>{vacation.empName}</td>
                                        <td className='p-1 text-[#0ea5e9]'>{vacation.department}</td>
                                        <td className='p-1'>{vacation.jobTitle}</td>

                                        <td className='p-1'>{vacation.vacationStart ? new Date(vacation.vacationStart).toLocaleDateString('en-GB') : ''}</td>
                                        <td className='p-1'>{vacation.vacationEnd ? new Date(vacation.vacationEnd).toLocaleDateString('en-GB') : ''}</td>
                                        <td className='p-1'>{vacation.daysCount}</td>
                                        
                                      <td className='p-1 text-xs font-normal hide-print'>

                                          <select
                                              className= {`
                                                ${vacation.vacationStatus === 'Pending' ? 'text-orange-700 bg-orange-200'
                                                : 'text-green-600 bg-green-200'}
                                                ${vacation.vacationStatus === 'Rejected' ? 'text-red-800 bg-red-100'
                                                : 'text-green-600 bg-green-200'}
                                                px-2 py-1 text-xs font-normal rounded-sm cursor-pointer`
                                              }
                                              
                                                value={vacation.vacationStatus}
                                                onChange={(e) => handleStatusChange({ vacationId: vacation._id, vacationStatus: e.target.value })}
                                          >
                                                <option className='text-[#1a1a1a] rounded-sm cursor-pointer' value='Pending'>Pending</option>
                                                <option className='text-[#1a1a1a] rounded-sm cursor-pointer' value='Approved'>Approved</option>
                                                <option className='text-[#1a1a1a] rounded-sm cursor-pointer' value='Rejected'>Rejected</option>
                                          </select>
                                      </td>

                                  </tr>
                              ))}
                      </tbody>

                      {/* Footer Section */}
                      {list.length > 0 && (
                          <tfoot className='bg-[#F1E8D9] border-t-2 border-emerald-600 text-xs font-semibold text-[#1a1a1a] '>
                              <tr>
                                  <td className='p-2' colSpan={6}>Count : {list.length}</td>
                                  <td className='p-2 text-left'>

                                  </td>
                                  <td className='p-2 text-left text-[#be3e3f]'>

                                  </td>
                                  <td className='p-2 text-left text-sky-600 text-md'>

                                  </td>
                                  <td colSpan={2}></td>
                              </tr>
                          </tfoot>
                      )}

                  </table>

                  {/* Pagination  */}
                  {list.length > 0 && <PaginationControls />}

              </div>
          </div>


   <BottomNav />
   </section>
    );
};


export default Vacations ;