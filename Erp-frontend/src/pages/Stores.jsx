import React, { useState } from 'react'

import BackButton from '../components/shared/BackButton';
import { MdDeleteForever, MdOutlineAddToDrive } from "react-icons/md";
import { FiEdit3 } from "react-icons/fi";

import { toast } from 'react-toastify'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getBgColor } from '../utils';

import BottomNav from '../components/shared/BottomNav';

import { api, getStores } from '../https';
import AddStoreModal from '../components/stores/AddStoreModal';



const Stores = () => {
    const Button = [
        { label: 'Add Store', icon: <MdOutlineAddToDrive className='text-yellow-700' size={20} />, action: 'store' }
    ];

    const [isAddStoreModal, setIsAddStoreModal] = useState(false);

    const handleAddStoreModal = (action) => {
        if (action === 'store') setIsAddStoreModal(true)
    }
    

    // Fetch Products

    const { data: responseData, IsError } = useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            return await getStores();
        },

        placeholderData: keepPreviousData,
    });


    if (IsError) {
        enqueueSnackbar('Something went wrong!', { variant: 'error' });
    }

    console.log(responseData);


    // remove Stores
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedStore, setSelectedStore] = useState(null);
    
    const removeStore = async (id) => {

        try {

            const response = await api.post('/api/stores/remove', { id },)

            if (response.data.success) {

                //Update the LIST after Remove
                toast.success(response.data.message)
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
        <section className='h-[calc(100vh-5rem)] overflow-y-scroll scrollbar-hidden '>

            <div className='flex items-center justify-between px-8 py-3 shadow-xl mb-2'>
                <div className='flex items-center'>
                    <BackButton />
                    <h1 className='text-md font-semibold text-[#1a1a1a]'>Stores Management</h1>
                </div>

                <div className='flex gap-2 items-center justify-around gap-3 hover:bg-yellow-700 shadow-lg/30 bg-white'>
                    {Button.map(({ label, icon, action }) => {
                        return (
                            <button
                                onClick={() => handleAddStoreModal(action)}
                                className='bg-white px-4 py-2 text-[#1a1a1a] cursor-pointer
                                    font-semibold text-xs flex items-center gap-2 rounded-full'>
                                {label} {icon}
                            </button>
                        )
                    })}
                </div>

                {isAddStoreModal && <AddStoreModal setIsAddStoreModal={setIsAddStoreModal} />}

            </div>



            <div className='grid grid-cols-5 gap-4 px-10 py-4 mt-0 w-[100%] rounded-lg'>

                {responseData?.data.data.length === 0
                    ? (<p className='w-full text-sm text-[#be3e3f] flex justify-center'>Your stores menu is empty . Start adding new one !</p>)

                    : responseData?.data.data.map(store => (

                        <div key={store.storeName} className='flex items-center justify-between bg-[#f5f5f5] px-3 rounded-xs h-[70px] cursor-pointer
                            shadow-lg/30 hover:bg-[#F1E8D9]'
                            //style={{ backgroundColor: getBgColor() }}
                        >

                            <div className='flex justify-between w-full'>
                                <div className='items-start'>
                                    <h1 className='text-xs font-semibold text-[#1a1a1a]'>{store.storeName}</h1>
                                </div>

                                <div className='items-start px-3'>
                                    <h1 className='text-xs font-semibold text-[#1a1a1a]'>{store.storeLocation}</h1>
                                </div>
                            </div>
                            
                           
                            <div className='flex items-end justify-end  gap-2 px-3'>
                                <div className='flex items-end justify-end'>
                                    <FiEdit3 size={20}
                                        className='flex items-end justify-end w-5 h-5 text-sky-500 rounded-full shadow-lg/30' />
                                </div>

                                <div className='flex items-end justify-end'>
                                    <MdDeleteForever
                                        // onClick={() => removeStore(store._id)}
                                        onClick={() => { setSelectedStore(store); setDeleteModalOpen(true); }}

                                        size={20}
                                        className='flex items-end justify-end w-5 h-5 text-[#be3e3f]  rounded-full shadow-lg/30'
                                    />
                                </div>
                            </div>

                            
                        </div>

                    ))}


            </div>

            <BottomNav />

            <ConfirmModal
                open={deleteModalOpen}
                storeName={selectedStore?.storeName}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={() => {
                    removeStore(selectedStore._id);
                    setDeleteModalOpen(false);
                }}
            />

        </section>
    );
};



const ConfirmModal = ({ open, onClose, onConfirm, storeName }) => {
    if (!open) return null;
    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{ backgroundColor: 'rgba(102, 3, 3, 0.4)' }}  //rgba(0,0,0,0.4)
        >

            <div className="bg-white rounded-lg p-6 shadow-lg min-w-[300px]">
                {/* <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2> */}
                <p className="mb-6">Are you sure you want to remove <span className="font-semibold text-[#be3e3f]">{storeName}</span>?</p>
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




export default Stores;