import React, {useState, useEffect} from 'react'

import { motion } from 'framer-motion'
import { useMutation } from '@tanstack/react-query'
import { IoCloseCircle } from 'react-icons/io5';
import { enqueueSnackbar } from 'notistack';

import{ useSelector } from 'react-redux';
import { addVacation } from '../../https';

const VacationAnnualAdd = ({setIsRequirementModal}) => {
    const userData = useSelector((state) => state.user);

    const handleClose = () => {
        setIsRequirementModal(false)
        window.location.reload();
    };

    
    const empName = userData ? userData.name : "";
    const department = userData ? userData.department : "";
    const employeeNo = userData ? userData.employeeNo : "";
    const email = userData ? userData.email : "";
    const contactNo = userData? userData.phone : "";

    const jobTitle = userData? userData.userJob : "";
    const jobNo = userData? userData.jobNo : "";
    const jobDate = userData? userData.jobDate : "";

   

    
    // Helper function to format date as YYYY-MM-DD
    const formatDate = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const today = formatDate(new Date());
    
    const [formData, setFormData] = useState({
        vacationType: "annual leave", vacationStatus :"Pending", vacationReason: "",
        vacationStart: today,
        vacationEnd: today,
        daysCount: 1,

        empName: empName , contactNo: contactNo, email: email, jobTitle: jobTitle, jobNo, jobDate,
        department: department, employeeNo: employeeNo
    });

    // Calculate days difference whenever dates change
    useEffect(() => {
        const start = new Date(formData.vacationStart);
        const end = new Date(formData.vacationEnd);
        const timeDiff = end - start;
        const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end days

        setFormData(prev => ({
            ...prev,
            daysCount: daysDiff > 0 ? daysDiff : 1 // Ensure minimum 1 day
        }));
    }, [formData.vacationStart, formData.vacationEnd]);


    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData)

        vacationMutation.mutate(formData)
        // window.location.reload();
        // setIsRequirementModal(false);
    };
    const vacationMutation = useMutation({
        mutationFn: (reqData) => addVacation(reqData),
        onSuccess: (res) => {

            const { data } = res;
            //console.log(data)
            enqueueSnackbar(data.message, { variant: "success" });
        },

        onError: (error) => {
            const { response } = error;
            enqueueSnackbar(response.data.message, { variant: "error" });

            console.log(error);
        },
    });


    return(
        <div className='fixed inset-0 bg-opacity-50 flex items-center justify-center shadow-lg/10 z-50' style={{ backgroundColor: 'rgba(20, 10, 10, 0.4)' }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ durayion: 0.3, ease: 'easeInOut' }}
                className='bg-white p-6 rounded-lg shadow-lg/30 w-120 md:mt-5 mt-5 border-b-4 border-yellow-700
                h-[calc(100vh-2rem)] overflow-y-scroll scrollbar-hidden
                '
            >


                {/*Modal Header */}
                <div className="flex justify-between items-center mb-4 shadow-xl p-2">
                    <h2 className='text-amber-900 text-sm font-semibold'>Annual leave requirement</h2>
                    <button onClick={handleClose} className='rounded-lg border-b border-yellow-700 text-yellow-700 cursor-pointer'>
                        <IoCloseCircle size={25} />
                    </button>
                </div>

                {/*Modal Body*/}
                <form className='mt-3 space-y-6' onSubmit={handleSubmit}>
                  
                    <div className='mt-2 flex items-center justify-between shadow-xl p-3'>
                        <label className='w-[20%] text-black text-xs font-medium'>Leave reason :</label>
              
                            <div className='flex w-[80%] items-center text-xs py-3 px-4 bg-white shadow-xl'>
                                <input
                                    type='text'
                                    name='vacationReason'
                                    value={formData.vacationReason}
                                    onChange={handleInputChange}

                                    placeholder='Enter reason of leave'
                                    className='bg-transparent text-[#1a1a1a] focus:outline-none border-b border-yellow-700 w-full'
                                    required
                                    autoComplete='none'
                                />
                            </div>
                    </div>
                    <div className='mt-2 flex items-center text-xs justify-between shadow-xl p-3'>
                        <label className='w-[20%] text-black text-xs font-medium'>Leave from :</label>

                        <div className='flex w-[80%] items-center  py-3 px-4 bg-white shadow-xl'>
                            <input
                                type='date'
                                name='vacationStart'
                                value={formData.vacationStart}
                                onChange={handleInputChange}
                                min={today}
                                className='bg-transparent text-[#1a1a1a] focus:outline-none border-b border-yellow-700 w-full'
                                required
                            />

                        </div>
                    </div>

                    <div className='mt-2 flex text-xs items-center justify-between shadow-xl p-3'>
                        <label className='w-[20%] text-black text-xs font-medium'>Leave To :</label>

                        <div className='flex w-[80%] items-center  py-3 px-4 bg-white shadow-xl'>
                            <input
                                type='date'
                                name='vacationEnd'
                                value={formData.vacationEnd}
                                onChange={handleInputChange}
                                min={formData.vacationStart}
                                className='bg-transparent text-[#1a1a1a] focus:outline-none border-b border-yellow-700 w-full'
                                required
                            />

                        </div>
                    </div>

                    <div className='mt-2 flex items-center justify-between shadow-xl p-3'>
                        <label className='w-[20%] text-black text-xs font-medium'>Total Days:</label>
                        <div className='flex w-[80%] items-center py-3 px-4 bg-white shadow-xl'>
                            <input
                                type='text'
                                value={formData.daysCount}
                                readOnly
                                className='bg-transparent text-[#1a1a1a] w-full'
                            />
                        </div>
                    </div>

                    <button
                        type='submit '
                        className='rounded-lg px-5  py-3 text-sm font-semibold bg-yellow-700 border-b-2 border-yellow-700 text-white cursor-pointer  '
                    >
                        Send request
                    </button>

                </form>
            </motion.div>
        </div>

    );
};


export default VacationAnnualAdd ;