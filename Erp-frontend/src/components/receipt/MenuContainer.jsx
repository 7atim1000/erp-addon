import React, {useState}from 'react' ;

import { FcSearch } from "react-icons/fc";

import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { enqueueSnackbar } from 'notistack'

import { getBgColor } from '../../utils';
import { GrRadialSelected } from 'react-icons/gr';
import { getStores, getStoresItemsInvoice } from '../../https';
import ItemsCart from './ItemsCart';

const MenuContainer = () => {
    
    const { data: responseData, IsError } = useQuery({
        queryKey: ['stores'],

        queryFn: async () => {
            return await getStores();
        },

        placeholderData: keepPreviousData,
    });

    if (IsError) {
        enqueueSnackbar('Something went wrong!', { variant: 'error' });
    }
    console.log(responseData);


    // Implementing Search Functionality in Your Service List
    const [searchTerm, setSearchTerm] = useState('');
    // fetch Sevices
    const { data: resData, isError } = useQuery({
        queryKey: ['items', searchTerm],

        queryFn: async () => {
            return await getStoresItemsInvoice(searchTerm);
        },
        placeholderData: keepPreviousData,
    });
    if (isError) {
        enqueueSnackbar('Something went wrong!', { variant: 'error' })
    }

    console.log(resData);

    const [selectedStore, setSelectedStore] = useState(`Store -1`);



    return(
        <>
            <div className='flex w-full gap-1 justify-start items-start'>

                {/* grid grid-cols-3 */}

                <div className='flex flex-col justify-between items-center gap-1 w-full p-2 bg-white shadow-xl'>
                    {/*SEARCH*/}
                    <div className='flex items-center gap-2 bg-white rounded-sm p-1 shadow-lg/30 w-[100%] mb-1'>
                        <FcSearch className='text-sky-600' />

                        <input
                            type='text'
                            placeholder="search"
                            className='bg-transparent outline-none text-[#1a1a1a]  w-full border-b-1 border-[#0ea5e9]'

                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>


                    <div className='flex items-start justify-between flex-wrap gap-1 w-full px-2 py-2 rounded-sm 
                    overflow-y-scroll scrollbar-hidden  h-[calc(100vh-8rem)]'>

                        {resData?.data.data.filter(i => i.store === selectedStore).map((item) => {


                            return (
                                <ItemsCart id={item._id} name={item.storeitemName} price={item.exchangePrice} quantity={item.quantity}
                                    unit={item.unit} cat={item.storeCategory} expire={item.expireDate} store={item.store} />
                            )
                        })
                        }


                    </div>

                </div>

                <div className='flex-col justify-between w-[15%] bg-white px-1 py-4 shadow-xl/30 h-[calc(100vh-3rem)]'>
                    {responseData?.data.data.map(store => (

                        <button className='w-[100%] grid grid-cols-1 p-1 items-center  mb-3 rounded-lg h-[50px] cursor-pointer 
                            shadow-lg/30 bg-[#f5f5f5]'
                            onClick={() => setSelectedStore(store.storeName)}
                        >

                            <div className='flex items-center justify-between w-full shadow-lg/30 px-3'>
                                <h1 className='text-sm font-semibold text-[#1a1a1a]'>{store.storeName}</h1>
                                {selectedStore === store.storeName && <GrRadialSelected className='text-[#0ea5e9]' size={15} />}
                            </div>
                        </button>

                    ))}

                </div>
            </div>
        </>

    );
};


export default MenuContainer ;