import React , {useState, useEffect} from 'react'
import fileUpload from '../../assets/images/file-upload.jpg'

import { useMutation } from '@tanstack/react-query'
import { addEmployee, register, api } from '../../https';
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'

import { enqueueSnackbar } from 'notistack';
import { IoCloseCircle } from 'react-icons/io5'; 

const AddEmployee = ({setIsAddEmployeeModal, fetchEmployees}) => {

    const [empImg, setEmpImg] = useState(false)

    const [employeeNo, setEmployeeNo] = useState(`${Date.now()}`)
    const [empName, setEmpName] = useState('')
    const [contactNo, setContactNo] = useState('')
    const [address, setAddress] = useState('')
    const [email, setEmail] = useState('')
    const [jobNo, setJobNo] = useState('')
   
    const [department, setDepartment] = useState('')
    const [empJob, setEmpJob] = useState('')
    const [jobDate, setJobDate] = useState(new Date().toISOString().slice(0, 10))

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Handle image selection
    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setEmpImg(e.target.files[0]);
        }
    };

    // Combined mutation for employee and user creation
    const createEmployeeMutation = useMutation({

        mutationFn: async (formData) => {
            // First create employee with image
            const employeeResponse = await api.post('/api/employee', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (!employeeResponse.data.success) {
                throw new Error(employeeResponse.data.message);
            }

            // Then register user with the same image
            const registerResponse = await api.post('/api/auth/register', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return {
                employee: employeeResponse.data,
                user: registerResponse.data,
         
            };
        },
        onSuccess: (data) => {
            toast.success('Employee and user account created successfully');
            resetForm();
               
        },
        
        onError: (error) => {
            toast.error(error.response?.data?.message || error.message || 'An error occurred');
        },
        onSettled: () => {
            setIsSubmitting(false);
        }
    });



    const onSubmitHandler = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);

        try {
            // Validation
            if (!empImg) {
                toast.error('Please select an image');
                return;
            }

            if (!empName || !contactNo || !email || !department) {
                toast.error('Please fill all required fields');
                return;
            }

            // Prepare form data
            const formData = new FormData();
            formData.append('image', empImg);
            formData.append('employeeNo', employeeNo);
            formData.append('empName', empName);
            formData.append('name', empName); // For user registration
            formData.append('contactNo', contactNo);
            formData.append('phone', contactNo); // For user registration
            formData.append('address', address);
            formData.append('email', email);
            formData.append('jobNo', jobNo);
            formData.append('department', department);
            formData.append('empJob', empJob);
            formData.append('userJob', empJob); // For user registration
            formData.append('jobDate', jobDate);
            formData.append('password', '000000'); // Default password
            formData.append('role', 'Employee');
            formData.append('userSalary', '0');

            // Execute the combined mutation
            await createEmployeeMutation.mutateAsync(formData);
            
            fetchEmployees();

        } catch (error) {
            console.error('Error in onSubmitHandler:', error);
        } finally {
            setIsSubmitting(false);
        }
    };


    const resetForm = () => {
        setEmpImg(null);
        setEmployeeNo(`${Date.now()}`);
        setEmpName('');
        setContactNo('');
        setAddress('');
        setEmail('');
        setJobNo('');
        setDepartment('');
        setEmpJob('');
        setJobDate(new Date().toISOString().slice(0, 10));
    };


    const handleClose = () => {
        setIsAddEmployeeModal(false);
    };



    const [departList, setDepartList] = useState([])
    const fetchDepartment = async () => {
        try {

            const response = await api('/api/department/') // get Method not post Method
            if (response.data.success) {
                setDepartList(response.data.departments);
            }
            else {
                toast.error(response.data.message)
            }


        } catch (error) {
            console.log(error)
            toast.error(error.message)

        }
    }


    // Unit fetch
    const [jobList, setJobList] = useState([])
    const fetchJob = async () => {
        try {

            const response = await api.get('/api/job/') 
            if (response.data.success) {
                setJobList(response.data.jobs);
            }
            else {
                toast.error(response.data.message)
            }


        } catch (error) {
            console.log(error)
            toast.error(error.message)

        }
    }



    useEffect(() => {
        fetchDepartment(), fetchJob()
    }, []);




    return (

        <div className='fixed inset-0 bg-opacity-50 flex items-center justify-center shadow-lg/10 z-50' 
        style={{ backgroundColor: 'rgba(20, 10, 10, 0.4)' }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ durayion: 0.3, ease: 'easeInOut' }}
                className='bg-white p-2 rounded-lg shadow-lg/30 w-120 md:mt-5 mt-5 h-[calc(100vh)] overflow-y-scroll 
                scrollbar-hidden  border-b-4 border-yellow-700'
            >


                {/*Modal Header */}
                <div className="flex justify-between items-center mb-2 shadow-xl p-1">
                    <h2 className='text-[#1a1a1a] text-md font-bold'>Add Employee</h2>
                    <button onClick={handleClose} 
                    
                    className='rounded-xs text-[#be3e3f] hover:bg-[#be3e3f]/30 cursor-pointer
                        border-b border-[#be3e3f]'>
                        <IoCloseCircle size={25} />
                    </button>
                </div>

                {/*Modal Body*/}
                <form className='mt-3 space-y-6' onSubmit={onSubmitHandler}>
                   
                    <div className='flex items-center gap-4 mb-2 shadow-xl p-1'>
                        <label htmlFor='emp-img'>
                            <img className='bg-white w-15 cursor-pointer rounded-lg w-15 h-15 p-1 border border-[#0ea5e9] shadow-lg/30'
                                src={empImg ? URL.createObjectURL(empImg) : fileUpload}
                            />
                        </label>
                        <input 
                            id='emp-img'
                            className = 'text-xs'
                            type= 'file'
                            accept="image/*"
                            onChange={handleImageChange}

                        />
                        {/* onChange={(e) => setEmpImg(e.target.files[0])} type='file' id='emp-img' hidden /> */}
                        {/* <p className='text-xs font-semibold text-sky-600'>Upload image</p> */}
                    </div>

                    <div className='mt-2 flex items-center justify-between shadow-xl p-1'>
                        <label className='w-[25%] text-black text-xs font-medium'>Employee Name :</label>
                        <div className='flex w-[75%] items-center p-3 bg-white shadow-xl'>
                            <input
                                type='text'
                                name='empName'
                             
                                onChange ={(e)=> setEmpName(e.target.value)} 
                                value ={empName}

                                placeholder='Enter employee email'
                                className='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none text-sm font-normal text-sm font-semibold border-b-1 border-yellow-700'
                                required
                                autoComplete='none'
                            />
                        </div>
                    </div>


                    <div className='mt-2 flex items-center justify-between shadow-xl p-1'>
                        <label className='w-[25%] text-black text-xs font-medium'>Email : </label>
                        <div className='flex w-[75%] items-center p-3 bg-white shadow-xl'>
                            <input
                                type='email'
                                name='email'
                                
                                onChange ={(e)=> setEmail(e.target.value)} 
                                value ={email}

                                placeholder='Enter employee email'
                                className='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none text-sm font-normal text-sm font-semibold border-b-1 border-yellow-700'
                                required
                                autoComplete='none'
                            />
                        </div>
                    </div>

                    <div className='mt-2 flex items-center justify-between shadow-xl p-1'>
                        <label className='w-[25%] text-black text-xs font-medium'>Address : </label>
                        <div className='flex w-[75%] items-center py-3 px-4 bg-white shadow-xl'>
                            <input
                                type='text'
                                name='address'
                                
                                onChange ={(e)=> setAddress(e.target.value)} 
                                value ={address}

                                placeholder='Enter address of customer'
                                className='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none text-sm font-normal text-sm font-semibold border-b-1 border-yellow-700'
                                required
                                autoComplete='none'
                            />

                        </div>
                    </div>

                    <div className='flex items-center justify-between shadow-xl p-1'>
                        <label className='w-[25%] text-black block  text-xs font-medium'>Contact No : </label>
                        <div className='flex w-[75%] items-center p-3 bg-white shadow-xl'>
                            <input
                                type='text'
                                name='contactNo'
                                
                                onChange ={(e)=> setContactNo(e.target.value)} 
                                value ={contactNo}

                                placeholder='+971 999999999'
                                className='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none text-sm font-normal text-sm font-semibold border-b-1 border-yellow-700'
                                required
                                autoComplete='none'
                            />

                        </div>
                    </div>

                    <div className ='flex items-center justify-between shadow-xl p-1'>
                  
                        <div className='w-[50%] flex items-center rounded-lg p-3 bg-white shadow-xl'>
                            <select className='w-full bg-zinc-100 h-8 text-xs font-semibold'
                                onChange ={(e)=> setDepartment(e.target.value)} 
                                value ={department}
                                
                                name='department' 
                                required
                                >
                                <option className='text-black text-xs font-normal'>Select department ...</option>

                                {departList.map((depart, index) => (
                                    <option key={index} value={depart.departmentName} className='text-xs font-semibold'>
                                        {depart.departmentName}
                                    </option>
                                ))};
                            </select>
                        </div>
                    
                        <div className='w-[50%] flex items-center rounded-lg p-3 bg-white shadow-xl'>
                            <select className='w-full bg-zinc-100 h-8 text-xs font-semibold' 
                                onChange ={(e)=> setEmpJob(e.target.value)} 
                                value ={empJob}
                                
                                name='empJob' 
                                required
                                >
                                <option className='text-black text-xs font-normal'>Select Job title ...</option>

                                {jobList.map((job, index) => (
                                    <option key={index} value={job.jobName} className='text-xs font-semibold'>
                                        {job.jobName}
                                    </option>

                                ))};
                            </select>
                        </div>
                    </div>

                    <div className='flex items-center justify-between shadow-xl p-1'>
                        <label className='w-[25%] text-black block  text-xs font-medium'>Job Number : </label>
                        <div className='flex w-[75%] items-center rounded-lg p-3 bg-white shadow-xl'>
                            <input
                                type='text'
                                name='jobNo'
                                onChange ={(e)=> setJobNo(e.target.value)} 
                                value ={jobNo}

                                placeholder='Enter job number of employee'
                                className='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none text-sm font-normal text-sm font-semibold border-b-1 border-yellow-700'
                                required
                                autoComplete='none'
                            />

                        </div>
                    </div>

                    <div className='flex items-center justify-between shadow-xl p-1'>
                        <label className='w-[50%] text-black block text-xs font-medium'>Employment history / date : </label>
                        <div className='w-[50%] flex items-center p-3 bg-white shadow-xl'>
                            <input
                                type='date'
                                name='jobDate'
                                onChange ={(e)=> setJobDate(e.target.value)} 
                                value ={jobDate}

                                className='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none text-sm font-normal text-sm font-semibold border-b-1 border-yellow-700'
                                required
                                autoComplete='none'
                            />

                        </div>
                    </div>


                    <button
                        type='submit'
                        className='p-2 rounded-lg mt-3 py-3 text-sm bg-[#0ea5e9] border-b-2 text-white font-semibold cursor-pointer'
                    >
                        Add Employee
                    </button>

                </form>

            </motion.div>
        </div>
    );
};



export default AddEmployee ;