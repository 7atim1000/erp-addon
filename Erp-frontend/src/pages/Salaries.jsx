import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import BackButton from '../components/shared/BackButton';
import { MdDeleteForever } from 'react-icons/md';
import { BsCalendar2MonthFill, BsSearch } from "react-icons/bs";
import { BiSolidEditAlt } from 'react-icons/bi';
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { api, getDepartments } from '../https';
import { getAvatarName, getBgColor } from '../utils';
import { toast } from 'react-toastify';
import BottomNav from '../components/shared/BottomNav';


const Salaries = () => {
    const [department, setDepartment] = useState('all')
    const [empName, setEmpName] = useState('all')
    const [search, setSearch] = useState('')
    const [sort, setSort] = useState('')
    const [list, setList] = useState([]);

    // In your Salaries component
    const [pagination, setPagination] = useState({
        currentPage: 1,
        itemsPerPage: 10,
        totalItems: 0,
        totalPages: 1
    });

    const fetchSalaries = async () => {
        try {
            const res = await api.post('/api/salary/fetch', {
                empName,
                department,
                search,
                sort,

                page: pagination.currentPage,
                limit: pagination.itemsPerPage
            });
            
            setList(res.data.data || res.data.salaries || []);

            // Update pagination with response data or fallback to current values
            // Only update pagination if the response contains valid data
            if (res.data.pagination) {
                setPagination(prev => ({
                    ...prev,  // Keep existing values
                    currentPage: res.data.pagination.currentPage ?? prev.currentPage,
                    itemsPerPage: res.data.pagination.limit ?? prev.itemsPerPage,
                    totalItems: res.data.pagination.total ?? prev.totalItems,
                    totalPages: res.data.pagination.totalPages ?? prev.totalPages
                }));
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const isInitialMount = useRef(true);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            fetchSalaries();
        }
    }, [department, empName, search, sort, pagination.currentPage, pagination.itemsPerPage]);
 

     // Searrch
    const handleSearch = (e) => {
        e.preventDefault();
        fetchSalaries();
    }

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
                    <span className ='text-yellow-700'> {list.length} </span> 
                    of 
                    <span className ='text-yellow-700'> {pagination.totalItems} </span> 
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
                        <span className ='text-yellow-700'> {pagination.currentPage} </span> 
                        of 
                        <span className ='text-yellow-700'> {pagination.totalPages} </span>
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


    // Fetch departments   
    const { data: responseData, IsError } = useQuery({
        queryKey: ['departments'],
        queryFn: async () => {
            return await getDepartments();
        },
        placeholderData: keepPreviousData,
    });

    if (IsError) {
        toast.error('Something went wrong!');
    }

    const monthlyButton = [{ label: 'Monthly Salary', action: 'monthly', icon: <BsCalendar2MonthFill size={20} className='text-green-600' /> }]

    const navigate = useNavigate();
    const handleMonthlyModal = (action) => {
        if (action === 'monthly') navigate('/montlysalary')
    }


   

    return (
        <section className='flex gap-3 bg-[#f5f5f5] shadow-xl h-[calc(100vh)] overflow-y-scroll scrollbar-hidden'>
            <div className='flex-7 bg-white overflow-y-scroll scrollbar-hidden'>
               
                <div className='flex justify-between items-center px-5 py-2 mb-2 shadow-xl'>
                    <div className='flex items-center'>
                        <BackButton />
                        <h1 className='text-md font-semibold text-[#1a1a1a]'>Salaries Management</h1>
                    </div>

                    <div className='flex gap-2 items-center justify-around gap-3 hover:bg-yellow-700 shadow-lg/30 bg-white'>
                        {monthlyButton.map(({ label, icon, action }) => {
                            return (
                                <button
                                    onClick={() => handleMonthlyModal(action)}
                                    className='bg-white px-4 py-2 text-[#1a1a1a] cursor-pointer
                                    font-semibold text-xs flex items-center gap-2 rounded-full'>
                                    {label} {icon}
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* Search and Filter Section */}
                <div className='flex w-full shadow-xl items-center justify-between px-5 py-2 bg-gray-50'>
                    <form onSubmit={handleSearch} className='flex items-center gap-2 w-full'>
                        <div className='relative w-full justify-start'>
                            <BsSearch className='absolute left-3 top-3 text-gray-400' />
                            <input
                                type='text'
                                placeholder='Search by name or department...'
                                className='w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D2B48C] border border-[#D2B48C] text-xs font-normal'
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        {/* <button
                            type='submit'
                            className='bg-[#D2B48C] text-white px-4 py-2 rounded-lg flex items-center gap-2'
                        >
                            <BsSearch /> Search
                        </button> */}
                    </form>

                    <div className='flex items-center justify-end gap-2 w-[30%]'>
                        <label className='text-xs font-medium'>Sort by:</label>
                        <select
                            className='border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#D2B48C] border-[#D2B48C] text-xs font-medium'
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                        >
                            <option value=''>Default</option>
                            <option value='createdAt'>Newest First</option>
                            <option value='empName'>Employee Name (A-Z)</option>
                            <option value='department'>Department (A-Z)</option>
                        </select>
                    </div>
                </div>

                <div className='mt-5 bg-white py-1 px-10'>

                    <div className='overflow-x-auto'>
                        <table className='text-left w-full'>
                            <thead>
                                <tr className='bg-white border-b-2 border-yellow-700 text-[#1a1a1a] text-xs font-normal'>
                                    <th className='p-2'>Department</th>
                                    <th className='p-2'>Employee</th>
                                    <th className='p-2'>Job title</th>
                                    <th className='p-2'>Basic salary</th>
                                    <th className='p-2'>Subsistence</th>
                                    <th className='p-2'>Housing allowance</th>
                                    <th className='p-2'>Depotation allowance</th>
                                    <th className='p-2'>Incentives</th>
                                    <th className='p-2'>Total salary</th>
                                    <th className='p-2'>Monthly deduction</th>
                                    <th className='p-2'>Expected Salary</th>
                                    <th></th><th></th>
                                </tr>
                            </thead>

                            <tbody>
                                {list.length === 0
                                    ? (<p className='ml-5 mt-5 text-xs text-[#be3e3f] flex items-start justify-start'>Your salaries list is empty!</p>)
                                    : list.map((salary, index) => (
                                        <tr
                                            key={index}
                                            className='border-b-3 border-[#f5f5f5] text-xs font-normal text-[#1a1a1a] 
                                        hover:bg-[#F1E8D9] cursor-pointer'
                                        >
                                            <td className='p-2' hidden>{salary._id}</td>
                                            <td className='p-2' hidden>{salary.employeeNo}</td>
                                            <td className='p-2'>{salary.department}</td>
                                            <td className='p-2'>{salary.empName}</td>
                                            <td className='p-2'>{salary.jobTitle}</td>
                                            <td className='p-2'>{salary.basicSalary}</td>
                                            <td className='p-2'>{salary.subsistence}</td>
                                            <td className='p-2'>{salary.housingAllowance}</td>
                                            <td className='p-2'>{salary.depotationAllowance}</td>
                                            <td className='p-2'>{salary.incentives}</td>
                                            <td className='p-2'>{salary.finalSalary.toFixed(2)}</td>
                                            <td className='p-2 text-xs font-semibold text-[#be3e3f]'>{salary.deduction.toFixed(2)}</td>
                                            <td className='p-2 text-md font-semibold text-[#0ea5e9]'>{salary.expectedSalary.toFixed(2)}</td>
                                            <td className='p-2 text-center flex gap-4'>
                                                <button>
                                                    <BiSolidEditAlt
                                                    className='w-5 h-5 text-[#0ea5e9] rounded-full'/>
                                                </button>
                                                <button>
                                                    <MdDeleteForever 
                                                    className='w-5 h-5 text-[#be3e3f] rounded-full' />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>

                            {/* Footer Section */}
                            {list.length > 0 && (
                                <tfoot className='bg-[#F1E8D9] border-t-2 border-emerald-600 text-xs font-semibold text-[#1a1a1a]'>
                                    <tr>
                                        <td className='p-2' colSpan={8}>Employees : {list.length}</td>
                                        <td className='p-2 text-left'>
                                            {list.reduce((sum, salary) => sum + (salary.finalSalary || 0), 0).toFixed(2)}
                                        </td>
                                        <td className='p-2 text-left text-[#be3e3f]'>
                                            {list.reduce((sum, salary) => sum + (salary.deduction || 0), 0).toFixed(2)}
                                        </td>
                                        <td className='p-2 text-left text-sky-600 text-md'>
                                            {list.reduce((sum, salary) => sum + (salary.expectedSalary || 0), 0).toFixed(2)}
                                        </td>
                                        <td colSpan={2}></td>
                                    </tr>
                                </tfoot>
                            )}


                        </table>
                            
                        {list.length > 0 && <PaginationControls />}

                    </div>
                </div>
            </div>

            <div className='flex-1 bg-white h-[calc(100vh)] overflow-y-scroll scrollbar-hidden'>
                <div className='mt-3 h-full overflow-y-scroll scrollbar-hidden'>
                    {responseData?.data.data.map(department => (
                        <div className='flex items-center justify-between gap-1 px-0 mx-1 mb-2  bg-white shadow-xl'>
                            <button
                                className='mx-auto items-center w-[90%] p-3 cursor-pointer text-yellow-700 
                                rounded-lg font-semibold text-sm flex items-center gap-2'
                                onClick={() => setDepartment(department.departmentName)}
                            >
                                {department.departmentName}
                            </button>
                            <button className='text-[#f5f5f5] text-md font-semibold rounded-full shadow-lg w-[50px] h-[40px] my-1'
                                style={{ backgroundColor: getBgColor() }}
                            >
                                {getAvatarName(department.departmentName)}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* <BottomNav /> */}
        </section>
    );
};

export default Salaries;