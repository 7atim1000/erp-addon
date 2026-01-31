import React, {useState, useEffect} from 'react' ;
import { api, getDepartments } from '../https';
import BackButton from '../components/shared/BackButton';

import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { getAvatarName, getBgColor } from '../utils';

const CompanyMap = () => {
    const [department, setDepartment] = useState('all');
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('department');

    const [list, setList] = useState([]);

    // Fetch Function:
        const fetchEmployees = async (search = '') => {
            try {
               
                const response = await api.post('/api/employee/fetch', 
                    // { sort }, { params: {search} }
                   {
                       empName: 'all',
                       department,
                       search,
                        // sort: sort === 'createdAt' ? '-createdAt' : sort,
                       sort,
    
                       page: 1,
                       limit: 1000
                   }
                );
                
                // Use whichever property your backend returns the data in
                setList(response.data.data || response.data.employees || []);

            } catch (error) {
                console.error('Error fetching salaries:', error);
                toast.error(error.message);
            }
           
        };
    
        useEffect(() => {
          fetchEmployees();
        }, [department, search]); 


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
        

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchEmployees(search);
        }, 500); // 500ms delay

        return () => clearTimeout(timer);
    }, [search, sort]);

    useEffect(() => {
        fetchEmployees();
    }, []);


    return(
         <section className='flex gap-3 bg-[#f5f5f5] shadow-xl h-[calc(100vh)] overflow-y-scroll scrollbar-hidden'>
          
            <div className='flex-7 h-full bg-white overflow-y-scroll scrollbar-hidden'>
                <div className='flex items-center px-5 shadow-xl py-2'>
                    <BackButton />
                    <h1 className='text-lg font-semibold text-[#1f1f1f]'>Company Map</h1>
                </div>

                <div className='grid grid-cols-4 gap-2 px-10 py-4 w-[100%]  rounded-lg overflow-y-scroll scrollbar-hidden  h-[calc(100vh)]'>

                    {list.map((employee, index) => (
                        
                        <div
                            // key={item._id}
                            className ='shadow-xl'
                          
                            style={{
                                cursor: 'pointer',
                                border: employee._id === employee._id ? '2px solid [#d2b48c]' : 'none',
                                borderRadius: '8px',
                                padding: '12px',
                                background: '#fff',
                                marginBottom: '8px',

                                height: "145px",
                                boxShadow: '0 2px 8px [#d2b48c]'
                            }}    // #eab308
                        >
                            <div className ='flex items-center justify-between gap-1  mb-2'>
                                <img src={employee.image} className='w-12 h-12 rounded-full flex justify-center border-b-3 border-yellow-700' />
                                <h3 style={{ fontWeight: 'bold', color: '#1a1a1a' }} className='text-sm font-semibold'>{employee.empName}</h3>
                            </div>
                            
                     
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginTop: '4px' }}>
                                <span className='text-sm underline font-semibold text-yellow-700'>{employee.department}</span>
                                <span style={{ color: '#0ea5e9' }} className='text-xs font-semibold'>{employee.empJob}</span>
                            </div>

                            {/* Add more fields if you want */}
                            <div className='flex justify-between gap-2 mt-2 items-center'>
                                <span className='text-[#1a1a1a] font-normal text-xs'>Job date : </span>
                                <p className='text-[#0ea5e9] text-xs font-normal'><span className='underline'>
                                    {new Date(employee.jobDate).toLocaleDateString('en-GB')}</span>
                                </p>
                            </div>

                            <div className='flex justify-between gap-2 mt-2 items-center'>
                                <span className='text-[#1a1a1a] font-normal text-xs'>Conact : </span>
                                <p className='text-[#0ea5e9] text-xs font-normal'><span className='underline'>
                                    {employee.contactNo}</span>
                                </p>
                            </div>

                            {/* <div className='flex justify-center items-center w-full mt-5'>
                                <button
                                    className='w-12 h-12 flex justify-center items-center text-sm font-bold rounded-full text-white'
                                    style={{ backgroundColor: getBgColor() }}
                                >
                                    {getAvatarName(employee.empName)}
                                </button>
                            </div> */}

                        </div>
                    ))}

                </div>




            </div>
           
            <div className='flex-1 bg-white h-[100%] overflow-hidden flex flex-col'>
                
                {/* Search [#d2b48c] */}
                <div className="flex items-center px-1 py-2 shadow-xl mt-2 w-full shadow-xl">
                    <input
                        type="text"
                        placeholder="Search employees..."
                        className="w-full  p-1 py-2 rounded-lg w-full text-xs font-semibold border-b border-yellow-700"
                        value= {search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className='overflow-y-auto scrollbar-hidden flex-1 mt-10'>
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

         </section>
    );
};


export default CompanyMap ;