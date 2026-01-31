 import React, { useState, useEffect } from 'react'
 import { FcSearch } from "react-icons/fc";

import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { enqueueSnackbar } from 'notistack'

import { getBgColor } from '../../utils';
import { GrRadialSelected } from 'react-icons/gr';
import { api, getDepartments } from '../../https';
import SalariesCard from './SalariesCard';

const SalaryContainer = () => {

    const [department, setDepartment] = useState('all')
    const [empName, setEmpName] = useState('all')
    const [list, setList] = useState([]);
    const [search, setSearch] = useState('');

const fetchAllSalaries = async () => {
  try {
    // Request all records by setting a high limit and ignoring other parameters
    const res = await api.post('/api/salary/fetch', {

      empName: 'all',   // Ignore filtering by employee name
      department,       // with filtering by department
      //search: '',       // Empty search string
      search,
      sort: '',         // No sorting
      page: 1,          // First page
      limit: 1000       // Large number to get all records
    });

    // Use whichever property your backend returns the data in
    setList(res.data.data || res.data.salaries || []);
    
  } catch (error) {
    console.error('Error fetching salaries:', error);
    toast.error(error.message);
  }
};

useEffect(() => {
  fetchAllSalaries();
}, [department, search]); 


    // Fetch department
    const { data: responseData, IsError } = useQuery({

        queryKey: ['departments'],
        queryFn: async () => {
            return await getDepartments();
        },

        placeholderData: keepPreviousData,
    });


    if (IsError) {
        enqueueSnackbar('Something went wrong!', { variant: 'error' });
    }

    console.log(responseData);


    

    
    return (
       <>

            <div className='flex h-full gap-1 justify-start items-start p-1'>

                <div className='flex flex-col justify-between bg-white p-2 w-[20%]'>

                    {responseData?.data.data.map(depart => (

                        <button className='w-[100%] bg-[#f5f5f5] grid grid-cols-1 p-1 items-center gap-3 mb-3 rounded-lg 
                        h-[50px] cursor-pointer shadow-lg/30 text-[#1a1a1a]'
                            // style={{ backgroundColor: getBgColor() }}
                            onClick={() => setDepartment(depart.departmentName)}
                        >

                            <div className='flex items-center  justify-between shadow-lg/30 p-2'>

                                <p className='text-xs font-semibold'>{depart.departmentName}</p>
                                {department === depart.departmentName && <GrRadialSelected className='text-green-600' size={20} />}

                            </div>

                        </button>

                    ))}

                </div>


                {/* grid grid-cols-3 */}
                <div className=' flex w-[80%] flex-col justify-between items-center gap-2 w-full p-3 bg-white shadow-xl/30'>
                   
                    {/*SEARCH*/}
                    <div className='flex items-center  bg-white p-1 w-full shadow-xl'>
                        <FcSearch className='text-sky-600' />

                        <input
                            type='text'
                            placeholder="Search by name or department..."
                            className='bg-transparent outline-none text-[#1a1a1a] w-full border-b-1 border-yellow-700 p-2 text-xs font-medium'

                            value ={search}
                            onChange ={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className='flex w-full items-start justify-start flex-wrap gap-2 px-2 py-1 bg-white overflow-y-scroll
                     scrollbar-hidden   h-[calc(100vh-8rem)]'>
                        {
                            list.map((salary, index) => (

                                <SalariesCard id={salary._id} department={salary.department} 
                                    employeeNo={salary.employeeNo} empName={salary.empName} 
                                    jobTitle={salary.jobTitle} final={salary.finalSalary}  
                                    deduction={salary.deduction} expected={salary.expectedSalary} 
                                    // image ={}
                                    />
                            ))}

                    </div>
                </div>


            </div>

        {/* <div className='grid grid-cols-6 gap-4 px-10 py-4 mt-0 w-[100%] bg-white rounded-lg'> */}
       
             

            
         

           

             

              

           
         

       
       </>
    );
};


export default SalaryContainer ;