import React , {useState, useEffect} from 'react'
import { motion } from 'framer-motion'
import { api } from '../../https';
import { toast } from 'react-toastify'
import { IoCloseCircle } from 'react-icons/io5';

const EmployeeEditModal = ({ employee, setIsEditEmployeeModal, fetchEmployees }) => {
  
    const [newImage, setNewImage] = useState(null);

    const [employeeNo, setEmployeeNo] = useState(employee.employeeNo);
    const [empName, setEmpName] = useState(employee.empName);
    const [contactNo, setContactNo] = useState(employee.contactNo);
    const [address, setAddress] = useState(employee.address);
    const [email, setEmail] = useState(employee.email);
    const [jobNo, setJobNo] = useState(employee.jobNo);
    
    const [department, setDepartment] = useState(employee.department);
    const [empJob, setEmpJob] = useState(employee.empJob);
    const [departments, setDepartments] = useState([]);
    const [empJobs, setEmpJobs] = useState([]);

    const [jobDate, setJobDate] = useState(employee.jobDate);


    const handleClose = () => {
        setIsEditEmployeeModal(false)
    };

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        try {
            const formData = new FormData();

            if (newImage) {
                formData.append('image', newImage);
            }
        
            formData.append('empName', empName);
            formData.append('contactNo', contactNo);
            formData.append('address', address);
            formData.append('email', email);
            formData.append('jobNo', jobNo);
            formData.append('jobDate', jobDate);

            formData.append('department', department);
            formData.append('empJob', empJob);
          

            const { data } = await api.put(`/api/employee/update/${employee._id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            if (data.success) {
                toast.success(data.message);
                fetchEmployees();
                handleClose();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    // Fetch categories and units
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch categories
                const departmentsResponse = await api.get('/api/department/');
                if (departmentsResponse.data.success) {
                    setDepartments(departmentsResponse.data.departments);
                }

                // Fetch units
                const jobsResponse = await api.get('/api/job/');
                if (jobsResponse.data.success) {
                    setEmpJobs(jobsResponse.data.jobs);
                }
            } catch (error) {
                toast.error(error.message);
            }
        };

        fetchData();
    }, []);


    return(

        <div className='fixed inset-0 bg-opacity-50 flex items-center justify-center shadow-lg/10 z-50'
            style={{ backgroundColor: 'rgba(6, 76, 133, 0.4)' }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className='bg-white p-2 rounded-lg shadow-lg/30 w-120 md:mt-5 mt-5 h-[calc(100vh)] overflow-y-scroll 
                scrollbar-hidden  border-b-4 border-yellow-700'
            >
                {/* Modal Header */}
                <div className="flex justify-between items-center mb-2 shadow-xl p-1">
                    <h2 className='text-[#1a1a1a] text-md font-bold'>Add Employee</h2>
                    <button onClick={handleClose}

                        className='rounded-xs text-[#be3e3f] hover:bg-[#be3e3f]/30 cursor-pointer
                                        border-b border-[#be3e3f]'>
                        <IoCloseCircle size={25} />
                    </button>
                </div>

                {/* Modal Body */}
                <form className='mt-3 space-y-6' onSubmit={onSubmitHandler}>
                    {/* Image Upload */}
                    <div className='flex items-center gap-4 mb-2'>
                        <label htmlFor='edit-employee-img'>
                            <img
                                className='w-16 h-16 cursor-pointer rounded-lg p-1 border border-sky-500 shadow-lg/30 object-cover'
                                src={newImage ? URL.createObjectURL(newImage) : employee.image}
                                alt="Employee"
                            />
                        </label>
                        <input
                            onChange={(e) => setNewImage(e.target.files[0])}
                            type='file'
                            id='edit-employee-img'
                            hidden
                        />
                        <p className='text-xs font-semibold text-green-600'>Change image</p>
                    </div>

                    {/* department Dropdown */}
                    <div className='mt-2 flex items-center justify-between shadow-xl p-3'>
                        <label className='w-[25%] text-[#1a1a1a] block  text-xs font-medium'>Department:</label>
                        <div className='flex w-[75%] items-center  p-3 bg-white shadow-xl'>
                            <select
                                className='w-full bg-white text-[#1a1a1a] h-7 rounded-sm'
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                                required
                            >
                                {departments.map((depart) => (
                                    <option key={depart._id} value={depart.departmentName}>
                                        {depart.departmentName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className='flex items-center justify-between shadow-xl'>
                        <label className='w-[25%] text-[#1a1a1a] block px-2 text-xs font-medium'>Job Title:</label>
                        <div className='flex w-[75%] items-center rounded-lg p-3 bg-white shadow-xl'>
                            <select
                                className='w-full bg-white text-[#1a1a1a] h-7 rounded-sm bg-[#f5f5f5]'
                                value={empJob}
                                onChange={(e) => setEmpJob(e.target.value)}
                                required
                            >
                                {empJobs.map((job) => (
                                    <option key={job._id} value={job.jobName}>
                                        {job.jobName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Service Name */}
                

                    <div className ='flex items-center justify-between shadow-xl'>
                        <label className='w-[25%] text-[#1a1a1a] block  text-xs px-2 font-medium'>Employee Name:</label>
                        <div className='flex w-[75%] items-center rounded-lg p-3 bg-white shadow-xl'>
                            <input
                                type='text'
                                value={empName}
                                onChange={(e) => setEmpName(e.target.value)}
                                className='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none font-semibold text-sm border-b border-yellow-700'
                                required
                            />
                        </div>
                    </div>

                    
                    <div className ='flex items-center justify-between shadow-xl'>
                        <label className='w-[25%] text-[#1a1a1a] block  text-xs px-2 font-medium'>Email:</label>
                        <div className='flex w-[75%] items-center rounded-lg p-3 bg-white shadow-xl'>
                            <input
                                type='text'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none font-semibold text-sm border-b border-yellow-700'
                                required
                            />
                        </div>
                    </div>

                   
                    <div className= 'flex items-center justify-between shadow-xl'>
                        <label className= 'w-[25%] text-[#1a1a1a] block text-xs px-2 font-medium'>Contact No:</label>
                        <div className= 'flex w-[75%] items-center rounded-lg p-3 bg-white shadow-xl'>
                            <input
                                type= 'text'
                                value= {contactNo}
                                onChange= {(e) => setContactNo(e.target.value)}
                                className= 'bg-transparent flex-1 text-[#1a1a1a] focus:outline-none font-semibold text-sm border-b border-yellow-700'
                                required
                            />
                        </div>
                    </div>

                    <div className='flex items-center justify-between shadow-xl '>
                        <label className='w-[25%] text-[#1a1a1a] block  text-xs px-2 font-medium'>Address:</label>
                        <div className ='flex w-[75%] items-center rounded-lg p-3 bg-white shadow-xl'>
                            <input
                                type= 'text'
                                value= {address}
                                onChange= {(e) => setAddress(e.target.value)}
                                className= 'bg-transparent flex-1 text-[#1a1a1a] focus:outline-none font-semibold text-sm border-b border-yellow-700'
                                required
                            />
                        </div>
                    </div>

                    <div className='flex items-center justify-between shadow-xl '>
                        <label className='w-[25%] text-[#1a1a1a] block px-2 text-xs font-medium'>Job Number:</label>
                        <div className='flex w-[75%] items-center rounded-lg p-3  bg-white shadow-xl'>
                            <input
                                type='text'
                                value= {jobNo}
                                onChange= {(e) => setJobNo(e.target.value)} 
                                className='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none font-semibold text-sm border-b border-yellow-700'
                                required
                            />
                        </div>
                    </div>

                    <div className='hidden flex items-center justify-between shadow-xl '>
                        <label className='w-[25%] text-[#1a1a1a] block px-2 text-xs font-medium'>History date:</label>
                        <div className='flex w-[75%] items-center rounded-lg p-3 bg-white shadow-xl'>
                            <input
                                type='text'
                                value={jobDate}
                                onChange={(e) => setJobDate(e.target.value)}
                                className='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none font-semibold text-sm border-b border-yellow-700'
                                required
                                
                            />
                        </div>
                    </div>


                 

                   <button
                        type='submit'
                        className='p-2 rounded-lg mt-3 py-3 text-sm bg-[#0ea5e9] border-b-2 text-white font-semibold cursor-pointer'
                    >
                        Update Employee
                    </button>
                </form>
            </motion.div>
        </div>
    );
};


export default EmployeeEditModal