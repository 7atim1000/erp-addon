import React, { useState , useEffect, useRef } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { MdDeleteForever, MdOutlineAddToDrive } from "react-icons/md";
import { LiaEditSolid } from "react-icons/lia";
import { BsDatabaseAdd } from "react-icons/bs";
import { RxUpdate } from "react-icons/rx";
import { IoIosRefresh } from "react-icons/io";
import { WiTime4 } from "react-icons/wi";

import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify';

import BackButton from '../components/shared/BackButton';
import BottomNav from '../components/shared/BottomNav';

import { api, getDepartments } from '../https';
import AddEmployee from '../components/hr/AddEmployee';
import AddSalary from '../components/hr/AddSalary';
import { setEmployee } from '../redux/slices/employeeSlice';
import SalaryDetails from '../components/hr/SalaryDetails';
import EmployeeEditModal from '../components/hr/EmployeeEditModal';
import AttendanceDetails from '../components/hr/AttendanceDetails';
import { getAvatarName, getBgColor } from '../utils';

const Employees = () => {
   
    const dispatch = useDispatch();

    // 1- add employee
    const Button = [{ label: 'Add Employee', icon: <MdOutlineAddToDrive className='text-yellow-700' size={20} />, action: 'employee' }];
    const [isAddEmployeeModal, setIsAddEmployeeModal] = useState(false);

    const handleAddEmployeeModal = (action) => {
        // dispatch(setEmployee({ empId }));

        if (action === 'employee') setIsAddEmployeeModal(true);
    }; 

    // 2- add salary
    const salaryAddButton = [{ label :'', icon : <BsDatabaseAdd className ='text-sky-600' size ={18}/> , action :'salary'}] ;
    const [isAddSalaryModal, setIsAddSalaryModal] = useState(false);

    const handleSalaryModal =(action, empId, employeeNo, empName, contactNo, empSalary, department, empJob) => {
          //employee._id, employee.empName, employee.contactNo, employee.empSalary, employee.department
        dispatch(setEmployee({ empId, employeeNo, empName,  contactNo, empSalary, department, empJob}));
        if (action === 'salary') setIsAddSalaryModal(true);

        // console.log(empId, empName, department, empSalary)
    };

    // 2- update salary
    const salaryUpdateButton = [{ label :'Update Salary', icon : <RxUpdate  className ='text-yellow-600' size ={18}/> , action :'salary'}] ;

    
    // 3- salary details
    const [isDetailsSalaryModal, setIsDetailsSalaryModal] = useState(false);
    const handleDetailsSalaryModal = (empId, empName, contactNo, empSalary, department ) => {
        dispatch(setEmployee({ empId, empName, contactNo, empSalary, department }));
        setIsDetailsSalaryModal(true);
        // console.log(customerId)
    };

    // 4 Attendance details 
    const attendanceButton = [{ label :'', action :'attendance', icon :<WiTime4 size={18}/>}]
    const [isAttendanceModal, setIsAttendanceModal] = useState(false);
    
    const handleAttendanceModal = (empId, empName, department, action) => {
        dispatch(setEmployee({ empId, empName, department }));
        if (action === 'attendance') setIsAttendanceModal(true);

        // console.log(customerId, customerName , balance)
    };
    
    // fetch employees - any error on .map or length check next function
    const [list, setList] = useState([]);
    // const [searchTerm, setSearchTerm] = useState('');
    // Search Implementation:
    const [search, setSearch] = useState(''); // Match backend parameter name
    const [sort, setSort] = useState('-createdAt');
    // -createdAt(frontend) → { createdAt: -1 } (backend DESC)

    // createdAt(frontend) → { createdAt: 1 } (backend ASC)
    const [department, setDepartment] = useState('all');
    const [empName, setEmpName] = useState('all');

    const [pagination, setPagination] = useState({
        currentPage: 1,
        itemsPerPage: 10,
        totalItems: 0,
        totalPages: 1
    });


    const [isEditEmployeeModal, setIsEditEmployeeModal] = useState(false);
    const [currentEmployee, setCurrentEmployee] = useState(null);

    // Fetch Function:
    const fetchEmployees = async (search = '') => {
        try {
           
            const response = await api.post('/api/employee/fetch', 
                // { sort }, { params: {search} }
               {
                    empName,
                    department,

                    search,
                    sort,
                    // sort: sort === 'createdAt' ? '-createdAt' : sort,
                    page: pagination.currentPage,
                    limit: pagination.itemsPerPage
               }
            );
            
            if (response.data.success) {
                //setList(response.data.employees)
                setList(response.data.data || response.data.employees || []);

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
                fetchEmployees();
            }
        }, [department, empName, search, sort, pagination.currentPage, pagination.itemsPerPage]);

    
    
    // Edit employee
    const handleEdit = (employee) => {
        setCurrentEmployee(employee);
        setIsEditEmployeeModal(true);
    };


    
    // Removing
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);    // for remove
    const [selectedEmployee, setSelectedEmployee] = useState(null);   // for remove

    const removeEmployee = async (id) => {

        try {
            const response = await api.post('/api/employee/remove', { id },)
            if (response.data.success) {
                toast.success(response.data.message)

                //Update the LIST after Remove
                await fetchEmployees();

            } else {
                toast.error(response.data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    };


    // search - sorting - Debounce search to avoid too many API calls
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchEmployees(search);
        }, 500); // 500ms delay

        return () => clearTimeout(timer);
    }, [search, sort]);

    // Initial fetch
    useEffect(() => {
        fetchEmployees();
    }, []);

//     // Add this useEffect for debounced search
// useEffect(() => {
//   const timer = setTimeout(() => {
//     if (isInitialMount.current) {
//       isInitialMount.current = false;
//     } else {
//       fetchEmployees();
//     }
//   }, 500); // 500ms debounce delay

//   return () => clearTimeout(timer);
// }, [search]); // Only trigger when search term changes
   

    // Fetch departments   
    const { data: resData, IsError } = useQuery({
        queryKey: ['departments'],
        queryFn: async () => {
            return await getDepartments();
        },
        placeholderData: keepPreviousData,
    });

    if (IsError) {
        toast.error('Something went wrong!');
    }


   
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


    return (
        <section className='flex gap-3 bg-[#f5f5f5] shadow-xl h-[calc(100vh)] overflow-y-scroll scrollbar-hidden'>

            {/* Left sidebar - Departments */}
            <div className='flex-1 bg-white h-[100%] overflow-hidden flex flex-col'>
                
                <div className='overflow-y-auto scrollbar-hidden flex-1'>
                    {resData?.data.data.map(department => (
                        <div className='flex items-center justify-between gap-1 px-0 mx-1 mb-2 bg-white shadow-xl'>
                            <button
                                className='mx-auto items-center w-[90%] p-3 cursor-pointer text-[#1a1a1a] 
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


            
            <div className='flex-7 h-full bg-white overflow-y-scroll scrollbar-hidden'>
            
            <div className='flex items-center justify-between px-8 py-3 shadow-xl'>
                <div className='flex items-center'>
                    <BackButton />
                    <h1 className='text-md font-semibold text-[#1a1a1a]'>Employees Management</h1>
                </div>

                <div className='flex gap-2 items-center justify-around gap-3'>
                    
                    <IoIosRefresh onClick ={() => window.location.reload()} className ='w-4 h-4 text-sky-600 text-sm font-bold'/>
                    
                        <div className='flex gap-2 items-center justify-around gap-3 hover:bg-yellow-700 shadow-lg/30 bg-white'>
                            {Button.map(({ label, icon, action }) => {
                                return (
                                    <button

                                        onClick={() => handleAddEmployeeModal(action)}

                                        className='bg-white px-4 py-2 text-[#1a1a1a] cursor-pointer
                                    font-semibold text-xs flex items-center gap-2 rounded-full'>
                                        {label} {icon}
                                    </button>
                                )
                            })}

                        </div>
                   


                </div> 

                {isAddEmployeeModal && 
                <AddEmployee 
                setIsAddEmployeeModal ={setIsAddEmployeeModal} 
                fetchEmployees ={fetchEmployees}
                />
                } 

            </div>

            {/* Search and sorting */}
            <div className="flex items-center px-15 py-2 shadow-xl">
                <input
                    type="text"
                    placeholder="Search employees..."
                    className="border border-[#D2B48C] p-1 rounded-lg w-full text-sm font-semibold"
                    // max-w-md
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                {/* Optional: Sort dropdown */}
                <select
                    className="ml-4 border border-[#D2B48C] p-1  rounded-lg text-[#1f1f1f text-sm font-semibold] cursor-pointer "
                    value={sort}

                    onChange={(e) => {
                        setSort(e.target.value);
                        setPagination(prev => ({ ...prev, currentPage: 1 })); // Reset to first page when changing sort
                    }}
                >
                    <option value="-createdAt">Newest First</option>
                    <option value="createdAt">Oldest First</option>
                    <option value="empName">Name (A-Z)</option>
                    <option value="-empName">Name (Z-A)</option>
                    <option value="department">Department (A-Z)</option>
                </select>
            </div>

         
            <div className='mt-5 bg-white py-1 px-2' >
                <div className='overflow-x-auto'>
                    <table className='text-left w-full'>
                        <thead>
                            <tr className='bg-white border-b-2 border-yellow-700 text-[#1a1a1a] text-xs font-normal'> {/**bg-[#D2B48C] */}
                                <th className='p-1'>Employemnt history</th>
                                <th></th><th></th>
                                <th className='p-1'>Name</th>
                                <th className='p-1'>Job No</th>
                                <th className='p-1'>Contact No</th>
                                <th className='p-1'>Address</th>
                                <th className='p-1'>Email</th>
                                <th className='p-1'>Job</th>
                                <th className='p-1'>Salary</th>

                                <th className='p-1' style={{ marginRight: '0px' }}></th>
                            </tr>
                        </thead>

                        <tbody>

                            {list.length === 0
                                ? (<p className='ml-5 mt-5 text-xs text-[#be3e3f] flex items-start justify-start'>Your employees list is empty . Start adding employee !</p>)
                                : list.map((employee, index) => (

                                    <tr
                                        // key ={index}
                                        className='border-b-3 border-[#f5f5f5] text-xs font-normal text-[#1a1a1a] 
                                        hover:bg-[#F1E8D9] cursor-pointer'
                                    >
                                        <td className='p-1' hidden>{employee._id}</td>
                                        <td className='p-1' hidden>{employee.employeeNo}</td>
                                        <td className='p-1'>{employee.jobDate ? new Date(employee.jobDate).toLocaleDateString('en-GB') : ''}</td>
                                       
                                        <td className='p-1 bg-[#F1E8D9]'>{employee.department}</td>
                                        <td className ='p-1'><img className ='rounded-full border-b-2 border-yellow-700 w-9 h-9' src ={employee.image}/></td>
                                        <td className='p-1'>{employee.empName}</td>
                                        <td className='p-1'>{employee.jobNo}</td>
                                        <td className='p-1'>{employee.contactNo}</td>
                                        <td className='p-1'>{employee.address}</td>
                                        <td className='p-1'>{employee.email}</td>
                                        <td className='p-1'>{employee.empJob}</td>
                                       
                                        <td className ='p-1'>
                                            <button className ={`${employee.empSalary === 0 ? "text-orange-600" : "text-green-600"}
                                            text-sm font-semibold cursor-pointer`}

                                            onClick = {() => handleDetailsSalaryModal(employee._id, employee.empName, employee.contactNo, employee.empSalary, employee.department)}
                                            >
                                                <span className ='text-xs font-semibold underline'>{employee.empSalary.toFixed(2)}</span>
                                                <span className ='text-xs font-normal text-[#1a1a1a]'> AED</span>
                                            </button>
                                        </td>
                                    
                                        <td className='p-1  flex flex-wrap gap-2  justify-center bg-zinc-1' style={{ marginRight: '0px' }}>
                                            {/* addSalary */}
                                                {employee.empSalary === 0 && salaryAddButton.map(({ label, icon, action }) => {

                                                return (
                                                    <button title ="Add Salary" className='cursor-pointer 
                                                    py-2 rounded-lg text-sky-500 text-xs font-semibold text-sm flex items-center gap-2'
                                                        onClick={() => handleSalaryModal(action, employee._id, employee.employeeNo,  employee.empName, 
                                                            employee.contactNo, employee.empSalary, employee.department, employee.empJob  // empId, empName,  contactNo, empSalary, department
                                                        )}
                                                    >
                                                        {label} {icon}
                                                    </button>
                                                )
                                            })}

                                            {/* {employee.empSalary > 0 && salaryUpdateButton.map(({ label, icon, action }) => {

                                                return (
                                                    <button title="Add Salary" className='cursor-pointer 
                                                    py-2 rounded-lg text-yellow-600 text-xs font-semibold text-sm flex items-center gap-2'
                                                        onClick={() => handleSalaryModal(action, employee._id, employee.empName,
                                                            employee.department, employee.empSalary
                                                        )}
                                                    >
                                                        {label} {icon}
                                                    </button>
                                                )
                                            })} */}
                                            
                                           
                                            <button className={`cursor-pointer text-sm font-semibold `}>
                                                <LiaEditSolid 
                                               
                                               onClick={() => handleEdit(employee)}
                                                size={20}
                                                className='w-5 h-5 text-sky-600 rounded-full hover:bg-[#0ea5e9]/30'  />
                                            </button>

                                            <button className={`text-[#be3e3f] cursor-pointer text-sm font-semibold`}>
                                                <MdDeleteForever 
                                                    onClick={() => { setSelectedEmployee(employee); setDeleteModalOpen(true); }} 
                                                    size={20}
                                                    className='w-5 h-5 text-[#be3e3f] rounded-full hover:bg-[#be3e3f]/30' />
                                            </button>

                                            
                                            {/* Attendance details */}
                                            {attendanceButton.map(({ label, icon, action }) => {

                                                return (
                                                    <button className='cursor-pointer 
                                                        py-2 rounded-lg text-green-600 font-semibold text-xs font-normal'
                                                        onClick={() => handleAttendanceModal(employee._id, employee.empName, employee.department, action)}
                                                    >
                                                        {label} {icon}
                                                    </button>
                                                )
                                            })}

                                        </td>



                                    </tr>
                                ))}
                        </tbody>

                        {/* Footer Section */}
                        {list.length > 0 && (
                            <tfoot className='bg-[#F1E8D9] border-t-2 border-[#D2B48C] text-xs font-semibold'>
                                <tr>
                                    <td className='p-2' colSpan={8}>Employees : {list.length}</td>
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

                {isAddSalaryModal && <AddSalary setIsAddSalaryModal ={setIsAddSalaryModal} />}

                {isDetailsSalaryModal && <SalaryDetails setIsDetailsSalaryModal ={setIsDetailsSalaryModal} />}
                {isAttendanceModal && <AttendanceDetails setIsAttendanceModal ={setIsAttendanceModal} />}

              
                {/* Edit Employee Modal */}
                {isEditEmployeeModal && currentEmployee && (
                    <EmployeeEditModal 
                        employee= {currentEmployee}
                        setIsEditEmployeeModal= {setIsEditEmployeeModal}
                        fetchEmployees= {fetchEmployees}

                        // const [isEditEmployeeModal, setIsEditEmployeeModal] = useState(false);
                        // const [currentEmployee, setCurrentEmployee] = useState(null);

                    />
                )}


            </div>
            </div>

        

            {/* <BottomNav /> */}

            {/* Place the ConfirmModal here */}
            <ConfirmModal
                open={deleteModalOpen}
                empName={selectedEmployee?.empName}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={() => {
                    removeEmployee(selectedEmployee._id);
                    setDeleteModalOpen(false);
                }}
            />

        </section>
    )
};


// You can put this at the bottom of your Services.jsx file or in a separate file
const ConfirmModal = ({ open, onClose, onConfirm, empName }) => {
    if (!open) return null;
    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{ backgroundColor: 'rgba(243, 216, 216, 0.4)' }}  //rgba(0,0,0,0.4)
        >

            <div className="bg-white rounded-lg p-6 shadow-lg min-w-[300px]">
                {/* <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2> */}
                <p className="mb-6">Are you sure you want to remove <span className="font-semibold text-[#be3e3f]">{empName}</span> ?</p>
                <div className="flex justify-end gap-3">
                    <button
                        className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 cursor-pointer"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 rounded bg-[#be3e3f] text-white cursor-pointer"
                        onClick={onConfirm}
                    >
                        Delete
                    </button>
                </div>
            </div>

        </div>
    );
};

export default Employees ;