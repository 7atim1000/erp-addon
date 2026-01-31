import React , {useState} from 'react'
import { addRepresentative } from '../../https';
import { useMutation } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { enqueueSnackbar } from 'notistack';
import { IoCloseCircle } from 'react-icons/io5';

const RepresentativeAdd = ({setIsRepModalOpen}) => {

    const handleClose = () => {
        setIsRepModalOpen(false)
    }

    const [formData, setFormData] = useState({
        repName :"", contactNo :"", address :"", balance :0
    });

    const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({...prev, [name] : value}));
    };


    const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData)

    RepMutation.mutate(formData)
    window.location.reload()
    setIsRepModalOpen(false)
    };

    const RepMutation = useMutation({
        mutationFn: (reqData) => addRepresentative(reqData),
        onSuccess: (res) => {
                
        const { data } = res;
        //console.log(data)
        enqueueSnackbar(data.message, { variant: "success"});
        },
                
        onError: (error) => {
            const { response } = error;
            enqueueSnackbar(response.data.message, { variant: "error"});
                
        console.log(error);
        },
    });



    return (
        <div className ='fixed inset-0 bg-opacity-50 flex items-center justify-center shadow-lg/10 z-50'>
            <motion.div
                initial ={{opacity :0 , scale :0.9}}
                animate ={{opacity :1, scale :1}}
                exit ={{opacity :0, scale :0.9}}
                transition ={{durayion :0.3 , ease: 'easeInOut'}}
                className ='bg-zinc-100 p-6 rounded-lg shadow-lg/30 w-120 md:mt-5 mt-5'
            >
                                        
                                        
            {/*Modal Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className ='text-black text-sm font-semibold'>Add Representative</h2>
                    <button onClick ={handleClose} className ='rounded-full  text-red-700 cursor-pointer'>
                        <IoCloseCircle size={25}/>
                    </button>
                </div>
                                                  
                {/*Modal Body*/}
                <form className ='mt-3 space-y-6' onSubmit ={handleSubmit}>
                    <div>
                        <label className ='text-[#1f1f1f] block mb-2 mt-3 text-sm font-normal'>Repesentative Name :</label>
                        <div className ='flex items-center rounded-lg p-2 px-4 bg-white shadow-lg/30'>
                            <input 
                                type ='text'
                                name ='repName'
                                value ={formData.repName}
                                onChange ={handleInputChange}
                                                          
                                placeholder = 'Enter representative name'
                                className ='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none'
                                required
                                autoComplete='none'
                            />
                        </div>
                    </div>
                
                        
                    <div>
                        <label className ='text-[#1f1f1f] block mb-2 mt-3 text-sm font-normal'>Contact number : </label>
                        <div className ='flex items-center rounded-lg p-2 px-4 bg-white shadow-lg/30'>
                            <input 
                                type ='text'
                                name ='contactNo'
                                value ={formData.contactNo}
                                onChange ={handleInputChange}
                                                          
                                placeholder = '+971 9999999'
                                className ='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none'
                                required
                                autoComplete='none'
                            />
                        </div>       
                    </div>        
                                    
                    <div>
                        <label className ='text-[#1f1f1f] block mb-2 mt-3 text-sm font-normal'>Address : </label>
                        <div className ='flex items-center rounded-lg p-2 px-4 bg-white shadow-lg/30'>
                            <input 
                                type ='text'
                                name ='address'
                                value ={formData.address}
                                onChange ={handleInputChange}
                                placeholder = 'Enter address of representative'
                                className ='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none'
                                required
                                autoComplete='none'
                            />
                        
                            </div>
                        </div>
                                              
                    <div>
                        <label className ='text-[#1f1f1f] block mb-2 mt-3 text-sm font-normal'>Balance : </label>
                        <div className ='flex items-center rounded-lg p-2 px-4 bg-white shadow-lg/30'>
                            <input 
                                type ='text'
                                name ='balance'
                                value ={formData.balance}
                                onChange ={handleInputChange}
                                                          
                                placeholder = 'Enter opening balance of representative'
                                className ='bg-transparent flex-1 text-[#1a1a1a] focus:outline-none'
                                required
                                autoComplete='none'
                            />
                        
                        </div>
                    </div>
                
                
                                   
                               
                    <button
                        type ='submit'
                        className ='w-full rounded-lg mt-6 py-3 text-sm bg-zinc-500 text-white font-semibold cursor-pointer hover:bg-green-600 hover:text-white'
                    >
                        Add New
                    </button>
                                                          
                                                 
                </form>
                
            </motion.div>
        </div>
        
    );
};


export default RepresentativeAdd ;