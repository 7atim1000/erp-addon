import React , {useEffect, useState}from 'react'

import { motion } from 'framer-motion'
import { useMutation } from '@tanstack/react-query'
import { enqueueSnackbar } from 'notistack';
import { IoCloseCircle } from 'react-icons/io5';
import { toast } from 'react-toastify'

import { addStoresItems, api } from '../../https';

const StoresItemsAdd = ({setIsStoresItemsAddModal}) => {
    const handleClose = () => {
        setIsStoresItemsAddModal(false);
    };


    const [formData, setFormData] = useState({
        storeitemName: "", storeCategory: "", store: "", receiptPrice: "", exchangePrice :"", quantity: "", unit: "", expireDate: ""
    });
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleStoreSelect = (storeId) => {
        setFormData({ ...formData, store: storeId });
    };

    
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData)

        storesitemsMutation.mutate(formData)
        // window.location.reload()
        // setIsStoresItemsAddModal(false)

    };

    const storesitemsMutation = useMutation({
        mutationFn: (reqData) => addStoresItems(reqData),
        onSuccess: (res) => {

            const { data } = res;
            //console.log(data)
            //enqueueSnackbar(data.message, { variant: "success" });
            toast.success(data.message)

            formData.storeitemName ='';
            formData.storeitemName ='';
            formData.storeCategory ="";
         
            formData.receiptPrice ="";
            formData.exchangePrice ="";
            formData.quantity = "";
            formData.unit ="";
            formData.expireDate ="";

            //    setFormData({
            //     name: "",
            //     email: "",
            //     phone: "",
            //     password: "",
            //     role: "",
            // });
        },

        onError: (error) => {
            const { response } = error;
            enqueueSnackbar(response.data.message, { variant: "error" });

            console.log(error);
        },
    });

    // Selection fetch
    const [unitlist, setUnitList] = useState([])
    const fetchUnit = async () => {

        try {

            const response = await api.get('/api/storesunits') //
            if (response.data.success) {
                setUnitList(response.data.storesUnits);
            }
            else {
                toast.error(response.data.message)
            }


        } catch (error) {
            console.log(error)
            toast.error(error.message)

        }
    };

    // const [categorylist, setCategoryList] = useState([])
    // const fetchCategories = async () => {

    //     try {

    //         const response = await api.get('/api/storescategories')
    //         if (response.data.success) {
    //             setCategoryList(response.data.categories);
    //         }
    //         else {
    //             toast.error(response.data.message)
    //         }


    //     } catch (error) {
    //         console.log(error)
    //         toast.error(error.message)

    //     }
    // };

    
    const [storelist, setStoreList] = useState([])
    const fetchStores = async () => {

        try {

            const response = await api.get('/api/stores')
            if (response.data.success) {
                setStoreList(response.data.stores);
            }
            else {
                toast.error(response.data.message)
            }


        } catch (error) {
            console.log(error)
            toast.error(error.message)

        }
    };



    useEffect(() => {
        fetchUnit(), fetchStores();
    }, []);


    // Categories 
    // Here's the implementation that shows both functionalities:

    // A normal select dropdown that works without search
    // A search input that filters the select options in real - time

    const [categorylist, setCategoryList] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showSearch, setShowSearch] = useState(false);

    const fetchCategories = async () => {
        try {
            const response = await api.get('/api/storescategories');
            if (response.data.success) {
                setCategoryList(response.data.categories);
                setFilteredCategories(response.data.categories); // Initialize both lists
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // Load categories on component mount
    useEffect(() => {
        fetchCategories();
    }, []);

    // Filter categories when search term changes
    useEffect(() => {
        if (searchTerm) {
            const results = categorylist.filter(category =>
                category.storeCategoryName.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredCategories(results);
        } else {
            setFilteredCategories(categorylist); // Reset to full list when search is empty
        }
    }, [searchTerm, categorylist]);

    // const [categorylist, setCategoryList] = useState([]);
    // const [filteredCategories, setFilteredCategories] = useState([]);
    // const [searchTerm, setSearchTerm] = useState('');

    // const fetchCategories = async () => {
    //     try {
    //         const response = await api.get('/api/storescategories');
    //         if (response.data.success) {
    //             setCategoryList(response.data.categories);
    //             setFilteredCategories(response.data.categories);
    //         }
    //     } catch (error) {
    //         toast.error(error.message);
    //     }
    // };

    // useEffect(() => {
    //     const results = categorylist.filter(category =>
    //         category.storeCategoryName.toLowerCase().includes(searchTerm.toLowerCase())
    //     );
    //     setFilteredCategories(results);
    // }, [searchTerm, categorylist]);



    return(
        
        <div className ='fixed inset-0 bg-opacity-50 flex items-center justify-center shadow-lg/10 z-50 ' 
        style={{ backgroundColor: 'rgba(145, 143, 143, 0.4)'}}>
                    <motion.div
                        initial ={{opacity :0 , scale :0.9}}
                        animate ={{opacity :1, scale :1}}
                        exit ={{opacity :0, scale :0.9}}
                        transition ={{durayion :0.3 , ease: 'easeInOut'}}
                        className ='bg-white p-2 rounded-lg shadow-lg/30 w-120 md:mt-5 mt-5 h-[calc(100vh)]
                        overflow-y-scroll scrollbar-hidden'
                    >
                                
                                
                    {/*Modal Header */}
                    <div className="flex justify-between items-center mb-4 shadow-xl p-2">
                            <h2 className ='text-black text-sm font-bold'>Add Item</h2>
        
                        <button onClick ={handleClose} className ='rounded-xs text-[#be3e3f] hover:bg-[#be3e3f]/30 cursor-pointer
                        border-b border-[#be3e3f]'>
                            <IoCloseCircle size={25}/>
                        </button>
                    </div>
                                          
                    {/*Modal Body*/}
                    <form className ='mt-3 space-y-6 ' onSubmit ={handleSubmit}>
                                         
                    {/* <div className='mt-10 flex items-center justify-between gap-5'>
                        <label className='w-[20%] text-[#1f1f1f] block mb-2 mt-3 text-xs font-medium'>Store :</label>
                        <div className='flex w-full items-center rounded-lg p-2 px-4 bg-white shadow-sm'>

                            <select className='w-full bg-zinc-100 h-8 rounded-lg' 
                                
                                value={formData.store}
                                onChange={handleInputChange}
                                name='store'
                                required
                            >

                                <option className='text-[#1a1a1a] text-xs font-normal'>Select store ...</option>
                               
                                {storelist.map((store, index) => (
                                    <option key={index} value={store._id} className='text-sm font-semibold'>
                                        {store.storeName}
                                    </option>

                                ))};
                            </select>

                        </div>
                    </div> */}

                    {/* // In your JSX: */}
                    <div className='mt-5 flex items-center justify-between gap-5'>
                        <label className='w-[20%] text-[#1f1f1f] block mb-2 mt-3 text-xs font-medium'>Store :</label>
                        <div className='flex w-full flex-wrap gap-2'>
                            {storelist.map((store) => (
                                <button
                                    key={store._id}
                                    type="button"
                                    onClick={() => handleStoreSelect(store._id)}
                                    className={`px-4 py-2 rounded-sm text-sm font-semibold transition-colors cursor-pointer ${formData.store === store._id
                                            ? 'bg-[#0ea5e9] text-white'  // Selected style
                                            : 'bg-zinc-100 hover:bg-zinc-200 text-[#1a1a1a]'  // Default style
                                        }`}
                                >
                                    {store.storeName}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/*storeitemName: "", storeCategory: "", store: "", price: "", quantity: "", unit: "", expireDate: "" */}

                    {/* <div className='flex items-center justify-between gap-5'>
                        <label className='w-[20%] text-[#1f1f1f] block mb-2 mt-3 text-xs font-medium'>Category :</label>
                        <div className='flex w-full items-center rounded-lg p-2 px-4 bg-white shadow-sm'>

                            <select className='w-full bg-zinc-100 h-8 rounded-lg'

                                value={formData.storeCategory}
                                onChange={handleInputChange}
                                name='storeCategory'
                                required
                            >

                                <option className='text-[#1a1a1a] text-xs font-normal'>Select category ...</option>

                                {categorylist.map((category, index) => (
                                    <option key={index} value={category.storeCategoryName} className='text-sm font-semibold'>
                                        {category.storeCategoryName}
                                    </option>

                                ))};
                            </select>

                        </div>
                    </div> */}

                    {/* SELECT AND SEARCH  */}

                    <div className='flex items-center justify-between gap-5'>
                        <label className='w-[30%] text-[#1f1f1f] block mb-2 mt-3 text-xs font-medium'>
                            Category :
                        </label>
                        <div className='relative w-full'>
                            {/* Search Toggle Button */}
                            <button
                                type="button"
                                onClick={() => {
                                    setShowSearch(!showSearch);
                                    if (showSearch) {
                                        setSearchTerm(''); // Clear search when hiding
                                    }
                                }}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 z-10"
                            >
                                {showSearch ? '×' : '🔍'}
                            </button>

                            {/* Search Input (conditionally shown) */}
                            {showSearch && (
                                <input
                                    type="text"
                                    placeholder="Search categories..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full mb-2 bg-zinc-100 h-8 rounded-lg px-3 text-sm focus:outline-none border border-gray-300"
                                    autoFocus
                                />
                            )}

                            {/* Select Dropdown */}
                            <select
                                className='w-full bg-zinc-100 h-8 rounded-lg px-2 text-sm border border-gray-300'
                                value={formData.storeCategory}
                                onChange={handleInputChange}
                                name='storeCategory'
                                required
                            >
                                <option value="">Select category...</option>
                                {filteredCategories.map((category) => (
                                    <option
                                        key={category._id}
                                        value={category.storeCategoryName}
                                    >
                                        {category.storeCategoryName}
                                    </option>
                                ))}
                                {filteredCategories.length === 0 && (
                                    <option value="" disabled>No matching categories found</option>
                                )}
                            </select>
                        </div>
                    </div>

                    {/*storeitemName: "", storeCategory: "", store: "", price: "", quantity: "", unit: "", expireDate: "" */}
                    <div className='flex items-center justify-between gap-5'>
                        <label className='w-[30%] text-[#1f1f1f] block mb-2 mt-3 text-xs font-medium'>Item Name :</label>
                        <div className='flex w-full items-center rounded-lg py-3 px-4 bg-white shadow-sm'>
                            <input
                                type='text'
                                name='storeitemName'
                                value={formData.storeitemName}
                                onChange={handleInputChange}

                                placeholder='Enter Item name'
                                className='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none font-semibold text-sm border-b border-yellow-700 w-full'
                                required
                                autoComplete='none'
                            />
                        </div>
                    </div>
        
                
                    <div className='flex items-center justify-between gap-5'>
                        <label className='w-[30%] text-[#1f1f1f] block mb-2 mt-3 text-xs font-medium'>Receipt price  :</label>
                        <div className='flex w-full items-center rounded-lg py-3 px-4 bg-white shadow-sm'>
                            <input
                                type='text'
                                name='receiptPrice'
                                value={formData.receiptPrice}
                                onChange={handleInputChange}

                                placeholder='Enter receipt price of unit'
                                className='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none font-semibold text-sm border-b border-yellow-700 w-full'
                                required
                                autoComplete='none'
                            />
                        </div>
                    </div>   


                    <div className='flex items-center justify-between gap-5'>
                        <label className='w-[30%] text-[#1f1f1f] block mb-2 mt-3 text-xs font-medium'>Exchange price  :</label>
                        <div className='flex w-full items-center rounded-lg py-3 px-4 bg-white shadow-sm'>
                            <input
                                type='text'
                                name='exchangePrice'
                                value={formData.exchangePrice}
                                onChange={handleInputChange}

                                placeholder='Enter exchange price of unit'
                                className='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none font-semibold text-sm border-b border-yellow-700 w-full'
                                required
                                autoComplete='none'
                            />
                        </div>
                    </div>             
                            
                    <div className='flex items-center justify-between gap-5'>
                        <label className='w-[30%] text-[#1f1f1f] block mb-2 mt-3 text-xs font-medium'>Quantity:</label>
                        <div className='w-full  items-center rounded-lg py-3 px-4 bg-white shadow-sm'>
                            <input
                                type='text'
                                name='quantity'
                                value={formData.quantity}
                                onChange={handleInputChange}

                                placeholder='Available Quantity'
                                className='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none text-sm font-semibold border-b border-yellow-700 w-full'
                                required
                                autoComplete='none'
                            />
                        </div>
                    </div>


                    {/*storeitemName: "", storeCategory: "", store: "", price: "", quantity: "", unit: "", expireDate: "" */}

                    <div className='flex items-center justify-between gap-5'>
                        <label className='w-[30%] text-[#1f1f1f] block mb-2 mt-3 text-xs font-medium'>Unit :</label>
                        <div className='w-full flex items-center rounded-lg p-2 px-4 bg-white shadow-sm'>

                            <select className='w-full bg-zinc-100 h-8 rounded-lg'

                                value={formData.unit}
                                onChange={handleInputChange}
                                name='unit'
                                required
                            >

                                <option className='text-[#1a1a1a] text-xs font-normal text-xs'>Select unit ...</option>

                                {unitlist.map((unit, index) => (
                                    <option key={index} value={unit.storeunitName} className='text-sm font-semibold'>
                                        {unit.storeunitName}
                                    </option>

                                ))};
                            </select>

                        </div>
                    </div>


                    <div className ='flex items-center justify-between gap-5'>
                        <label className='w-[30%] text-[#1f1f1f] block mb-2 mt-3 text-xs font-medium'>Expire date  :</label>
                        <div className='flex w-full items-center rounded-lg py-3 px-4 bg-white shadow-sm'>
                            <input
                                type='date'
                                name='expireDate'
                                value={formData.expireDate}
                                onChange={handleInputChange}

                                placeholder='Enter expire date of item'
                                className='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none font-semibold text-sm border-b border-yellow-700 w-full'
                                required
                                autoComplete='none'
                            />
                        </div>
                    </div>        

                    <button
                        type='submit'
                        className='p-3 rounded-xs py-3 text-sm bg-[#0ea5e9] text-white font-semibold 
                    cursor-pointer '
                    >
                        Add Item
                    </button>
                                                  
                                         
                </form>
        
                </motion.div>
            </div>
    );
} ;



export default StoresItemsAdd ;