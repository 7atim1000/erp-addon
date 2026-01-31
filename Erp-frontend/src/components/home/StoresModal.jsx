import React from 'react'
import { useNavigate } from 'react-router-dom'

import { MdOutlineClose } from "react-icons/md";
import { RiProductHuntLine } from "react-icons/ri";
import { FaBuildingCircleCheck } from "react-icons/fa6";
import { GrVirtualMachine } from "react-icons/gr";
import { MdOutlineInventory } from "react-icons/md";    
import { TbArrowsExchange2 } from "react-icons/tb";
import { TbArrowsExchange } from "react-icons/tb";

import { motion } from 'framer-motion'

const StoresModal = ({setIsStoresModal}) => {
    const navigate = useNavigate();

    const handleClose = () => {
       setIsStoresModal(false)
    };



    return (
        <div className='fixed inset-0 bg-opacity-50 flex items-center justify-center shadow-lg z-50' style={{ backgroundColor: 'rgba(20, 10, 10, 0.4)' }} >

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ durayion: 0.3, ease: 'easeInOut' }}

                className='bg-white p-3 rounded-lg shadow-lg/30 w-100 h-50%  md:mt-0 mt-0 h-[calc(100vh-5rem)]'
            >

                <div className='flex justify-between items-center shadow-xl p-5'>
                    <h2 className='text-black text-sm font-semibold'>Stores</h2>
                    <button onClick={handleClose} className='inline text-[#1a1a1a] cursor-pointer hover:text-[#be3e3f]'>
                        <MdOutlineClose size={25} />
                    </button>
                </div>

            
                <div className='flex flex-col gap-7 justify-between items-center px-2 mt-2'>

                    <div className='flex justify-between items-center w-full p-3 shadow-xl border-b-3 border-[#e3d1b9]'>
                        <div className='flex justify-between items-center '>
                            <button onClick={() => navigate('/stores')} className='w-35 h-15 shadow-lg/30 bg-white rounded-lg  px-2 py-3 text-sm text-black font-semibold cursor-pointer'>
                                Stores <FaBuildingCircleCheck size={25} className='inline text-[#0ea5e9]' />
                            </button>
                        </div>
                        <div className='flex justify-between items-center'>
                            <button onClick={() => navigate('/storescategories')} className='w-35 h-15 shadow-lg/30 bg-white rounded-lg  px-2 py-3 text-sm text-black font-semibold cursor-pointer'>
                                Categories <GrVirtualMachine size={25} className='inline text-[#0ea5e9]' />
                            </button>
                        </div>

                    </div>
                

                    <div className='flex justify-between items-center w-full p-3 shadow-xl border-b-3 border-[#e3d1b9]'>
                        <div className='flex justify-between items-center'>
                            <button onClick={() => navigate('/storesunits')} className='w-35 h-15 shadow-lg/30 bg-white rounded-lg  px-2 py-3 text-sm text-black font-semibold cursor-pointer'>
                                Units <GrVirtualMachine size={25} className='inline text-[#0ea5e9]' />
                            </button>
                        </div>
                        <div className='flex justify-between items-center'>
                            <button onClick={() => navigate('/storesitems')} className='w-35 h-15 shadow-lg/30 bg-white rounded-lg  px-2 py-3 text-sm text-black font-semibold cursor-pointer'>
                                Products <RiProductHuntLine size={25} className='inline text-[#0ea5e9]' />
                            </button>
                        </div>

                    </div>
                  
                    <div className='flex justify-between items-center w-full p-3 shadow-xl border-b-3 border-[#e3d1b9]'>
                        <div className='flex justify-between items-center '>
                            <button onClick={() => navigate('/exchange')} className='w-35 h-15 shadow-lg/30 bg-white rounded-lg  px-2 py-3 text-sm text-black font-semibold cursor-pointer'>
                                Exchange <TbArrowsExchange size={25} className='inline text-[#0ea5e9]' />
                            </button>
                        </div>
                        <div className='flex justify-between items-center '>
                            <button onClick={() => navigate('/receipt')} className='w-35 h-15 shadow-lg/30 bg-white rounded-lg  px-2 py-3 text-sm text-black font-semibold cursor-pointer'>
                                Receipt <TbArrowsExchange2 size={25} className='inline text-[#0ea5e9]' />
                            </button>
                        </div>
                    </div>
                  


                    <div className='flex justify-between items-center '>
                        <button onClick={() => navigate('/inventory')} className='w-35 h-15 shadow-lg/30 bg-white rounded-lg  px-2 py-3 text-sm text-black font-semibold cursor-pointer'>
                            Inventory <MdOutlineInventory size={25} className='inline text-[#0ea5e9]' />
                        </button>
                    </div>







                </div>

            </motion.div>

        </div>
    );
};


export default StoresModal ;