import React ,{useState} from 'react'

import BackButton from '../components/shared/BackButton';
import { MdDelete, MdOutlineAddToDrive } from "react-icons/md";
import { FiEdit3 } from "react-icons/fi";

import { toast } from 'react-toastify'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getBgColor } from '../utils';

import BottomNav from '../components/shared/BottomNav';

import { api, getDepartments, getStoresUnits } from '../https';
import StoresUnitAdd from '../components/storesUnits/StoresUnitAdd';

const StoresUnits = () => {
    const Button = [
        { label: 'Add Unit', icon: <MdOutlineAddToDrive className='text-yellow-700' size={20} />, action: 'unit' }
    ];

    const [isUnitModalAdd, setIsUnitModalAdd] = useState(false);

    const handleUnitModal = (action) => {
        if (action === 'unit') setIsUnitModalAdd(true)
    };

    
    // Fetch StoresUnits

    const { data: responseData, IsError } = useQuery({
        queryKey: ['units'],
        queryFn: async () => {
            return await getStoresUnits();
        },

        placeholderData: keepPreviousData,
    });


    if (IsError) {
        enqueueSnackbar('Something went wrong!', { variant: 'error' });
    }

    console.log(responseData);


    // remove unit
      
        const [deleteModalOpen, setDeleteModalOpen] = useState(false);
        const [selectedStoreUnit, setSelectedStoreUnit] = useState(null);
        
        const removeStoresUnit = async (id) => {
    
            try {
    
                const response = await api.post('/api/storesunits/remove', { id },)
    
                if (response.data.success) {
    
                    //Update the LIST after Remove
                    toast.success(response.data.message)
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
        <section className ='h-[calc(100vh-5rem)] overflow-y-scroll scrollbar-hidden'>
            
            <div className='flex items-center justify-between px-8 py-2 shadow-xl'>
                <div className='flex items-center'>
                    <BackButton />
                    <h1 className='text-md font-semibold text-[#1f1f1f]'>Units Management</h1>
                </div>

                <div className='flex gap-2 items-center justify-around gap-3 hover:bg-yellow-700 shadow-lg/30 bg-white'>
                    {Button.map(({ label, icon, action }) => {
                        return (
                            <button
                                onClick={() => handleUnitModal(action)}
                                className='bg-white px-4 py-2 text-[#1a1a1a] cursor-pointer
                                    font-semibold text-xs flex items-center gap-2 rounded-full'>
                                {label} {icon}
                            </button>
                        )
                    })}
                </div>

                {isUnitModalAdd && <StoresUnitAdd setIsUnitModalAdd= {setIsUnitModalAdd} />} 
            </div>



            <div className='grid grid-cols-5 gap-4 px-10 py-4 mt-0 w-[100%] rounded-lg'>

                {responseData?.data.data.length === 0
                    ? (<p className='w-full text-sm text-[#be3e3f] flex justify-center'>Your units menu is empty . Start adding new one !</p>)

                    : responseData?.data.data.map(unit => (

                        <div key={unit.uniName} className='flex items-center justify-between bg-[#f5f5f5] px-3 rounded-xs h-[50px] cursor-pointer
                            shadow-lg/30 hover:bg-[#F1E8D9]'
                            // style={{ backgroundColor: getBgColor() }}
                        >

                            <div className='flex justify-between w-full'>
                                <div className='items-start'>
                                    <h1 className='text-xs font-semibold text-[#1a1a1a]'>{unit.storeunitName}</h1>
                                </div>
                                <div className='items-end flex gap-1 px-3'>
                                    <FiEdit3 size={20} className='w-5 h-5 text-sky-500 rounded-full shadow-lg/30' />
                                    <MdDelete 
                                            onClick={() => { setSelectedStoreUnit(unit); setDeleteModalOpen(true); }}
                                        size={20} 
                                        className='w-5 h-5 text-[#be3e3f] rounded-full shadow-lg/30' />
                                </div>

                            </div>
                        </div>

                    ))}


            </div>

            <BottomNav />

            <ConfirmModal
                open= {deleteModalOpen}
                storeUnitName={selectedStoreUnit?.storeunitName}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={() => {
                    removeStoresUnit(selectedStoreUnit._id);
                    setDeleteModalOpen(false);
                }}
            />

        </section>
    );
};



const ConfirmModal = ({ open, onClose, onConfirm, storeUnitName }) => {
    if (!open) return null;
    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{ backgroundColor: 'rgba(102, 3, 3, 0.4)' }}  //rgba(0,0,0,0.4)
        >

            <div className="bg-white rounded-lg p-6 shadow-lg min-w-[300px]">
                {/* <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2> */}
                <p className="mb-6">Are you sure you want to remove <span className="font-semibold text-[#be3e3f]">{storeUnitName}</span>?</p>
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


export default StoresUnits ;