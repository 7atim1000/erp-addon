import React, { useState } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getBgColor } from '../../utils';
import { GrRadialSelected } from 'react-icons/gr';
import { FaBox, FaFilter, FaChevronRight, FaLayerGroup } from 'react-icons/fa';
import { getCategories, getServices } from '../../https';
import BuyItemsCard from './BuyItemsCard';

const BuyMenuContainer = () => {
    // fetch categories from DB :-
    const { data: responseData, isError: categoriesError } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            return await getCategories();
        },
        placeholderData: keepPreviousData,
    });

    if (categoriesError) {
        console.error('Error fetching categories');
    }

    // get Services
    const { data: resData, isError: servicesError } = useQuery({
        queryKey: ['services'],
        queryFn: async () => {
            return await getServices();
        },
        placeholderData: keepPreviousData,
    });
    
    if (servicesError) {
        console.error('Error fetching services');
    }

    // select items from categories
    const [selectedCategory, setSelectedCategory] = useState('Housewares');  // to select items from category Dynamic
    
    // Get filtered services based on selected category
    const filteredServices = resData?.data.data.filter(service => service.category === selectedCategory) || [];

    return (
        <div className="bg-gradient-to-b from-white to-blue-50 rounded-2xl shadow-lg border border-blue-100 p-4 md:p-6 lg:p-8">
            {/* Header */}
            <div className="mb-6 md:mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-2.5 rounded-xl shadow-sm">
                        <FaBox className="text-white w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold text-gray-800">Browse Products</h2>
                        <p className="text-sm text-gray-500">Select a category to view available items</p>
                    </div>
                </div>
                
                {/* Category Count */}
                <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full">
                        <FaLayerGroup className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-700">
                            {responseData?.data.data.length || 0} Categories
                        </span>
                    </div>
                    
                    <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full">
                        <FaBox className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-sm font-medium text-emerald-700">
                            {filteredServices.length} Items
                        </span>
                    </div>
                </div>
            </div>

            {/* Category Selection - Responsive Grid */}
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                    <FaFilter className="w-4 h-4 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-700">Categories</h3>
                    <span className="text-xs text-gray-400 ml-auto">
                        Select a category
                    </span>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-2">
                    {responseData?.data.data.map(category => {
                        const isSelected = selectedCategory === category.categoryName;
                        return (
                            <button
                                key={category.categoryName}
                                className={`flex items-center justify-between p-3 md:p-4 rounded-xl transition-all duration-300 cursor-pointer border group ${
                                    isSelected
                                        ? 'border-blue-300 shadow-md shadow-blue-100/50'
                                        : 'border-blue-100 hover:border-blue-200 hover:shadow-sm'
                                }`}
                                style={{ 
                                    backgroundColor: isSelected ? getBgColor() : '#ffffff',
                                    backgroundImage: isSelected 
                                        ? `linear-gradient(135deg, ${getBgColor()} 0%, ${getBgColor()}80 100%)`
                                        : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
                                }}
                                onClick={() => setSelectedCategory(category.categoryName)}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${
                                        isSelected
                                            ? 'bg-white/30'
                                            : 'bg-blue-50'
                                    }`}>
                                        <FaBox className={`w-3.5 h-3.5 ${
                                            isSelected ? 'text-white' : 'text-blue-600'
                                        }`} />
                                    </div>
                                    <span className={`text-sm font-medium truncate ${
                                        isSelected ? 'text-white' : 'text-gray-700'
                                    }`}>
                                        {category.categoryName}
                                    </span>
                                </div>
                                
                                {isSelected && (
                                    <GrRadialSelected className="text-white w-5 h-5 flex-shrink-0" />
                                )}
                                
                                {!isSelected && (
                                    <FaChevronRight className="text-blue-300 w-4 h-4 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                                )}
                            </button>
                        );
                    })}
                </div>
                
                {/* Selected Category Indicator */}
                <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        <span className="text-sm text-gray-600">
                            Selected: <span className="font-semibold text-blue-700">{selectedCategory}</span>
                        </span>
                    </div>
                    <span className="text-xs text-gray-500">
                        {filteredServices.length} items available
                    </span>
                </div>
            </div>

            {/* Divider */}
            <div className="relative mb-8">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-blue-100"></div>
                </div>
                <div className="relative flex justify-center">
                    <span className="px-4 bg-gradient-to-r from-blue-50 to-white text-sm text-gray-500">
                        Products in {selectedCategory}
                    </span>
                </div>
            </div>

            {/* Products Grid - Responsive */}
            <div>
                {filteredServices.length === 0 ? (
                    <div className="text-center py-12 px-4">
                        <div className="mb-4 inline-flex p-4 bg-blue-50 rounded-full">
                            <FaBox className="w-8 h-8 text-blue-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">No Products Found</h3>
                        <p className="text-gray-500 max-w-md mx-auto">
                            No items available in the <span className="font-medium text-blue-600">{selectedCategory}</span> category.
                            Please select another category.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                        {filteredServices.map((service, index) => (
                            <div 
                                key={service._id}
                                className="transform transition-transform duration-300 hover:-translate-y-1"
                            >
                                <BuyItemsCard 
                                    id={service._id} 
                                    name={service.serviceName} 
                                    price={service.price} 
                                    qty={service.qty} 
                                    unit={service.unit} 
                                    cat={service.category}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer Stats */}
            <div className="mt-8 pt-6 border-t border-blue-100">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-lg shadow-sm">
                                <FaLayerGroup className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-xs text-blue-700 mb-1">Total Categories</p>
                                <p className="text-xl font-bold text-blue-900">
                                    {responseData?.data.data.length || 0}
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-lg shadow-sm">
                                <FaBox className="w-4 h-4 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-xs text-emerald-700 mb-1">Current Category Items</p>
                                <p className="text-xl font-bold text-emerald-900">
                                    {filteredServices.length}
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-violet-50 to-violet-100 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-lg shadow-sm">
                                <FaFilter className="w-4 h-4 text-violet-600" />
                            </div>
                            <div>
                                <p className="text-xs text-violet-700 mb-1">Selected</p>
                                <p className="text-lg font-bold text-violet-900 truncate">
                                    {selectedCategory}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BuyMenuContainer;

// import React, { useState } from 'react'

// import { keepPreviousData, useQuery } from '@tanstack/react-query'

// import { getBgColor } from '../../utils';
// import { GrRadialSelected } from 'react-icons/gr';

// import { getCategories, getServices } from '../../https';
// import BuyItemsCard from './BuyItemsCard';

// const BuyMenuContainer = () => {
//     // fetch categories from DB :-
//     const { data: responseData, IsError } = useQuery({
//         queryKey: ['categories'],
    
//         queryFn: async () => {
//         return await getCategories();
//         },
                    
//         placeholderData: keepPreviousData,
//     });
    
//     if (IsError) {
//         enqueueSnackbar('Something went wrong!', { variant: 'error' });
//     }
//     console.log(responseData); 

    
//     // get Sevices
//     const { data: resData, isError} = useQuery({
//     queryKey :['services'],
    
//     queryFn : async () => {
//         return await getServices();
//     },
//         placeholderData: keepPreviousData,
//     });
//     if(isError) {
//         enqueueSnackbar('Something went wrong!', { variant: 'error' })
//     }
    
//     console.log(resData); 

//     // select items from categories
//     const [selectedCategory, setSelectedCategory] = useState(`Housewares`)  // to select items from category Dynamic
        
    
    
//     return (
//         <>
//             <div className ='grid grid-cols-5 gap-4 px-10 py-4 mt-0 w-[100%] bg-white rounded-lg shadow-xl'>
//             {/* {categories.map(category => (  */}
//             {responseData?.data.data.map(category => ( 
//                 <div key={category.categoryName} className ='flex flex-col items-center justify-between p-4 rounded-lg h-[70px] cursor-pointer shadow-lg/30'
//                     style = {{backgroundColor : getBgColor()}}

//                     // selected Item
//                     onClick = {() => setSelectedCategory(category.categoryName)}
//                 >
                        
//                     <div className ='flex items-center justify-between w-full shadow-lg/30'>
                   
//                         <h1 className ='text-md font-semibold text-white'>{category.categoryName}</h1>
//                         {selectedCategory === category.categoryName && <GrRadialSelected className  ='text-white' size={20}/>}
                   
//                     </div>
        
//                 </div>
                   
//             ))} 
                                   
//             </div>    
                    
//             <hr className ='border-white border-t-2 mt-2' />

            
//                 <div className ='grid grid-cols-4 gap-4 px-10 py-4 w-[100%] bg-white rounded-lg overflow-y-scroll scrollbar-hidden  h-[calc(100vh-5rem-15rem)] rounded-lg shadow-xl '>
//                     {
//                     resData?.data.data.filter(i => i.category === selectedCategory).map((service) => { // Dinamic
                                
//                         return (   //flex flex-col items-center justify-between p-4 rounded-lg h-[70px] cursor-pointer
//                             <BuyItemsCard id={service._id} name={service.serviceName} price={service.price} qty={service.qty} unit={service.unit} cat={service.category}  />
//                             )
//                         })
//                     }
//                 </div>
    
        
//         </>
//     );
// }

// export default BuyMenuContainer ;