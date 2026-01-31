import React from 'react'
import { useNavigate } from 'react-router-dom'

import { MdOutlineClose } from "react-icons/md";
import { FaUsersCog } from "react-icons/fa";
import { FaMoneyCheckDollar } from "react-icons/fa6";
import { IoTimeSharp } from "react-icons/io5";
import { MdAirlines } from "react-icons/md";
import { AiOutlinePartition } from "react-icons/ai";
import { VscTasklist } from "react-icons/vsc";
import { FaPlaneDeparture } from "react-icons/fa6";
import { GiAirplaneDeparture } from "react-icons/gi";


import { motion } from 'framer-motion'

const HrModal = ({setIsHrModal}) => {

    const navigate = useNavigate();

    const handleClose = () => {
       setIsHrModal(false)
    };

    return (
        
        <div className='fixed inset-0 bg-opacity-50 flex items-center justify-center shadow-lg z-50' style={{ backgroundColor: 'rgba(20, 10, 10, 0.4)' }} >
           
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ durayion: 0.3, ease: 'easeInOut' }}

                className='bg-white p-3 rounded-lg shadow-lg/30 w-100 h-50% md:mt-0 mt-0 h-[calc(100vh-5rem)]'
            >

                <div className='flex justify-between items-center shadow-xl p-5'>
                    <h2 className='text-black text-sm font-semibold'>HR</h2>
                    <button onClick={handleClose} className='inline text-[#1a1a1a] cursor-pointer hover:text-[#be3e3f]'>
                        <MdOutlineClose size={25} />
                    </button>
                </div>


                <div className='flex flex-col gap-7 justify-between items-center px-8 mt-2'>


                    <div className='flex justify-between items-center w-full p-3 shadow-xl border-b-3 border-[#e3d1b9]'>
                        <div className='flex justify-between items-center  '>
                            <button onClick={() => navigate('/attendance')} className='w-35 h-15 shadow-lg/30 bg-white rounded-lg  px-2 py-3 text-sm text-black font-semibold cursor-pointer'>
                                Attendance  <IoTimeSharp size={25} className='inline text-[#0ea5e9]' />
                            </button>
                        </div>
                        <div className='flex justify-between items-center  '>
                            <button onClick={() => navigate('/departments')} className='w-35 h-15 shadow-lg/30 bg-white rounded-lg  px-2 py-3 text-sm text-black font-semibold cursor-pointer'>
                                Departments  <AiOutlinePartition size={25} className='inline text-[#0ea5e9]' />
                            </button>
                        </div>

                    </div>
                
                    
                    <div className='flex justify-between items-center w-full p-3 shadow-xl border-b-3 border-[#e3d1b9]'>
                        <div className='flex justify-between items-center '>
                            <button onClick={() => navigate('/jobs')} className='w-35 h-15 shadow-lg/30 bg-white rounded-lg  px-2 py-3 text-sm text-black font-semibold cursor-pointer'>
                                Job Titles  <VscTasklist size={25} className='inline text-[#0ea5e9]' />
                            </button>
                        </div>
                        <div className='flex justify-between items-center '>
                            <button onClick={() => navigate('/employees')} className='w-35 h-15 shadow-lg/30 bg-white rounded-lg  px-2 py-3 text-sm text-black font-semibold cursor-pointer'>
                                Employees  <FaUsersCog size={25} className='inline text-[#0ea5e9]' />
                            </button>
                        </div>

                    </div>
                    
                  
                  
                   
                    <div className='flex justify-between items-center w-full p-3 shadow-xl border-b-3 border-[#e3d1b9]'>
                        <div className='flex justify-between items-center'>
                            <button onClick={() => navigate('/salaries')} className='w-35 h-15 shadow-lg/30 bg-white rounded-lg  px-2 py-3 text-sm text-black font-semibold cursor-pointer'>
                                Salaries <FaMoneyCheckDollar size={25} className='inline text-[#0ea5e9]' />
                            </button>
                        </div>
                        <div className='flex justify-between items-center '>
                            <button onClick={() => navigate('/vacations')} className='w-35 h-15 shadow-lg/30 bg-white rounded-lg  px-2 py-3 text-sm text-black font-semibold cursor-pointer'>
                                Vacations <FaPlaneDeparture size={25} className='inline text-[#0ea5e9]' />
                            </button>
                        </div>
                    </div>

                </div>

            </motion.div>

        </div>

    );



};



export default HrModal ;