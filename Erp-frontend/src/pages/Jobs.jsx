import React, { useState } from 'react'
import BackButton from '../components/shared/BackButton';
import { MdDelete, MdOutlineAddToDrive } from "react-icons/md";
import { FiEdit3 } from "react-icons/fi";


import { api, getJobs } from '../https/'
import { toast } from 'react-toastify'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getBgColor } from '../utils';

import BottomNav from '../components/shared/BottomNav';
import AddJob from '../components/hr/AddJob';


const Jobs = () => {
    const Button = [
        { label: 'Add Job Title', icon: <MdOutlineAddToDrive className='text-yellow-700' size={20} />, action: 'job' }
    ];

    const [isJobAddModal, setIsJobAddModal] = useState(false);
    const handleJobModal = (action) => {
        if (action === 'job') setIsJobAddModal(true)
    }


    // Fetch Jobs

    const { data: responseData, IsError } = useQuery({
        queryKey: ['jobs'],
        queryFn: async () => {
            return await getJobs();
        },

        placeholderData: keepPreviousData,
    });


    if (IsError) {
        enqueueSnackbar('Something went wrong!', { variant: 'error' });
    }

    console.log(responseData);


    // remove Job
   
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);

    const removeJob = async (id) => {

        try {

            const response = await api.post('/api/job/remove', { id },)

            if (response.data.success) {

                //Update the LIST after Remove
                //toast.success(response.data.message)
                // return await getStores();

                window.location.reload();

            } else {
                toast.error(response.data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    };

    

    return (
      <section className ='h-[calc(100vh)] overflow-y-scroll scrollbar-hidden'>
            
            <div className='flex items-center justify-between px-8 py-2 shadow-xl mb-2'>
                <div className='flex items-center gap-2'>
                    <BackButton />
                    <h1 className='text-md font-semibold text-[#1a1a1a]'>Job Titles Management</h1>
                </div>

                <div className='flex gap-2 items-center justify-around gap-3 hover:bg-yellow-700 shadow-lg/30 bg-white'>
                    {Button.map(({ label, icon, action }) => {
                        return (
                            <button
                                onClick={() => handleJobModal(action)}
                                className='bg-white px-4 py-2 text-[#1a1a1a] cursor-pointer
                                    font-semibold text-xs flex items-center gap-2 rounded-full'>
                                {label} {icon}
                            </button>
                        )
                    })}
                </div>

            {isJobAddModal && <AddJob setIsJobAddModal={setIsJobAddModal} />} 

            </div>



            <div className='grid grid-cols-5 gap-4 px-10 py-4 mt-0 w-[100%] bg-white'>

                {responseData?.data.data.length === 0
                    ? (<p className='w-full text-sm text-[#be3e3f] flex justify-center'>Your job titles menu is empty . Start adding new one !</p>)

                    : responseData?.data.data.map(job => (

                        <div key={job.jobName} className='flex items-center justify-between bg-[#f5f5f5] px-3 rounded-xs h-[70px] cursor-pointer
                            shadow-lg/10 bg-[#F1E8D9]'
                            // style={{ backgroundColor: getBgColor() }}
                        >

                            <div className='flex justify-between w-full shadow-lg/30'>
                                <div className='items-start px-3'>
                                    <h1 className='text-xs font-semibold text-[#1a1a1a]'>{job.jobName}</h1>
                                </div>
                                <div className='items-end flex gap-1 px-3'>
                                    <FiEdit3 
                                    className='w-6 h-6 text-[#0ea5e9] rounded-full hover:bg-[#0ea5e9]/30' />
                                    <MdDelete 
                                        onClick={() => { setSelectedJob(job); setDeleteModalOpen(true); }}
                                        className ='w-6 h-6 text-[#be3e3f] rounded-full hover:bg-[#be3e3f]/30' />
                                </div>

                            </div>
                        </div>

                    ))}


            </div>

            <BottomNav />
            
            <ConfirmModal
                open= {deleteModalOpen}
                JobName= {selectedJob?.jobName}
                onClose= {() => setDeleteModalOpen(false)}
                onConfirm= {() => {
                    removeJob(selectedJob._id);
                    setDeleteModalOpen(false);
                }}
            />

      </section>
    );
};



const ConfirmModal = ({ open, onClose, onConfirm, JobName }) => {
    if (!open) return null;
    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{ backgroundColor: 'rgba(102, 3, 3, 0.4)' }}  //rgba(0,0,0,0.4)
        >

            <div className="bg-white rounded-lg p-6 shadow-lg min-w-[300px]">
                {/* <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2> */}
                <p className="mb-6">Are you sure you want to remove <span className="font-semibold text-[#be3e3f]">{JobName}</span>?</p>
                <div className="flex justify-end gap-3">
                    <button
                        className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 cursor-pointer"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 cursor-pointer"
                        onClick={onConfirm}
                    >
                        Delete
                    </button>
                </div>
            </div>

        </div>
    );
};


export default Jobs