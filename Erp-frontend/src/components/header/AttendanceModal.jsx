import React , { useState, useEffect } from 'react' ;
import { useSelector } from 'react-redux';
import { addAttendance } from '../../https';

import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import { IoCloseCircle } from 'react-icons/io5';
import { useMutation } from '@tanstack/react-query'



const AttendanceModal = ({setIsAttendanceModal}) => {

    const userData = useSelector(state => state.user);
    
    const handleClose = () => {
        setIsAttendanceModal(false);
    };

    function getCurrentTime() {
        const now = new Date();

        let hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();

        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // 0 should be 12

        const strTime = `${hours.toString().padStart(2, '0')}:` +
            `${minutes.toString().padStart(2, '0')}:` +
            `${seconds.toString().padStart(2, '0')} ${ampm}`;
        return strTime;
    }

function getAttendanceType(timeStr) {
    // Parse time to minutes POUSE NOT USING NOW
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (modifier === 'PM' && hours !== 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
    const totalMinutes = hours * 60 + minutes;


    // 08:00 AM = 480, 01:00 PM = 780
    if (totalMinutes >= 480 && totalMinutes <= 780) {
        return "Attendance";
    } else {
        return "Departure";
    }
}

    const attendanceTime = getCurrentTime();    

    const [formData, setFormData] = useState({
        department: "", empName: "",  jobTitle: "" ,
        attendanceTime :attendanceTime, employeeNo :"",
        empSalary: "",
        
        //attendacneType : getAttendanceType(attendanceTime),
 
        date: new Date().toISOString().slice(0, 10)
    });


    useEffect(() => {
        if (userData) {

            setFormData((prev) => ({
                ...prev,
                
                empName: userData.name || "",
                employeeNo: userData.employeeNo || "",
                department: userData.department || "",
                jobTitle: userData.userJob || "",
                empSalary: userData.userSalary ,

                //attendanceType: getAttendanceType(prev.attendanceTime)
            }));
        }

    }, [formData.attendanceTime]);

    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    
    const [buttonType, setButtonType] = useState(""); 

    const handleSubmitAttendace = (e) => {

        // Set attendanceType before submit
        const submitData = {
            ...formData,
            attendanceType: buttonType
        };

        e.preventDefault();
        //console.log(submitData)

        attendacneMutation.mutate(submitData);

    };


    const attendacneMutation = useMutation({
        mutationFn: (reqData) => addAttendance(reqData),

        onSuccess: (resData) => {
            const { data } = resData.data;
            console.log(data);

            toast.success('Attendance Sucessfully .');
            

            setTimeout(() => {
          
            }, 1500)



        },

        onError: (error) => {
            console.log(error);
        }
    });




    return (
       
       <div className='fixed inset-0 bg-opacity-50 flex items-center justify-center shadow-lg/10 z-50' style={{ backgroundColor: 'rgba(20, 10, 10, 0.4)' }} >
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ durayion: 0.3, ease: 'easeInOut' }}
                className='bg-white  p-6 rounded-lg shadow-lg/30 w-120 md:mt-5 mt-5 h-[calc(100vh-5rem)]'
            >


                {/*Modal Header */}
                <div className="flex justify-between items-center mb-4">
                    <div className='flex flex-col gap-2'>
                        <h2 className='text-sky-600 text-md font-semibold'>Attendance</h2>
                        <p className='text-md text-green-600 font-medium'> <span className='text-black font-normal text-sm'>
                            attendance for employee : </span> {userData.name}</p>
                        <p className='text-md text-sky-600 font-medium'> <span className='text-black font-normal text-sm'>
                            Today : </span> {new Date().toISOString().slice(0, 10)}</p>

                    </div>
                    <button onClick={handleClose} className='rounded-full text-yellow-700 hover:text-orange-600 cursor-pointer'>
                        <IoCloseCircle size={25} />
                    </button>
                </div>

                {/*Modal Body  onSubmit={handlePlaceOrder}*/}
                <form onSubmit ={handleSubmitAttendace} className='mt-5 space-y-6' >


                    <div className='flex items-center gap-3 px-0 '>
                        {/*bg-[#F6B100] */}
                        <button className='w-full bg-green-600 text-white px-4 py-4 rounded-lg text-[#1a1a1a] cursor-pointer font-semibold text-sm font-medium shadow-lg/30'
                            type='submit'
                            onClick={() => setButtonType("Attendance")}
                        >Attendance</button>
                    </div>

                    <div>
                        <label className='text-sky-600 block mb-2 mt-3 text-sm font-normal'>Current time :</label>
                        <div className='flex items-center rounded-lg p-2 px-4 bg-white shadow-lg/30 '>
                            <input
                                
                                type='text'
                                name='attendanceTime'
                                value={formData.attendanceTime}

                                onChange={handleInputChange}

                                placeholder='Enter the incentives'
                                className='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none text-7xl font-normal'
                                required
                                autoComplete='none'
                            />
                        </div>
                    </div>

                    
                    <div className ='hidden'>
                        <label className='text-black block mb-2 mt-3 text-xs font-medium'>Today : </label>
                        <div className='flex items-center rounded-lg p-2 px-4 bg-white shadow-lg/30'>
                            <input
                                type='date'
                                name='date'
                                value={formData.date}
                                onChange={handleInputChange}

                                className='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none text-sm font-normal text-sm font-semibold'
                                required
                                autoComplete='none'
                            />

                        </div>
                    </div>

                          
                                    
                    
                    {/* <div>
                        <label className='text-black block mb-2 mt-3 text-xs font-medium'>attendacneType : </label>
                        <div className='flex items-center rounded-lg p-2 px-4 bg-white shadow-lg/30'>
                            <input
                                type='text'
                                name='attendacneType'
                                value={formData.attendanceType}
                                onChange={handleInputChange}

                                className='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none text-sm font-normal text-sm font-semibold'
                                required
                                autoComplete='none'
                            />

                        </div>
                    </div> */}


                    <div className='flex items-center gap-3 px-0'>
                        {/*bg-[#F6B100] */}
                        <button className='w-full mt-8 bg-orange-600 text-white px-4 py-4 rounded-lg text-[#1a1a1a] cursor-pointer font-semibold text-sm font-medium shadow-lg/30'
                            type='submit'
                            onClick={() => setButtonType("Departure")}
                        >Departure</button>
                    </div>


                </form>
            </motion.div>
        </div>

    );
};



export default AttendanceModal ;