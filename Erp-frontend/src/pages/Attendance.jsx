import React , { useState ,useEffect } from 'react'
import BackButton from '../components/shared/BackButton';
import { api, updateDeduction } from '../https';
import { toast } from 'react-toastify'

import { useSelector } from 'react-redux'
import { GiConfirmed } from "react-icons/gi";


const Attendance = () => {
    const userData = useSelector((state) => state.user);
    const salaryMinute = (userData.userSalary / 9600)  // 9600 = 160Houre * 60 

    const [department, setDepartment] = useState('all');
    const [empName, setEmpName] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('desc'); // Default: newest first


    // what is diff between serverSide and Client Side :-
    const [list, setList] = useState([]);

    const fetchAttendance = async () => {

        try {

            const res = await api.post('/api/attendance/fetch',
                { 
                    empName, 
                    department,
                    search: searchTerm,
                    sort: sortOrder
               }
            );

            setList(res.data)
            //setList(res.data.cart)
            console.log(res.data)

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    };

    //console.log(employee, department)

    useEffect(() => {

        fetchAttendance();

    }, [department, searchTerm, sortOrder])  // with out department

    // Debounce search to avoid too many API calls
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const toggleSortOrder = () => {
        setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    };

    return (
        
        <section className ='flex h-[calc(100vh)] overflow-y-scroll scrollbar-hidden'> 
            <div className='flex-7 bg-white h-[calc(100vh)] overflow-y-scroll scrollbar-hidden'>

                <div className='flex justify-between items-center px-5 py-2 shadow-xl mb-2'>

                    <div className='flex justify-between items-center'>
                        <BackButton />
                        <div className='flex items-center gap-5'>
                            <h1 className='text-md font-semibold text-[#1a1a1a]'>Attendance Management</h1>
                        </div>
                    </div>

                </div>


                {/* Search and Sort Controls */}
                <div className='flex justify-between items-center p-3 gap-2 shadow-xl'>
                    <input
                        type ="text"
                        placeholder ="Search by name, department..."
                        className ='p-2 border rounded text-xs w-64 w-full border-yellow-700'
                        value ={searchTerm}
                        onChange ={handleSearchChange}
                    />

                    <button
                        onClick={toggleSortOrder}
                        // [#D2B48C]
                        className='p-1 bg-[#F1E8D9] text-xs font-normal rounded-sm hover:bg-[#c4a87c] cursor-pointer shadow-lg/30'
                    >
                        Sort by Date: {sortOrder === 'asc' ? 'Oldest First' : 'Newest First'}
                    </button>
                </div>



                <div className='mt-3 bg-white py-1 px-10'>

                    <div className='overflow-x-auto'>
                        <table className='text-left w-full'>
                            <thead>
                                <tr className='bg-white border-b-2 border-yellow-700 text-[#1a1a1a] text-xs font-normal'>
                                    <th></th>
                                    <th className='p-2'>Department</th>
                                    <th className='p-2'>Employee</th>
                                    <th className='p-2'>Job title</th>

                                    {/* <th className='p-2'>Default time</th> */}
                                    <th className='p-2'>Attendance time</th>
                                    <th className='p-2'>Delay time</th>
                                    <th className='p-2'>Salary</th>
                                    
                                    <th>Salary deduction</th>
                                    <th></th>
                                   
                              
                                </tr>
                            </thead>

                            <tbody>

                                {list.length === 0 ? (
                                    <tr>
                                        <td colSpan="9" className='ml-5 mt-5 text-xs text-red-700 flex items-start justify-start'>
                                            Your attendance list is empty.
                                        </td>
                                    </tr>
                                ) : (
                                    list.map((attendance, index) => (
                                        <tr
                                            key={index}
                                            className='border-b-3 border-[#f5f5f5] text-xs font-normal text-[#1a1a1a] 
                                        hover:bg-[#F1E8D9] cursor-pointer'
                                        >

                                            <td className='p-2' hidden>{attendance._id}</td>
                                            <td className='p-2 hidden' >{attendance.employeeNo}</td>
                                             <td className='p-2'>{attendance.date? new Date(attendance.date).toLocaleDateString('en-GB') : ''}</td>
                                            <td className='p-2' >{attendance.department}</td>
                                            <td className='p-2' >{attendance.empName}</td>
                                            <td className='p-2'>{attendance.jobTitle}</td>

                                            <td className={`p-2 ${attendance.attendanceType === 'Attendance' 
                                                ?"text-green-600 text-xs font-medium" 
                                                :"text-sky-600 text-xs font-medium"
                                            }`}>{attendance.attendanceTime}
                                                <p className ='text-white inline'>--</p>
                                                <span className ='text-xs font-normal underline inline'> {attendance.attendanceType}</span>
                                            </td>
                                            {/* <td className='p-2 text-xs font-semibold'>{attendance.defaultAttenTime}</td> */}
                                            <td className='p-2 text-xs text-[#be3e3f] font-semibold'>{attendance.delayAttenTime}
                                                <p className ='text-white inline'>--</p>
                                                <span className ='text-xs font-normal text-black underline inline'> Minutes</span>
                                            </td>


                                            <td className='p-2 text-xs font-semibold'>{attendance.empSalary}</td>
                                            
                                            {/* hidden */}
                                            <td className ='p-2 text-xs font-semibold hidden'>{salaryMinute.toFixed(3)}</td>
                                           
                                            <td className ={`${attendance.attendanceType === "Attendance" ? "text-[#be3e3f]"
                                                 : "text-black"} p-2 text-xs font-semibold`}>

                                                {attendance.attendanceType === "Attendance"

                                                    // ? (attendance.delayAttenTime * salaryMinute).toFixed(3)
                                                    ? (attendance.delayAttenTime * (attendance.empSalary / 9600)).toFixed(2)
                                                    : 0}
                                            </td>

                                                                       
                                            <td className='p-2 text-center flex gap-4'>
                                                <button>
                                                    <GiConfirmed  size={20} className='w-6 h-6 text-sky-600 rounded-full shadow-lg/30 flex justify-end cursor-pointer'
                                                    onClick = {()=> {

                                                            updateDeduction({

                                                            empNo: attendance.employeeNo,
                                                            //   deduction: Number(formData.finalSalary)
                                                            deduction : (attendance.delayAttenTime * salaryMinute).toFixed(3),
                                                            expectedSalary : userData.userSalary -(attendance.delayAttenTime * salaryMinute).toFixed(3),
                                                          })

                                                                toast.success('The deduction accounted successfully .')

                                                                .then(res => {
                                                                  // handle success (e.g., show a message, close modal, refresh data)
                                                                })
                                                                .catch(err => {
                                                                  // handle error (e.g., show error message)  + PAST DEDUCTION
                                                                });

                                                    }}
                                                    />
                                                </button>
                                          
                                            </td>


                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>

                    </div>

                </div>

            </div>

        </section>
    );
};




export default  Attendance ;