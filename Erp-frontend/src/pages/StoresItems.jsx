import React, { useState, useEffect } from 'react'
import { MdDeleteForever, MdOutlineAddToDrive } from "react-icons/md";
import { LiaEditSolid } from "react-icons/lia";

import { useDispatch } from 'react-redux'

import { toast } from 'react-toastify';

import BackButton from '../components/shared/BackButton';

import BottomNav from '../components/shared/BottomNav';

import { api } from '../https';
import StoresItemsAdd from '../components/storesItems/StoresItemsAdd';


const StoresItems = () => {

    const dispatch = useDispatch();

    const addBtn = [
        { label: 'Add Items', icon: <MdOutlineAddToDrive className='text-yellow-700' size={20} />, action:'storesitems' }
    ];
    
    const [isStoresItemsAddModal, setIsStoresItemsAddModal] = useState(false);

    const handleOpenModal = (action) => {
        if (action === 'storesitems') setIsStoresItemsAddModal(true);
    };

    // Fetch items
    const [items, setItems] = useState([]);
    
    const [isEditServiceModal, setIsEditServiceModal] = useState(false);
    const [currentService, setCurrentService] = useState(null);

    const fetchItems = async () => {
        try {
            const { data } = await api.post('/api/storesitems/fetch',

                {
                    sort: '-createdAt' // Add this parameter
                });

            if (data.success) {
                setItems(data.items);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    // remove stores items
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedStoreItem, setSelectedStoreItem] = useState(null);

    const removeStoresItems = async (id) => {

        try {

            const response = await api.post('/api/storesitems/remove', { id },)

            if (response.data.success) {

                //Update the LIST after Remove
                toast.success(response.data.message)
                return fetchItems();
                // window.location.reload();

            } else {
                toast.error(response.data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    };



    // for expiredate - today date expire date sooon
    const isExpiringSoon = (expireDate) => {
        if (!expireDate) return false;
        const diffInMs = new Date(expireDate) - new Date();
        return diffInMs <= (31 * 24 * 60 * 60 * 1000);
    };

    // For remaning account remainging days 
    const getExpirationStatus = (expireDate) => {
        if (!expireDate) return { text: '—', className: '' };

        const today = new Date();
        const expiryDate = new Date(expireDate);
        const diffInMs = expiryDate - today;
        const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24));

        let text = '';
        let className = '';

        if (diffInDays < 0) {
            text = `Expired ${Math.abs(diffInDays)} days ago`;
            className = 'text-[#be3e3f]'; // Red for expired
        } else if (diffInDays === 0) {
            text = 'Expires today';
            className = 'text-[#be3e3f]'; // Red for today
        } else if (diffInDays <= 10) {
            text = `Expires in ${diffInDays} days`;
            className = 'text-[#be3e3f]'; // Red for ≤10 days
        } else {
            text = `Expires in ${diffInDays} days`;
            className = ''; // Default (no special styling)
        }

        return { text, className };
    };


    return (
        <section className ='h-[calc(100vh-5rem)] overflow-y-scroll scrollbar-hidden'>
            <div className='flex items-center justify-between px-10 py-3 shadow-xl'>

                <div className='flex items-center gap-4'>
                    <BackButton />
                    <h1 className='text-[#1a1a1a] text-md font-bold tracking-wider'>Items Management</h1>
                </div>

                <div className='flex items-center justify-around gap-4'>

                    <div className='flex gap-2 items-center justify-around gap-3 hover:bg-yellow-700 shadow-lg/30 bg-white'>
                        {
                            addBtn.map(({ label, icon, action }) => {
                                return (
                                    <button onClick={() => handleOpenModal(action)}
                                        className='bg-white px-4 py-2 text-[#1a1a1a] cursor-pointer
                                    font-semibold text-xs flex items-center gap-2 rounded-full'>
                                        {label} {icon}
                                    </button>
                                )
                            })
                        }

                        {isStoresItemsAddModal && <StoresItemsAdd setIsStoresItemsAddModal= {setIsStoresItemsAddModal} />}

                    </div>

                </div>

            </div>


            {/** table  */}
            <div className='mt-5 bg-white py-1 px-10'>


                <div className='overflow-x-auto'>
                    <table className='text-left w-full'>
                        <thead className=''>
                            <tr className='bg-white border-b-2 border-yellow-700 text-[#1a1a1a] text-xs font-normal'>
                                <th className='p-1'>Store</th>
                                <th className='p-1'>Name</th>
                                <th className ='p-2'>Quantity</th>
                                <th className='p-2'>Receipt price</th>
                                <th className='p-2'>Exchange price</th>
                                <th className='p-2'>Expire date</th>
                                <th className='p-2'></th>
                            </tr>
                        </thead>

                      

                        <tbody>
                            {console.log('Items data:', items)} {/* Debugging line */}
                            {items.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className='ml-5 mt-5 text-xs font-semibold text-[#be3e3f] flex items-start justify-start'>
                                        Your items list is empty. Start adding products!
                                    </td>
                                </tr>
                            ) : (
                                items.map((item) => {
                                    console.log('Current item:', item); {/* Debug each item */ }
                                    return (
                                        // react-dom_client.js?v=5af7a862:5440 Uncaught Error: Objects are not valid as a React child (found: object with keys {_id, storeName}). If you meant to render a collection of children, use an array instead.
                                        // item.store issue have error
                                        <tr
                                            key={item._id} 
                                            className='border-b-3 border-[#f5f5f5] text-xs font-normal text-[#1a1a1a] 
                                            hover:bg-[#F1E8D9] cursor-pointer'
                                        >
                                            <td className='p-1' hidden>{item._id}</td>
                                            <td className='p-1  bg-[#F1E8D9]'>{item.store}</td>

                                            <td className='p-1'>
                                                {item.storeitemName}
                                                <span className='text-white'>--</span>
                                                <span className ='text-sky-600'>{item.storeCategory}</span>
                                            </td>

                                            <td className='p-1 text-md'>{item.quantity}</td>
                                            
                                             <td className='p-1'>
                                                <span className='text-sky-600'>{item.receiptPrice}</span>
                                                <span className=''> AED </span>
                                                <span className='text-white'>-</span>
                                                <span className='text-sky-600'> FOR </span>
                                                <span className='text-white'>-</span>
                                                <span className='text-[#1a1a1a]'> {item.unit}</span>
                                            </td>
                                            <td className='p-1'>
                                                <span className='text-sky-500'>{item.exchangePrice}</span>
                                                <span className=''> AED </span>
                                                <span className='text-white'>-</span>
                                                <span className='text-sky-600'> FOR </span>
                                                <span className='text-white'>-</span>
                                                <span className='text-[#1a1a1a]'> {item.unit}</span>
                                            </td>

                                            {/* You can modify the TD element to conditionally apply the red text color when the difference between the expiration date and today's date is 10 days or less. Here's how you can do it: */}

                                            {/* <td className={`p-1 font-semibold text-md ${item.expireDate &&
                                                    (new Date(item.expireDate) - new Date()) <= (10 * 24 * 60 * 60 * 1000)
                                                    ? 'text-[#be3e3f]'
                                                    : ''
                                                }`}>
                                                {item.
                                                expireDate ? new Date(item.expireDate).toLocaleDateString('en-GB') : 'N/A'}
                                            </td> */}

                                            <td 
                                            className ={`p-1 ${isExpiringSoon(item.expireDate) ? 'text-[#be3e3f]' : 'text-[#1a1a1a]'
                                                }`}>
                                                {item.expireDate ? new Date(item.expireDate).toLocaleDateString('en-GB') : 'N/A'}
                                                
                                                <span className ='text-white'>--</span>

                                                {/* REMAINING ... */}
                                              
                                                <span
                                                    className={`p-1 ${getExpirationStatus(item.expireDate).className}`}>
                                                    {getExpirationStatus(item.expireDate).text}
                                                </span>   
                                                     
                                            </td>

                                            {/* <td className={`p-1 font-semibold text-md ${!item.expireDate
                                                    ? ''
                                                    : new Date(item.expireDate) < new Date()
                                                        ? 'text-[#be3e3f]'  // Red if expired
                                                        : (new Date(item.expireDate) - new Date()) <= (10 * 24 * 60 * 60 * 1000)
                                                            ? 'text-[#be3e3f]'  // Red if ≤10 days left
                                                            : ''
                                                }`}>
                                                {!item.expireDate
                                                    ? '—'
                                                    : (() => {
                                                        const today = new Date();
                                                        const expiryDate = new Date(item.expireDate);
                                                        const diffInMs = expiryDate - today;
                                                        const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24));

                                                        if (diffInDays < 0) {
                                                            return `Expired ${Math.abs(diffInDays)} days ago`;
                                                        } else if (diffInDays === 0) {
                                                            return 'Expires today';
                                                        } else {
                                                            return `Expires in ${diffInDays} days`;
                                                        }
                                                    })()}
                                            </td> */}

                                            <td className='p-1'>
                                                <button>
                                                    <LiaEditSolid 
                                                    className='w-5 h-5 text-[#0ea5e9] rounded-full'
                                                    />
                                                </button>
                                                <button 
                                                        onClick={() => { setSelectedStoreItem(item); setDeleteModalOpen(true); }}
                                                    >
                                                    <MdDeleteForever
                                                        className='w-5 h-5 text-[#be3e3f] rounded-full'
                                                    />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>

                        <tfoot>
                            <tr className="bg-[#F1E8D9] border-t-2 border-emerald-600 text-xs font-semibold text-[#1a1a1a]">
                                <td className="p-2" colSpan={1}>Count : </td>
                                <td className="p-2">{items.length}</td>
                                <td></td><td></td><td></td><td></td><td></td>
                            </tr>
                        </tfoot>
                    </table>

                </div>
            </div>

            {/* <BottomNav /> */}

            <ConfirmModal
                open= {deleteModalOpen}
                storeItemName ={selectedStoreItem?.storeitemName}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={() => {
                    removeStoresItems(selectedStoreItem._id);
                    setDeleteModalOpen(false);
                }}
            />


        </section>
    );
};


const ConfirmModal = ({ open, onClose, onConfirm, storeItemName }) => {
    if (!open) return null;
    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{ backgroundColor: 'rgba(102, 3, 3, 0.4)' }}  //rgba(0,0,0,0.4)
        >

            <div className="bg-white rounded-lg p-6 shadow-lg min-w-[300px]">
                {/* <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2> */}
                <p className="mb-6">Are you sure you want to remove <span className="font-semibold text-[#be3e3f]">{storeItemName}</span>?</p>
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




export default StoresItems;