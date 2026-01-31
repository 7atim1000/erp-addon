import React, { useEffect, useState } from 'react'

import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { enqueueSnackbar } from 'notistack'

import { getBgColor } from '../../utils';
import { GrRadialSelected } from 'react-icons/gr';

import { getCategories, getServices } from '../../https';
import ItemsCard from './ItemsCard';

const MenuContainer = () => {

    // fetch categories from DB :-
    const { data: responseData, IsError } = useQuery({
        queryKey: ['categories'],
    
        queryFn: async () => {
        return await getCategories();
        },
                    
        placeholderData: keepPreviousData,
    });
    
    if (IsError) {
        enqueueSnackbar('Something went wrong!', { variant: 'error' });
    }
    console.log(responseData); 

    
    // get Sevices
    // const { data: resData, isError} = useQuery({
    // queryKey :['services'],
    
    // queryFn : async () => {
    //     return await getServices();
    // },
    //     placeholderData: keepPreviousData,
    // });
    // if(isError) {
    //     enqueueSnackbar('Something went wrong!', { variant: 'error' })
    // }
    
    // console.log(resData); 
    const [services, setServices] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [pagination, setPagination] = useState({});

    const fetchServices = async (filters = {}) => {
        try {
            const response = await getServices({
                category: filters.category || 'all',
                search: filters.search || '',
                sort: filters.sort || '-createdAt',
                page: filters.page || 1,
                limit: filters.limit || 10
            });
            setServices(response.data.data || response.data.services);
            setPagination(response.data.pagination);
        } catch (error) {
            console.error(error);
        }
    };

    // Fetch services when category changes
    useEffect(() => {
        fetchServices({
            category: selectedCategory === 'all' ? '' : selectedCategory,
            page: 1 // Reset to first page when category changes
        });
    }, [selectedCategory]);

    
    
    return (
        <>
         
            <div className='flex w-full gap-1 justify-start items-start p-1'>

                {/* Categories Sidebar */}
                <div className='flex-col justify-between p-2 w-[16%] bg-white shadow-xl/30 rounded-md h-[calc(92vh)]'>
                    {/* Add "All" category button */}
                    <button
                        className='w-[100%] grid grid-cols-1 p-1 items-center mb-3 rounded-lg h-[50px] cursor-pointer shadow-lg/30'
                        style={{ backgroundColor: selectedCategory === 'all' ? getBgColor() : '#f3f4f6' }}
                        onClick={() => setSelectedCategory('all')}
                    >
                        <div className='flex items-center justify-between w-full shadow-lg/30'>
                            <h1 className='text-xs font-semibold' style={{ color: selectedCategory === 'all' ? 'white' : 'black' }}>
                                All Categories
                            </h1>
                            {selectedCategory === 'all' && <GrRadialSelected className='text-[#e6e6e6]' size={20} />}
                        </div>
                    </button>

                    {responseData?.data.data.map(category => (
                        <button
                            key={category._id}
                            className='w-[100%] grid grid-cols-1 p-1 items-center mb-3 rounded-lg h-[50px] 
                                    cursor-pointer shadow-lg/30 '
                            style={{ backgroundColor: selectedCategory === category.categoryName ? getBgColor() : '#f3f4f6' }}
                            onClick={() => setSelectedCategory(category.categoryName)}
                        >
                            <div className='flex items-center justify-between w-full shadow-lg/30'>
                                <h1
                                    className='text-xs font-semibold'
                                    style={{ color: selectedCategory === category.categoryName ? 'white' : 'black' }}
                                >
                                    {category.categoryName}
                                </h1>
                                {selectedCategory === category.categoryName && <GrRadialSelected className='text-[#e6e6e6]' size={20} />}
                            </div>
                        </button>
                    ))}
                </div>

                {/* Services Grid */}
                <div className='flex h-[calc(92vh)] items-start justify-between flex-wrap gap-2 px-2 py-2 bg-white rounded-lg overflow-y-scroll scrollbar-hidden w-[84%]'>
                    {services.length > 0 ? (
                        services.map((service) => (
                            <ItemsCard
                                key={service._id}
                                id={service._id}
                                name={service.serviceName}
                                price={service.price}
                                qty={service.qty}
                                unit={service.unit}
                                cat={service.category}
                            />
           
                        ))
                    ) : (
                        <div className="flex items-center justify-center w-full h-32">
                            <p className="text-gray-500">No services found in this category</p>
                        </div>
                    )}
                </div>
            </div>
        
        
        
        
        </>
    );
}

export default MenuContainer ;